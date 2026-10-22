<?php

declare(strict_types=1);

const MAIL_TO = 'sale@springs-alians.ru';
const MAIL_FROM = 'site@springs-alians.com';
const MAX_TOTAL_FILE_SIZE = 20 * 1024 * 1024;
const MAX_FILE_COUNT = 10;

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, bool $ok, string $message = ''): never
{
    http_response_code($status);
    $payload = ['ok' => $ok];
    if ($message !== '') {
        $payload['error'] = $message;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function field(string $name, int $maxLength): string
{
    $value = trim((string) ($_POST[$name] ?? ''));
    if (preg_match('/[\r\n]/', $value) && in_array($name, ['task', 'springType', 'name', 'email'], true)) {
        respond(400, false, 'Некорректные данные формы');
    }
    if (textLength($value) > $maxLength) {
        respond(400, false, 'Одно из полей слишком длинное');
    }
    return $value;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Метод не поддерживается');
}

$originHost = parse_url((string) ($_SERVER['HTTP_ORIGIN'] ?? ''), PHP_URL_HOST);
$requestHost = strtolower(explode(':', (string) ($_SERVER['HTTP_HOST'] ?? ''))[0]);
if (is_string($originHost) && $originHost !== '' && !hash_equals($requestHost, strtolower($originHost))) {
    respond(403, false, 'Запрос с другого домена запрещён');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 25 * 1024 * 1024) {
    respond(413, false, 'Общий размер заявки превышает 25 МБ');
}

if (field('website', 200) !== '') {
    respond(200, true);
}

$task = field('task', 100);
$springType = field('springType', 100);
$details = field('details', 5000);
$quantity = filter_var($_POST['quantity'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$prototype = field('prototype', 10) === 'true' ? 'Да' : 'Нет';
$name = field('name', 100);
$company = field('company', 200);
$email = field('email', 254);
$phone = field('phone', 50);
$consent = field('consent', 10);

if ($task === '' || $springType === '' || textLength($details) < 10 || $quantity === false || $name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $consent !== 'true') {
    respond(400, false, 'Некорректные данные формы');
}

$allowedExtensions = ['pdf', 'dwg', 'dxf', 'step', 'stp', 'doc', 'docx', 'xls', 'xlsx', 'zip'];
$attachments = [];
$totalSize = 0;

if (isset($_FILES['files'])) {
    $fileNames = is_array($_FILES['files']['name']) ? $_FILES['files']['name'] : [$_FILES['files']['name']];
    $tmpNames = is_array($_FILES['files']['tmp_name']) ? $_FILES['files']['tmp_name'] : [$_FILES['files']['tmp_name']];
    $sizes = is_array($_FILES['files']['size']) ? $_FILES['files']['size'] : [$_FILES['files']['size']];
    $errors = is_array($_FILES['files']['error']) ? $_FILES['files']['error'] : [$_FILES['files']['error']];

    if (count($fileNames) > MAX_FILE_COUNT) {
        respond(413, false, 'Можно приложить не более 10 файлов');
    }

    foreach ($fileNames as $index => $originalName) {
        $error = (int) ($errors[$index] ?? UPLOAD_ERR_NO_FILE);
        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($error !== UPLOAD_ERR_OK) {
            respond(400, false, 'Не удалось загрузить один из файлов');
        }

        $size = (int) ($sizes[$index] ?? 0);
        $totalSize += $size;
        if ($size <= 0 || $totalSize > MAX_TOTAL_FILE_SIZE) {
            respond(413, false, 'Общий размер файлов превышает 20 МБ');
        }

        $extension = strtolower(pathinfo((string) $originalName, PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions, true)) {
            respond(400, false, 'Неподдерживаемый тип файла');
        }

        $tmpName = (string) ($tmpNames[$index] ?? '');
        if (!is_uploaded_file($tmpName)) {
            respond(400, false, 'Некорректный загруженный файл');
        }

        $safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename((string) $originalName));
        $attachments[] = ['name' => $safeName ?: "attachment.$extension", 'path' => $tmpName];
    }
}

$lines = [
    'Задача: ' . $task,
    'Тип изделия: ' . $springType,
    'Количество: ' . $quantity,
    'Нужен прототип: ' . $prototype,
    'Имя: ' . $name,
    'Компания: ' . ($company !== '' ? $company : '—'),
    'Email: ' . $email,
    'Телефон: ' . ($phone !== '' ? $phone : '—'),
    '',
    'Описание:',
    $details,
];
$text = implode("\r\n", $lines);
$subject = 'Заявка с сайта: ' . $springType . ' — ' . $name;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = [
    'From: Springs Alliance site <' . MAIL_FROM . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'X-Mailer: Springs Alliance website',
];

if ($attachments === []) {
    $headers[] = 'Content-Type: text/plain; charset=UTF-8';
    $headers[] = 'Content-Transfer-Encoding: 8bit';
    $body = $text;
} else {
    $boundary = '=_springs_' . bin2hex(random_bytes(16));
    $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';
    $body = '--' . $boundary . "\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n" . $text . "\r\n";

    foreach ($attachments as $attachment) {
        $content = file_get_contents($attachment['path']);
        if ($content === false) {
            respond(500, false, 'Не удалось прочитать вложение');
        }
        $body .= '--' . $boundary . "\r\n";
        $body .= 'Content-Type: application/octet-stream; name="' . $attachment['name'] . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= 'Content-Disposition: attachment; filename="' . $attachment['name'] . "\"\r\n\r\n";
        $body .= chunk_split(base64_encode($content)) . "\r\n";
    }
    $body .= '--' . $boundary . "--\r\n";
}

$sent = mail(MAIL_TO, $encodedSubject, $body, implode("\r\n", $headers), '-f' . MAIL_FROM);
if (!$sent) {
    error_log('Website request mail delivery failed');
    respond(502, false, 'Не удалось отправить заявку');
}

respond(200, true);
