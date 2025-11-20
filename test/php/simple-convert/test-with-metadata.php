<?php

/**
 * Convertorio SDK - Advanced Metadata Test Suite
 *
 * Tests various conversion scenarios with metadata options.
 */

require __DIR__ . '/../../../libs/php/vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

function runMetadataTests() {
    echo str_repeat('=', 60) . "\n";
    echo "Testing Convertorio SDK - Advanced Metadata (v1.2.0)\n";
    echo str_repeat('=', 60) . "\n";

    try {
        $client = new ConvertorioClient(
            API_KEY,
            'https://api.convertorio.com'
        );

        $inputPath = __DIR__ . '/test-image.png';

        // Test 1: Convert to 16:9 widescreen
        echo "\n📺 Test 1: Convert to 16:9 widescreen\n";
        $test1 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-16-9-widescreen.jpg',
            [
                'aspect_ratio' => '16:9',
                'crop_strategy' => 'crop-center',
                'quality' => 90
            ]
        );

        echo "✓ Test 1 completed\n";
        echo "  Job ID: {$test1['job_id']}\n";
        echo "  Processing time: {$test1['processing_time']}ms\n";
        echo "  File size: " . number_format($test1['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test1['output_path']}\n";

        // Test 2: Convert to 1:1 square for Instagram
        echo "\n📷 Test 2: Convert to 1:1 square for Instagram\n";
        $test2 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-1-1-instagram.jpg',
            [
                'aspect_ratio' => '1:1',
                'crop_strategy' => 'crop-center',
                'quality' => 85
            ]
        );

        echo "✓ Test 2 completed\n";
        echo "  Job ID: {$test2['job_id']}\n";
        echo "  Processing time: {$test2['processing_time']}ms\n";
        echo "  File size: " . number_format($test2['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test2['output_path']}\n";

        // Test 3: Create ICO favicon (32x32)
        echo "\n🖼️  Test 3: Create ICO favicon (32x32)\n";
        $test3 = $client->convertFile(
            $inputPath,
            'ico',
            __DIR__ . '/output-favicon-32.ico',
            [
                'icon_size' => 32,
                'crop_strategy' => 'crop-center'
            ]
        );

        echo "✓ Test 3 completed\n";
        echo "  Job ID: {$test3['job_id']}\n";
        echo "  Processing time: {$test3['processing_time']}ms\n";
        echo "  File size: " . number_format($test3['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test3['output_path']}\n";

        // Test 4: High quality JPG conversion (quality 95)
        echo "\n⭐ Test 4: High quality JPG conversion (quality 95)\n";
        $test4 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-high-quality.jpg',
            [
                'quality' => 95
            ]
        );

        echo "✓ Test 4 completed\n";
        echo "  Job ID: {$test4['job_id']}\n";
        echo "  Processing time: {$test4['processing_time']}ms\n";
        echo "  File size: " . number_format($test4['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test4['output_path']}\n";

        // Test 5: Convert to 9:16 vertical for Stories
        echo "\n📱 Test 5: Convert to 9:16 vertical for Stories\n";
        $test5 = $client->convertFile(
            $inputPath,
            'jpg',
            __DIR__ . '/output-9-16-stories.jpg',
            [
                'aspect_ratio' => '9:16',
                'crop_strategy' => 'crop-center',
                'quality' => 85
            ]
        );

        echo "✓ Test 5 completed\n";
        echo "  Job ID: {$test5['job_id']}\n";
        echo "  Processing time: {$test5['processing_time']}ms\n";
        echo "  File size: " . number_format($test5['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test5['output_path']}\n";

        // Test 6: Fit strategy with padding (16:9)
        echo "\n🎨 Test 6: Fit strategy with padding (16:9)\n";
        $test6 = $client->convertFile(
            $inputPath,
            'png',
            __DIR__ . '/output-fit-padding.png',
            [
                'aspect_ratio' => '16:9',
                'crop_strategy' => 'fit',
                'quality' => 90
            ]
        );

        echo "✓ Test 6 completed\n";
        echo "  Job ID: {$test6['job_id']}\n";
        echo "  Processing time: {$test6['processing_time']}ms\n";
        echo "  File size: " . number_format($test6['file_size'] / 1024, 2) . " KB\n";
        echo "  Output: {$test6['output_path']}\n";

        // Summary
        echo "\n" . str_repeat('=', 60) . "\n";
        echo "✅ All metadata tests completed successfully!\n";
        echo str_repeat('=', 60) . "\n";

        $totalTests = 6;
        $avgProcessingTime = (
            $test1['processing_time'] + $test2['processing_time'] + $test3['processing_time'] +
            $test4['processing_time'] + $test5['processing_time'] + $test6['processing_time']
        ) / $totalTests;

        echo "\nTotal tests: {$totalTests}\n";
        echo "Average processing time: " . round($avgProcessingTime) . "ms\n";
        echo "\nOutput files:\n";
        echo "  1. {$test1['output_path']} (16:9 widescreen)\n";
        echo "  2. {$test2['output_path']} (1:1 Instagram)\n";
        echo "  3. {$test3['output_path']} (ICO favicon 32x32)\n";
        echo "  4. {$test4['output_path']} (High quality JPG)\n";
        echo "  5. {$test5['output_path']} (9:16 Stories)\n";
        echo "  6. {$test6['output_path']} (Fit with padding)\n";

    } catch (Exception $e) {
        echo "\n❌ Error: {$e->getMessage()}\n";
        echo $e->getTraceAsString() . "\n";
        exit(1);
    }
}

runMetadataTests();
