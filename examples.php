<?php

/**
 * Convertorio SDK - Usage Examples
 *
 * This file demonstrates various ways to use the Convertorio SDK.
 */

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

// Initialize client
const API_KEY = 'your_api_key_here';  // Get from https://convertorio.com/account
$client = new ConvertorioClient(API_KEY);


// Example 1: Basic conversion
function basicConversion($client) {
    echo "Example 1: Basic conversion\n";
    $result = $client->convertFile('./photo.png', 'jpg');
    echo "Converted to: {$result['output_path']}\n\n";
    return $result;
}


// Example 2: Conversion with custom output path
function customOutputPath($client) {
    echo "Example 2: Conversion with custom output path\n";
    $result = $client->convertFile(
        './photo.png',
        'webp',
        './converted/optimized.webp'
    );
    echo "Saved to: {$result['output_path']}\n\n";
    return $result;
}


// Example 3: Convert with quality control
function qualityControl($client) {
    echo "Example 3: Convert with quality control\n";
    $result = $client->convertFile(
        './photo.jpg',
        'webp',
        null,
        ['quality' => 95]  // High quality (1-100)
    );
    echo "High quality conversion: {$result['file_size']} bytes\n\n";
    return $result;
}


// Example 4: Convert to square (1:1) for Instagram
function squareForInstagram($client) {
    echo "Example 4: Convert to square (1:1) for Instagram\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        [
            'aspect_ratio' => '1:1',
            'crop_strategy' => 'crop-center'
        ]
    );
    echo "Square image created: {$result['output_path']}\n\n";
    return $result;
}


// Example 5: Convert to 16:9 widescreen
function widescreen16_9($client) {
    echo "Example 5: Convert to 16:9 widescreen\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        [
            'aspect_ratio' => '16:9',
            'crop_strategy' => 'crop-center',
            'quality' => 90
        ]
    );
    echo "Widescreen created: {$result['output_path']}\n\n";
    return $result;
}


// Example 6: Convert to 9:16 vertical for Stories
function verticalForStories($client) {
    echo "Example 6: Convert to 9:16 vertical for Stories\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        [
            'aspect_ratio' => '9:16',
            'crop_strategy' => 'crop-center'
        ]
    );
    echo "Vertical story created: {$result['output_path']}\n\n";
    return $result;
}


// Example 7: Create favicon (ICO)
function createFavicon($client) {
    echo "Example 7: Create favicon (ICO)\n";
    $result = $client->convertFile(
        './logo.png',
        'ico',
        null,
        [
            'icon_size' => 32,
            'crop_strategy' => 'crop-center'
        ]
    );
    echo "Favicon created: {$result['output_path']}\n\n";
    return $result;
}


// Example 8: Convert HEIC (iPhone photo) to JPG
function heicToJpg($client) {
    echo "Example 8: Convert HEIC (iPhone photo) to JPG\n";
    $result = $client->convertFile(
        './iphone_photo.heic',
        'jpg',
        null,
        ['quality' => 90]
    );
    echo "HEIC converted to JPG: {$result['output_path']}\n\n";
    return $result;
}


// Example 9: Convert with fit strategy (add padding)
function fitWithPadding($client) {
    echo "Example 9: Convert with fit strategy (add padding)\n";
    $result = $client->convertFile(
        './photo.jpg',
        'png',
        null,
        [
            'aspect_ratio' => '16:9',
            'crop_strategy' => 'fit'  // Adds padding instead of cropping
        ]
    );
    echo "Fitted with padding: {$result['output_path']}\n\n";
    return $result;
}


// Example 10: Get account info
function getAccountInfo($client) {
    echo "Example 10: Get account info\n";
    $account = $client->getAccount();
    echo "Account: {$account['email']}\n";
    echo "Plan: {$account['plan']}\n";
    echo "Points: {$account['points']}\n";
    echo "Daily conversions remaining: {$account['daily_conversions_remaining']}\n\n";
    return $account;
}


// Example 11: List recent jobs
function listRecentJobs($client) {
    echo "Example 11: List recent jobs\n";
    $jobs = $client->listJobs(10);
    foreach ($jobs as $job) {
        echo "Job {$job['id']}: {$job['status']} - {$job['original_filename']}\n";
    }
    echo "\n";
    return $jobs;
}


// Example 12: Resize by width (maintains aspect ratio)
function resizeByWidth($client) {
    echo "Example 12: Resize by width (maintains aspect ratio)\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        ['resize_width' => 800]  // Height will maintain aspect ratio
    );
    echo "Resized to 800px width: {$result['output_path']}\n\n";
    return $result;
}


// Example 13: Resize by height (maintains aspect ratio)
function resizeByHeight($client) {
    echo "Example 13: Resize by height (maintains aspect ratio)\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        ['resize_height' => 600]  // Width will maintain aspect ratio
    );
    echo "Resized to 600px height: {$result['output_path']}\n\n";
    return $result;
}


// Example 14: Resize to exact dimensions
function resizeExact($client) {
    echo "Example 14: Resize to exact dimensions\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        [
            'resize_width' => 800,
            'resize_height' => 600  // May distort if aspect ratio differs
        ]
    );
    echo "Resized to 800x600: {$result['output_path']}\n\n";
    return $result;
}


// Example 15: Combine resize with aspect ratio
function resizeWithAspectRatio($client) {
    echo "Example 15: Combine resize with aspect ratio\n";
    $result = $client->convertFile(
        './photo.jpg',
        'jpg',
        null,
        [
            'aspect_ratio' => '1:1',
            'crop_strategy' => 'crop-center',
            'resize_width' => 500,
            'quality' => 90
        ]
    );
    echo "Square thumbnail created: {$result['output_path']}\n\n";
    return $result;
}


// Example 16: With event callbacks
function withProgressTracking($client) {
    echo "Example 16: With event callbacks\n";

    $client->on('start', function($data) {
        echo "Starting conversion: {$data['file_name']}\n";
    });

    $client->on('progress', function($data) {
        echo "[{$data['step']}] {$data['message']}\n";
    });

    $client->on('complete', function($result) {
        echo "✓ Completed in {$result['processing_time']}ms\n";
        echo "  Output: {$result['output_path']}\n";
        echo "  Size: {$result['file_size']} bytes\n";
    });

    $result = $client->convertFile(
        './photo.png',
        'webp',
        null,
        ['quality' => 85]
    );
    echo "\n";
    return $result;
}


// Example 17: Batch conversion
function batchConvertFolder($client) {
    echo "Example 17: Batch conversion\n";

    // Get all PNG files
    $files = glob('./images/*.png');

    $results = [];
    foreach ($files as $i => $file) {
        $num = $i + 1;
        echo "Converting {$num}/" . count($files) . ": " . basename($file) . "\n";

        $result = $client->convertFile(
            $file,
            'webp',
            null,
            ['quality' => 85]
        );
        $results[] = $result;
        echo "  ✓ Saved to: {$result['output_path']}\n";
    }

    echo "\nConverted " . count($results) . " files\n\n";
    return $results;
}


// Example 18: Error handling
function withErrorHandling($client) {
    echo "Example 18: Error handling\n";

    try {
        $result = $client->convertFile('./photo.jpg', 'png');
        echo "Success: {$result['output_path']}\n";
        return $result;

    } catch (Exception $e) {
        echo "Conversion error: {$e->getMessage()}\n";

        // Handle specific errors
        if (strpos($e->getMessage(), 'Insufficient') !== false) {
            echo "Not enough points/credits - please add more\n";
        } elseif (strpos($e->getMessage(), 'not found') !== false) {
            echo "Input file does not exist\n";
        }
    }
    echo "\n";
}


// Main function to run examples
function runExamples() {
    global $client;

    echo str_repeat('=', 60) . "\n";
    echo "Convertorio SDK - PHP Examples\n";
    echo str_repeat('=', 60) . "\n\n";

    // Uncomment the examples you want to run:

    // basicConversion($client);
    // customOutputPath($client);
    // qualityControl($client);
    // squareForInstagram($client);
    // widescreen16_9($client);
    // verticalForStories($client);
    // createFavicon($client);
    // heicToJpg($client);
    // fitWithPadding($client);
    // getAccountInfo($client);
    // listRecentJobs($client);
    // resizeByWidth($client);
    // resizeByHeight($client);
    // resizeExact($client);
    // resizeWithAspectRatio($client);
    // withProgressTracking($client);
    // batchConvertFolder($client);
    // withErrorHandling($client);

    echo "Note: Uncomment the examples you want to run in the runExamples() function\n";
}

// Run examples if this file is executed directly
if (basename(__FILE__) == basename($_SERVER['PHP_SELF'])) {
    runExamples();
}
