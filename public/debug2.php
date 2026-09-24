<?php
// Tests each step and writes results to a log file instead of screen output
// (avoids PHP-FPM output suppression on fatal errors)

$log = __DIR__ . '/../storage/logs/debug-test.log';
$w = fn(string $msg) => file_put_contents($log, date('[H:i:s] ') . $msg . PHP_EOL, FILE_APPEND);

$w('=== debug2.php started ===');
$w('PHP version: ' . PHP_VERSION);
$w('Loaded extensions: ' . implode(', ', get_loaded_extensions()));

$w('Step 1: loading vendor/autoload.php ...');
require __DIR__ . '/../vendor/autoload.php';
$w('Step 1: OK');

$w('Step 2: loading bootstrap/app.php ...');
$app = require __DIR__ . '/../bootstrap/app.php';
$w('Step 2: OK');

$w('Step 3: making HTTP kernel ...');
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$w('Step 3: OK');

$w('ALL STEPS PASSED');
echo json_encode(['result' => 'ok', 'log' => $log]);
