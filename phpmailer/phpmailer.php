<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/vendor/autoload.php';

$allowedOrigins = [
    'https://vsgraph.de',
    'https://www.vsgraph.de',
    'http://localhost:3000',
    'https://localhost:3000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$message = trim($input['message'] ?? '');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

$mail = new PHPMailer(true);

$configFile = __DIR__ . '/phpmailer.config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Mail configuration file missing.']);
    exit;
}

$config = include $configFile;
if (!is_array($config)) {
    http_response_code(500);
    echo json_encode(['error' => 'Mail configuration file is invalid.']);
    exit;
}

$mailHost = $config['mail_host'] ?? $config['MAIL_HOST'] ?? null;
$mailUser = $config['mail_user'] ?? $config['MAIL_USER'] ?? null;
$mailPassword = $config['mail_password'] ?? $config['MAIL_PASSWORD'] ?? null;
$mailSender = $config['mail_sender'] ?? $config['MAIL_SENDER'] ?? null;

if (!$mailHost || !$mailUser || !$mailPassword || !$mailSender) {
    http_response_code(500);
    echo json_encode(['error' => 'Mail configuration is not complete.']);
    exit;
}

try {
    $mail->isSMTP();
    $mail->SMTPDebug   = 0;
    $mail->Timeout     = 10;
    $mail->SMTPAuth    = true;
    $mail->SMTPAutoTLS = false;
    $mail->Host        = $mailHost;
    $mail->Username    = $mailUser;
    $mail->Password    = $mailPassword;
    $mail->Port        = 465;
    $mail->SMTPSecure  = PHPMailer::ENCRYPTION_SMTPS;

    $mail->setFrom($mailSender, 'Kontaktformular');
    $mail->addAddress($mailSender, 'VSGraph Kontakt');
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);

    $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));

    $mail->Subject = 'Neue Kontaktanfrage von VSGraph';
    $mail->Body    = "<h2>Neue Kontaktanfrage von VSGraph</h2>\n" .
                     "<p><strong>Name:</strong> $safeName</p>\n" .
                     "<p><strong>E-Mail:</strong> $safeEmail</p>\n" .
                     "<p><strong>Nachricht:</strong><br>$safeMessage</p>";
    $mail->AltBody = "Name: $name\r\nE-Mail: $email\r\n\r\n$message";

    $mail->send();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Mail could not be sent', 'details' => $mail->ErrorInfo]);
}
