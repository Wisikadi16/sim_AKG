<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = Illuminate\Http\Request::create('/form_umum_perbarui', 'POST', [
    'id_form' => 6,
    'kondisi_kritis' => ['apneu'],
]);
$response = $kernel->handle($request);
echo "STATUS: " . $response->getStatusCode() . "\n";
echo "DB: " . App\Models\Form_Umum::find(6)->kondisi_kritis . "\n";
