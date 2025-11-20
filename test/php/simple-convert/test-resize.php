<?php

/**
 * Convertorio SDK - Resize Feature Test Suite
 *
 * Tests various resize scenarios with the Convertorio SDK.
 */

require __DIR__ . '/vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

function runResizeTests() {
    echo str_repeat('=', 60) . "\n";
    echo "Testing Convertorio SDK - Resize Feature (v1.2.0)\n";
    echo str_repeat('=', 60) . "\n";

    try {
        // Set verifySsl to false for development/testing on Windows
        $client = new ConvertorioClient(
            API_KEY,
            'https://api.convertorio.com',
            false  // Disable SSL verification for development
        );

        $inputPath = __DIR__ . '/test-image.png';

        // Test 1: Resize by width (maintains aspect ratio)
        echo "\n📐 Test 1: Resize by width (800px)\n";
        $test1 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-resize-width-800.jpg',
            ['resize_width' => 800]
        );

        echo "✓ Test 1 completed\n";
        echo "  Job ID: {$test1['job_id']}\n";
        echo "  Processing time: {$test1['processing_time']}ms\n";
        echo "  File size: " . number_format($test1['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test1['output_path']}\n";

        // Test 2: Resize by height (maintains aspect ratio)
        echo "\n📏 Test 2: Resize by height (600px)\n";
        $test2 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-resize-height-600.jpg',
            ['resize_height' => 600]
        );

        echo "✓ Test 2 completed\n";
        echo "  Job ID: {$test2['job_id']}\n";
        echo "  Processing time: {$test2['processing_time']}ms\n";
        echo "  File size: " . number_format($test2['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test2['output_path']}\n";

        // Test 3: Resize to exact dimensions (may distort)
        echo "\n⚙️  Test 3: Resize to exact 1920x1080 (16:9)\n";
        $test3 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-resize-1920x1080.jpg',
            [
                'resize_width' => 1920,
                'resize_height' => 1080
            ]
        );

        echo "✓ Test 3 completed\n";
        echo "  Job ID: {$test3['job_id']}\n";
        echo "  Processing time: {$test3['processing_time']}ms\n";
        echo "  File size: " . number_format($test3['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test3['output_path']}\n";

        // Test 4: Combine resize with aspect ratio change
        echo "\n🎨 Test 4: Aspect ratio 1:1 + resize width 500px\n";
        $test4 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-square-500.jpg',
            [
                'aspect_ratio' => '1:1',
                'crop_strategy' => 'crop-center',
                'resize_width' => 500,
                'quality' => 90
            ]
        );

        echo "✓ Test 4 completed\n";
        echo "  Job ID: {$test4['job_id']}\n";
        echo "  Processing time: {$test4['processing_time']}ms\n";
        echo "  File size: " . number_format($test4['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test4['output_path']}\n";

        // Test 5: Create thumbnail (small size)
        echo "\n🖼️  Test 5: Create thumbnail (150x150)\n";
        $test5 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-thumbnail-150.jpg',
            [
                'resize_width' => 150,
                'resize_height' => 150,
                'quality' => 85
            ]
        );

        echo "✓ Test 5 completed\n";
        echo "  Job ID: {$test5['job_id']}\n";
        echo "  Processing time: {$test5['processing_time']}ms\n";
        echo "  File size: " . number_format($test5['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test5['output_path']}\n";

        // Test 6: HD resolution with quality control
        echo "\n📺 Test 6: HD resize (1280px width) with quality 95%\n";
        $test6 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-hd-1280.jpg',
            [
                'resize_width' => 1280,
                'quality' => 95
            ]
        );

        echo "✓ Test 6 completed\n";
        echo "  Job ID: {$test6['job_id']}\n";
        echo "  Processing time: {$test6['processing_time']}ms\n";
        echo "  File size: " . number_format($test6['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test6['output_path']}\n";

        // Summary
        echo "\n" . str_repeat('=', 60) . "\n";
        echo "✅ All resize tests completed successfully!\n";
        echo str_repeat('=', 60) . "\n";

        $totalTests = 6;
        $avgProcessingTime = (
            $test1['processing_time'] + $test2['processing_time'] + $test3['processing_time'] +
            $test4['processing_time'] + $test5['processing_time'] + $test6['processing_time']
        ) / $totalTests;

        echo "\nTotal tests: {$totalTests}\n";
        echo "Average processing time: " . round($avgProcessingTime) . "ms\n";
        echo "\nOutput files:\n";
        echo "  1. {$test1['output_path']} (width: 800px)\n";
        echo "  2. {$test2['output_path']} (height: 600px)\n";
        echo "  3. {$test3['output_path']} (1920x1080)\n";
        echo "  4. {$test4['output_path']} (square 500x500)\n";
        echo "  5. {$test5['output_path']} (thumbnail 150x150)\n";
        echo "  6. {$test6['output_path']} (HD 1280px)\n";

    } catch (Exception $e) {
        echo "\n❌ Error: {$e->getMessage()}\n";
        echo $e->getTraceAsString() . "\n";
        exit(1);
    }
}

runResizeTests();
