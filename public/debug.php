<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<pre>";

// Step 1: autoloader
echo "1. Loading autoloader...\n";
require __DIR__ . '/../vendor/autoload.php';
echo "   OK\n";

// Step 2: bootstrap
echo "2. Loading bootstrap/app.php...\n";
$app = require __DIR__ . '/../bootstrap/app.php';
echo "   OK\n";

// Step 3: boot the kernel
echo "3. Booting HTTP kernel...\n";
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::capture();
$response = $kernel->handle($request);
echo "   OK - Status: " . $response->getStatusCode() . "\n";

echo "\nAll steps passed. Sending response:\n</pre>";
$response->send();
$kernel->terminate($request, $response);
