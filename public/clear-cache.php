<?php
// ONE-TIME USE — DELETE THIS FILE AFTER RUNNING IT ONCE

$deleted = [];
$errors  = [];

$targets = [
    __DIR__ . '/../bootstrap/cache/config.php',
    __DIR__ . '/../bootstrap/cache/routes-v7.php',
    __DIR__ . '/../bootstrap/cache/events.php',
    __DIR__ . '/../bootstrap/cache/services.php',
    __DIR__ . '/../bootstrap/cache/packages.php',
];

foreach ($targets as $file) {
    if (file_exists($file)) {
        if (unlink($file)) {
            $deleted[] = basename($file);
        } else {
            $errors[] = basename($file) . ' (permission denied)';
        }
    }
}

// Clear compiled views
$viewsDir = __DIR__ . '/../storage/framework/views/';
foreach (glob($viewsDir . '*.php') as $view) {
    if (unlink($view)) {
        $deleted[] = 'views/' . basename($view);
    }
}

// Make storage writable
$storageDirs = [
    __DIR__ . '/../storage',
    __DIR__ . '/../storage/logs',
    __DIR__ . '/../storage/framework',
    __DIR__ . '/../storage/framework/cache',
    __DIR__ . '/../storage/framework/sessions',
    __DIR__ . '/../storage/framework/views',
    __DIR__ . '/../bootstrap/cache',
];
foreach ($storageDirs as $dir) {
    if (is_dir($dir)) {
        chmod($dir, 0775);
    }
}

header('Content-Type: application/json');
echo json_encode([
    'status'  => empty($errors) ? 'ok' : 'partial',
    'deleted' => $deleted,
    'errors'  => $errors,
    'message' => 'Cache cleared. DELETE this file now: public/clear-cache.php',
]);
