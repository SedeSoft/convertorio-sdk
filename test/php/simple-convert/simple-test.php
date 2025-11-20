<?php

/**
 * Simple Convertorio SDK Test
 *
 * Basic conversion test without advanced metadata options.
 */

require __DIR__ . '/../../../libs/php/vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

function runTest() {
    echo "Iniciando conversión...\n";

    try {
        $client = new ConvertorioClient(
            API_KEY,
            'https://api.convertorio.com'
        );

        $result = $client->convertFile(
            __DIR__ . '/test-image.png',
            'jpg',
            __DIR__ . '/output.jpg'
        );

        echo "Conversión finalizada\n";
        echo "Job ID: {$result['job_id']}\n";
        echo "Tiempo: {$result['processing_time']}ms\n";

    } catch (Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        exit(1);
    }
}

runTest();
