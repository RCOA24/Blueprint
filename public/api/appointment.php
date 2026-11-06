<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['message' => $message]);
    exit;
}

function unavailable(string $reason): void
{
    // Log only a fixed diagnostic category; SMTP exceptions can contain sensitive data.
    error_log('Blueprint appointment: ' . $reason);
    respond(503, 'Email service is unavailable.');
}

/** Count every POST, including invalid requests, in one bounded private file. */
function limitRequests(string $directory): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    if (!is_string($ip) || !filter_var($ip, FILTER_VALIDATE_IP)) unavailable('rate limiter invalid client address');
    if (!is_dir($directory)) unavailable('rate limiter private directory missing');
    $path = $directory . '/rate-limit.json';
    if (is_link($path)) {
        unavailable('rate limiter storage is a symlink');
    }
    $file = @fopen($path, 'c+b');
    if ($file === false) {
        unavailable('rate limiter storage open failed');
    }
    @chmod($path, 0600);
    if (!flock($file, LOCK_EX)) {
        fclose($file);
        unavailable('rate limiter storage lock failed');
    }
    $content = stream_get_contents($file, 1048577);
    $state = $content === '' ? [] : json_decode((string) $content, true);
    if ($content === false || strlen($content) > 1048576 || !is_array($state)) {
        flock($file, LOCK_UN);
        fclose($file);
        unavailable('rate limiter storage invalid');
    }
    $now = time();
    $window = 900;
    foreach ($state as $key => $timestamps) {
        if (!is_array($timestamps)) {
            flock($file, LOCK_UN);
            fclose($file);
            unavailable('rate limiter storage invalid');
        }
        $state[$key] = array_values(array_filter($timestamps, static fn ($stamp) => is_int($stamp) && $stamp > $now - $window && $stamp <= $now));
        if (!$state[$key]) {
            unset($state[$key]);
        }
    }
    $key = hash('sha256', $ip);
    if (!isset($state[$key]) && count($state) >= 4096) {
        flock($file, LOCK_UN);
        fclose($file);
        unavailable('rate limiter capacity reached');
    }
    $attempts = $state[$key] ?? [];
    if (count($attempts) >= 8) {
        $retryAfter = max(1, $attempts[0] + $window - $now);
        flock($file, LOCK_UN);
        fclose($file);
        header('Retry-After: ' . $retryAfter);
        respond(429, 'Please wait before trying again.');
    }
    $attempts[] = $now;
    $state[$key] = $attempts;
    $encoded = json_encode($state);
    rewind($file);
    $written = is_string($encoded) && ftruncate($file, 0) && fwrite($file, $encoded) === strlen($encoded) && fflush($file);
    flock($file, LOCK_UN);
    fclose($file);
    if (!$written) {
        unavailable('rate limiter storage write failed');
    }
}

function field(string $key, int $maximum, bool $multiline = false): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value) || strlen($value) > $maximum || preg_match('//u', $value) !== 1 ||
        preg_match($multiline ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', $value)) {
        respond(422, 'Please check the form fields.');
    }
    return trim($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
}

// GoDaddy: /home/account/public_html/blueprint.ky/api -> /home/account.
$privateDirectory = dirname(__DIR__, 3) . '/blueprint-mail';
limitRequests($privateDirectory);

$length = $_SERVER['CONTENT_LENGTH'] ?? '';
if (!is_string($length) || ($length !== '' && (!ctype_digit($length) || (float) $length > 16384))) {
    respond(413, 'Request too large.');
}

$website = field('website', 500);
if ($website !== '') {
    respond(200, 'Request accepted.');
}

// Limits are bytes, leaving room for multibyte characters in names and messages.
$name = field('name', 480);
$email = field('email', 254);
$phone = field('phone', 120);
$service = field('service', 100);
$date = field('date', 10);
$time = field('time', 30);
$message = field('message', 8000, true);

$services = [
    'General construction', 'Architectural services', 'Remodeling & renovation',
    'Blueprint Fencing', 'Products & fencing supplies', 'Other enquiry',
];
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($service, $services, true) || !in_array($time, ['Morning', 'Afternoon', 'No preference'], true)) {
    respond(422, 'Please check the required fields.');
}

$preferredDate = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('America/Cayman'));
$today = new DateTimeImmutable('today', new DateTimeZone('America/Cayman'));
if (!$preferredDate || $preferredDate->format('Y-m-d') !== $date || $preferredDate < $today) {
    respond(422, 'Please choose a valid date.');
}

$configFile = $privateDirectory . '/config.php';
$autoloadFile = $privateDirectory . '/vendor/autoload.php';
if (!is_file($configFile) || !is_readable($configFile)) {
    unavailable('mail configuration missing');
}
$smtpStage = 'setup';
try {
    $config = require $configFile;
    if (!is_array($config)) {
        unavailable('mail configuration invalid');
    }
    foreach (['host', 'username', 'password', 'from'] as $key) {
        if (!isset($config[$key]) || !is_string($config[$key]) || trim($config[$key]) === '' || preg_match('/[\r\n\x00]/', $config[$key])) {
            unavailable('mail configuration invalid');
        }
    }
    $recipient = $config['recipient'] ?? 'info@blueprint.ky';
    if (!is_string($recipient) || !filter_var($recipient, FILTER_VALIDATE_EMAIL) ||
        !filter_var($config['from'], FILTER_VALIDATE_EMAIL) ||
        !filter_var($config['host'], FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) ||
        !in_array($config['port'] ?? null, [465, 587], true) ||
        $config['host'] === 'smtp.example.com' || $config['password'] === 'replace-with-smtp-password') {
        unavailable('mail configuration invalid');
    }
    if (!is_file($autoloadFile) || !is_readable($autoloadFile)) {
        unavailable('mail dependency missing');
    }
    require $autoloadFile;
    if (!class_exists(PHPMailer\PHPMailer\PHPMailer::class)) {
        unavailable('mail dependency invalid');
    }
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    // Temporary diagnostics: retain only fixed stage labels, never SMTP traffic.
    $mail->SMTPDebug = 1;
    $mail->Debugoutput = static function ($line, $level) use (&$smtpStage): void {
        if (strpos($line, 'CLIENT -> SERVER: STARTTLS') === 0) $smtpStage = 'tls';
        elseif (strpos($line, 'CLIENT -> SERVER: AUTH ') === 0) $smtpStage = 'authentication';
        elseif (strpos($line, 'CLIENT -> SERVER: MAIL FROM:') === 0) $smtpStage = 'message submission';
    };
    $mail->Host = $config['host'];
    $mail->Port = $config['port'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = $mail->Port === 465
        ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Timeout = 15;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from'], 'Blueprint Group');
    $mail->addAddress($recipient);
    $mail->addCC($email, $name);
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Appointment request - ' . $service;
    $mail->Body = implode("\n", [
        'New appointment request', '', 'Full name: ' . $name, 'Email address: ' . $email,
        'Contact number: ' . ($phone ?: 'Not provided'), 'Service: ' . $service,
        'Preferred date: ' . $date, 'Preferred time of day: ' . $time . ' (Cayman Islands time)',
        '', 'Additional message:', $message ?: 'None', '', 'The team will reply to confirm availability.',
    ]);
    $mail->isHTML(false);
    $smtpStage = 'connection or implicit TLS';
    $mail->send();
    respond(200, 'Request accepted.');
} catch (Throwable $exception) {
    unavailable('mail submission failed; stage: ' . $smtpStage);
}
