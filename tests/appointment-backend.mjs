import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

// Exercise the real endpoint in isolated PHP processes with a fake PHPMailer autoloader.
const php = process.env.PHP_BINARY || 'php';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blueprint-appointment-'));
const web = path.join(root, 'public_html', 'api');
const privateDir = path.join(root, 'blueprint-mail');
const vendor = path.join(privateDir, 'vendor');
fs.mkdirSync(web, { recursive: true });
fs.mkdirSync(vendor, { recursive: true });
fs.copyFileSync('public/api/appointment.php', path.join(web, 'appointment.php'));
const configPath = path.join(privateDir, 'config.php');
const autoloadPath = path.join(vendor, 'autoload.php');
const capturePath = path.join(root, 'capture.json');
const config = `<?php return ['host'=>'smtp.test.example', 'port'=>465, 'username'=>'sender@example.com', 'password'=>'test-password', 'from'=>'sender@example.com', 'recipient'=>'info@blueprint.ky'];`;
const mock = `<?php
namespace PHPMailer\\PHPMailer;
class PHPMailer {
    const ENCRYPTION_SMTPS = 'ssl'; const ENCRYPTION_STARTTLS = 'tls';
    public $Host, $Port, $SMTPAuth, $Username, $Password, $SMTPSecure, $Timeout, $CharSet, $Subject, $Body;
    private $recipients = [];
    public function __construct($exceptions = false) {}
    public function isSMTP() {}
    public function setFrom($address, $name) { $this->recipients['from'] = $address; }
    public function addAddress($address) { $this->recipients['to'] = $address; }
    public function addCC($address, $name) { $this->recipients['cc'] = $address; }
    public function addReplyTo($address, $name) { $this->recipients['replyTo'] = $address; }
    public function isHTML($value) {}
    public function send() {
        if (getenv('BLUEPRINT_TEST_FAIL') === '1') throw new \\RuntimeException('test-secret');
        file_put_contents(getenv('BLUEPRINT_TEST_CAPTURE'), json_encode(['recipients'=>$this->recipients, 'encryption'=>$this->SMTPSecure, 'body'=>$this->Body]));
        return true;
    }
}`;
fs.writeFileSync(configPath, config);
fs.writeFileSync(autoloadPath, mock);
const wrapper = path.join(root, 'request.php');
fs.writeFileSync(wrapper, `<?php
$input = json_decode(base64_decode($argv[2]), true);
$_POST = $input['fields'];
$_SERVER['REQUEST_METHOD'] = $input['method'] ?? 'POST';
$_SERVER['REMOTE_ADDR'] = $input['ip'] ?? '127.0.0.1';
$_SERVER['CONTENT_LENGTH'] = (string) ($input['length'] ?? 100);
register_shutdown_function(function () { echo "\\nSTATUS:" . http_response_code(); });
require $argv[1];
`);
const tomorrow = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 10);
const valid = { website: '', name: 'José 李', email: 'visitor@example.com', phone: '', service: 'Architectural services', date: tomorrow, time: 'Morning', message: 'Project 🏠\nPlease contact me.' };
let nextIp = 1;
function request(fields = valid, options = {}) {
  const input = { fields, ip: options.ip ?? `127.0.0.${nextIp++}`, method: options.method ?? 'POST', length: options.length ?? 100 };
  return new Promise((resolve, reject) => {
    const child = spawn(php, [wrapper, path.join(web, 'appointment.php'), Buffer.from(JSON.stringify(input)).toString('base64')], {
      env: { ...process.env, BLUEPRINT_TEST_CAPTURE: capturePath, BLUEPRINT_TEST_FAIL: options.fail ? '1' : '0' },
    });
    let output = '';
    let stderr = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      const match = output.match(/^(.*)\nSTATUS:(\d+)$/s);
      if (code !== 0 || !match) return reject(new Error(`PHP request failed: ${code}, ${output}, ${stderr}`));
      resolve({ status: Number(match[2]), body: JSON.parse(match[1]), stderr });
    });
  });
}

try {
  let result = await request();
  assert.equal(result.status, 200);
  let sent = JSON.parse(fs.readFileSync(capturePath, 'utf8'));
  assert.deepEqual(sent.recipients, { from: 'sender@example.com', to: 'info@blueprint.ky', cc: valid.email, replyTo: valid.email });
  assert.match(sent.body, /José 李/);
  assert.match(sent.body, /🏠/);
  assert.equal(sent.encryption, 'ssl');
  const siteSource = fs.readFileSync('lib/site.ts', 'utf8').split('export const projects:')[0];
  const services = [...siteSource.matchAll(/slug:'[^']+',name:'([^']+)'/g)].map(match => match[1]);
  services.push('Products & fencing supplies', 'Other enquiry');
  assert.equal(services.length, 6);
  for (const service of services) assert.equal((await request({ ...valid, service })).status, 200, service);
  fs.writeFileSync(configPath, config.replace("'port'=>465", "'port'=>587"));
  assert.equal((await request()).status, 200);
  sent = JSON.parse(fs.readFileSync(capturePath, 'utf8'));
  assert.equal(sent.encryption, 'tls');
  fs.writeFileSync(configPath, config);

  for (const fields of [
    { ...valid, name: '' }, { ...valid, email: 'invalid' }, { ...valid, service: 'Unknown' },
    { ...valid, date: '2026-02-30' }, { ...valid, date: '2020-01-01' }, { ...valid, time: 'Midnight' },
    { ...valid, email: ['visitor@example.com'] }, { ...valid, name: 'Name\r\nBcc: bad@example.com' },
    { ...valid, website: ['x'] }, { ...valid, message: 'x'.repeat(8001) },
  ]) assert.equal((await request(fields)).status, 422);
  assert.equal((await request(valid, { length: 16385 })).status, 413);
  assert.equal((await request(valid, { method: 'GET' })).status, 405);
  fs.rmSync(capturePath);
  assert.equal((await request({ ...valid, website: 'spam' })).status, 200);
  assert.equal(fs.existsSync(capturePath), false);

  const client = '127.0.1.1';
  for (let i = 0; i < 8; i++) assert.equal((await request({ ...valid, email: 'bad' }, { ip: client })).status, 422);
  assert.equal((await request(valid, { ip: client })).status, 429);
  const parallel = await Promise.all(Array.from({ length: 16 }, () => request({ ...valid, email: 'bad' }, { ip: '127.0.1.2' })));
  assert.equal(parallel.filter(item => item.status === 422).length, 8);
  assert.equal(parallel.filter(item => item.status === 429).length, 8);

  const ratePath = path.join(privateDir, 'rate-limit.json');
  const rateState = JSON.parse(fs.readFileSync(ratePath, 'utf8'));
  for (const key of Object.keys(rateState)) rateState[key] = [Math.floor(Date.now() / 1000) - 901];
  fs.writeFileSync(ratePath, JSON.stringify(rateState));
  assert.equal((await request(valid, { ip: client })).status, 200);

  fs.rmSync(configPath);
  assert.equal((await request()).status, 503);
  fs.writeFileSync(configPath, config.replace("'password'=>'test-password'", "'password'=>''"));
  assert.equal((await request()).status, 503);
  fs.writeFileSync(configPath, config);
  fs.rmSync(autoloadPath);
  assert.equal((await request()).status, 503);
  fs.writeFileSync(autoloadPath, mock);
  result = await request(valid, { fail: true });
  assert.equal(result.status, 503);
  assert.doesNotMatch(result.stderr, /test-secret/);
  assert.equal((await request()).status, 200);
  const probe = net.createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const server = spawn(php, ['-S', `127.0.0.1:${port}`, '-t', path.join(root, 'public_html')], {
    env: { ...process.env, BLUEPRINT_TEST_CAPTURE: capturePath, BLUEPRINT_TEST_FAIL: '0' },
  });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('PHP server did not start')), 10000);
      server.stderr.on('data', chunk => {
        if (String(chunk).includes('Development Server')) { clearTimeout(timer); resolve(); }
      });
      server.on('error', error => { clearTimeout(timer); reject(error); });
      server.on('exit', () => { clearTimeout(timer); reject(new Error('PHP server exited before starting')); });
    });
    const form = new FormData();
    for (const [key, value] of Object.entries(valid)) form.append(key, value);
    const response = await fetch(`http://127.0.0.1:${port}/api/appointment.php`, { method: 'POST', body: form });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: 'Request accepted.' });
  } finally {
    server.kill();
    await new Promise(resolve => server.on('exit', resolve));
  }
  console.log('PHP endpoint checks passed, including concurrent rate limiting and simulated SMTP success/failure.');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
