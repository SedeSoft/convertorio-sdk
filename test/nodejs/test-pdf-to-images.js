/**
 * Test script for PDF to Images conversion
 *
 * This test verifies the complete pipeline:
 * 1. Upload a multi-page PDF
 * 2. Convert to multiple JPG images (one per page)
 * 3. Download all output images
 * 4. Verify the output files
 */

const ConvertorioClient = require('../../libs/nodejs/index.js');
const fs = require('fs');
const path = require('path');

// Test configuration
const API_KEY = process.env.CONVERTORIO_API_KEY || 'cvt_test_api_key_123';
const BASE_URL = process.env.CONVERTORIO_API_URL || 'http://localhost:8080';
const TEST_PDF = path.join(__dirname, '../../../Confirmation-Iberojet.pdf');
const OUTPUT_DIR = path.join(__dirname, 'output-images');

async function testPdfToImages() {
    console.log('=== PDF to Images Test ===\n');

    // Check test file exists
    if (!fs.existsSync(TEST_PDF)) {
        console.error(`Test PDF not found: ${TEST_PDF}`);
        process.exit(1);
    }

    const stats = fs.statSync(TEST_PDF);
    console.log(`Test PDF: ${TEST_PDF}`);
    console.log(`File size: ${stats.size} bytes\n`);

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Initialize client
    const client = new ConvertorioClient({
        apiKey: API_KEY,
        baseUrl: BASE_URL
    });

    // Track progress events
    client.on('start', (data) => {
        console.log(`[START] Converting ${data.fileName} from ${data.sourceFormat} to ${data.targetFormat}`);
    });

    client.on('progress', (data) => {
        console.log(`[PROGRESS] ${data.step}: ${data.message}`);
        if (data.jobId) console.log(`  Job ID: ${data.jobId}`);
    });

    client.on('status', (data) => {
        console.log(`[STATUS] Job ${data.jobId}: ${data.status} (attempt ${data.attempt}/${data.maxAttempts})`);
    });

    client.on('file-downloaded', (data) => {
        console.log(`[DOWNLOADED] Page ${data.pageNumber}/${data.totalPages}: ${data.filename}`);
    });

    client.on('complete', (data) => {
        console.log(`\n[COMPLETE] Conversion finished!`);
        console.log(`  Job ID: ${data.jobId}`);
        console.log(`  Output files: ${data.outputFileCount}`);
        console.log(`  Total size: ${data.totalSize} bytes`);
        console.log(`  Processing time: ${data.processingTime}ms`);
    });

    client.on('error', (data) => {
        console.error(`[ERROR] ${data.error}`);
    });

    try {
        console.log('Starting PDF to Images conversion...\n');

        const result = await client.convertPdfToImages({
            inputPath: TEST_PDF,
            outputDir: OUTPUT_DIR,
            conversionMetadata: {
                images_width: 1200,
                images_quality: 90,
                images_dpi: 150
            }
        });

        console.log('\n=== Result ===');
        console.log(JSON.stringify(result, null, 2));

        // Verify output files
        console.log('\n=== Output Files ===');
        for (const file of result.outputFiles) {
            if (fs.existsSync(file.path)) {
                const fileStats = fs.statSync(file.path);
                console.log(`✅ ${file.filename}`);
                console.log(`   Page: ${file.pageNumber}`);
                console.log(`   Size: ${fileStats.size} bytes`);
                console.log(`   Dimensions: ${file.width || 'N/A'}x${file.height || 'N/A'}`);
            } else {
                console.log(`❌ ${file.filename} - FILE NOT FOUND`);
            }
        }

        console.log('\n=== Test Passed ===');

    } catch (error) {
        console.error('\n=== Test Failed ===');
        console.error('Error:', error.message);
        if (error.response?.data) {
            console.error('Response:', error.response.data);
        }
        process.exit(1);
    }
}

// Run the test
testPdfToImages();
