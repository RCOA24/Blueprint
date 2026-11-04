<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    respond(413, 'Request too large.');
}

if (!empty($_POST['website'])) {
    respond(200, 'Request received.');
}

function field(string $key, int $maximum): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        respond(422, 'Invalid form data.');
    }
    $value = trim($value);
    if (strlen($value) > $maximum) {
        respond(422, 'A field is too long.');
    }
    return $value;
}

$name = field('name', 120);
$email = field('email', 254);
$phone = field('phone', 60);
$service = field('service', 100);
$date = field('date', 10);
$time = field('time', 30);
$message = field('message', 4000);

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
    respond(422, 'Please choose a valid future date.');
}

// The upload places this endpoint in public_html/api and this private folder beside public_html.
$privateDirectory = dirname(__DIR__, 2) . '/blueprint-mail';
$configFile = $privateDirectory . '/config.php';
$autoloadFile = $privateDirectory . '/vendor/autoload.php';
if (!is_file($configFile) || !is_file($autoloadFile)) {
    error_log('Blueprint appointment mail configuration is missing.');
    respond(503, 'Email service is unavailable.');
}

$config = require $configFile;
require $autoloadFile;

try {
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->Port = (int) $config['port'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = $mail->Port === 465
        ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from'], 'Blueprint Group');
    $mail->addAddress($config['recipient'] ?? 'info@blueprint.ky');
    $mail->addCC($email, $name);
    $mail->addReplyTo($email, $name);
    $mail->Subject = 'Appointment request - ' . $service;
    $lines = [
        'New appointment request', '',
        'Full name: ' . $name,
        'Email address: ' . $email,
        'Contact number: ' . ($phone ?: 'Not provided'),
        'Service: ' . $service,
        'Preferred date: ' . $date,
        'Preferred time of day: ' . $time . ' (Cayman Islands time)',
        '', 'Additional message:', $message ?: 'None', '',
        'The team will reply to confirm availability.',
    ];
    $mail->isHTML(false);
    $mail->Body = implode("\n", $lines);
    $mail->send();
    respond(200, 'Request sent.');
} catch (Throwable $exception) {
    error_log('Blueprint appointment mail failed: ' . $exception->getMessage());
    respond(503, 'Email service is unavailable.');
}
