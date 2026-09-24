<?php
// ONE-TIME SETUP — DELETE THIS FILE AFTER RUNNING

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

header('Content-Type: application/json');
$results = [];

// Run migrations
ob_start();
$status = $kernel->call('migrate', ['--force' => true]);
$results['migrate'] = ['exit' => $status, 'output' => trim(ob_get_clean())];

// Run admin seeder
ob_start();
$status = $kernel->call('db:seed', ['--class' => 'AdminSeeder', '--force' => true]);
$results['seed'] = ['exit' => $status, 'output' => trim(ob_get_clean())];

echo json_encode($results, JSON_PRETTY_PRINT);
