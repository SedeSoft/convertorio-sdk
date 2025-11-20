/**
 * Simple Conversion Test
 *
 * This script tests the convertorio-sdk package installed from npm
 */

const ConvertorioClient = require('convertorio-sdk');
const fs = require('fs');
const path = require('path');

// Your API key - Get from https://convertorio.com/account
const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTest() {
    log('\n========================================', 'cyan');
    log('Convertorio SDK - Simple Conversion Test', 'cyan');
    log('========================================\n', 'cyan');

    // Verify test image exists
    const inputPath = path.join(__dirname, 'test-image.png');
    if (!fs.existsSync(inputPath)) {
        log('✗ Test image not found: test-image.png', 'red');
        process.exit(1);
    }

    const inputStats = fs.statSync(inputPath);
    log(`Input image: test-image.png (${(inputStats.size / 1024).toFixed(2)} KB)`, 'gray');

    // Initialize the client
    log('\n[1/5] Initializing Convertorio SDK...', 'yellow');
    const client = new ConvertorioClient({
        apiKey: API_KEY,
        baseUrl: 'https://api.convertorio.com'
    });
    log('✓ Client initialized', 'green');

    // Set up event listeners
    client.on('start', (data) => {
        log(`\n[2/5] Starting conversion: ${data.fileName}`, 'yellow');
        log(`      Format: ${data.sourceFormat.toUpperCase()} → ${data.targetFormat.toUpperCase()}`, 'gray');
    });

    client.on('progress', (data) => {
        const steps = {
            'requesting-upload-url': '[3/5]',
            'uploading': '[3/5]',
            'confirming': '[3/5]',
            'converting': '[4/5]',
            'downloading': '[5/5]'
        };
        const step = steps[data.step] || '';
        log(`${step} ${data.message}`, 'yellow');
    });

    client.on('status', (data) => {
        log(`      Status: ${data.status} (polling ${data.attempt}/${data.maxAttempts})`, 'gray');
    });

    client.on('complete', (result) => {
        log('\n✓ Conversion completed!', 'green');
    });

    client.on('error', (error) => {
        log(`\n✗ Error: ${error.error}`, 'red');
    });

    // Perform conversion
    try {
        const result = await client.convertFile({
            inputPath: inputPath,
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'converted-image.jpg')
        });

        // Verify output file
        if (fs.existsSync(result.outputPath)) {
            const outputStats = fs.statSync(result.outputPath);

            log('\n========================================', 'cyan');
            log('Test Results', 'cyan');
            log('========================================', 'cyan');
            log(`✓ Conversion successful!`, 'green');
            log(`\nInput:`, 'cyan');
            log(`  File: ${path.basename(result.inputPath)}`, 'gray');
            log(`  Format: ${result.sourceFormat.toUpperCase()}`, 'gray');
            log(`  Size: ${(inputStats.size / 1024).toFixed(2)} KB`, 'gray');
            log(`\nOutput:`, 'cyan');
            log(`  File: ${path.basename(result.outputPath)}`, 'gray');
            log(`  Format: ${result.targetFormat.toUpperCase()}`, 'gray');
            log(`  Size: ${(outputStats.size / 1024).toFixed(2)} KB`, 'gray');
            log(`\nProcessing:`, 'cyan');
            log(`  Time: ${result.processingTime} ms`, 'gray');
            log(`  Job ID: ${result.jobId}`, 'gray');
            log('========================================\n', 'cyan');

            // Verify it's a valid JPEG
            const magicBytes = fs.readFileSync(result.outputPath).slice(0, 3);
            const isJpeg = magicBytes[0] === 0xFF && magicBytes[1] === 0xD8 && magicBytes[2] === 0xFF;

            if (isJpeg) {
                log('✓ Output file is a valid JPEG image', 'green');
            } else {
                log('⚠ Warning: Output file may not be a valid JPEG', 'yellow');
            }

            log('\n✓ All tests passed!', 'green');
            process.exit(0);
        } else {
            log('\n✗ Output file was not created', 'red');
            process.exit(1);
        }

    } catch (error) {
        log(`\n✗ Test failed: ${error.message}`, 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Data: ${JSON.stringify(error.response.data)}`, 'red');
        }
        process.exit(1);
    }
}

// Run the test
runTest().catch(error => {
    log(`\n✗ Unexpected error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
