#!/usr/bin/env php
<?php

// Check If The Application Is Under Maintenance
if (file_exists($maintenance = __DIR__.'/storage/framework/down')) {
    require $maintenance;
}

// Register The Auto Loader
require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel and handle the command
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$status = $kernel->handle(
    $input = new Symfony\Component\Console\Input\ArgvInput,
    new Symfony\Component\Console\Output\ConsoleOutput
);

$kernel->terminate($input, $status);

exit($status);
