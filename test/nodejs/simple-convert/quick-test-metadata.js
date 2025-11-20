const ConvertorioClient = require('convertorio-sdk');
const path = require('path');

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

async function runQuickTest() {
    console.log('Quick Metadata Test - Convertorio SDK v1.1.0\n');

    try {
        const client = new ConvertorioClient({
            apiKey: API_KEY,
            baseUrl: 'https://api.convertorio.com'
        });

        // Quick test: Convert to 16:9 with metadata
        console.log('Converting to 16:9 widescreen with center crop...');

        const result = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'quick-test-output.jpg'),
            conversionMetadata: {
                aspect_ratio: '16:9',
                crop_strategy: 'crop-center',
                quality: 85
            }
        });

        console.log('\n✓ Conversion completed successfully!');
        console.log(`  Job ID: ${result.jobId}`);
        console.log(`  Processing time: ${result.processingTime}ms`);
        console.log(`  File size: ${(result.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${result.outputPath}`);
        console.log('\nMetadata used:');
        console.log('  - Aspect ratio: 16:9');
        console.log('  - Crop strategy: crop-center');
        console.log('  - Quality: 85%');

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

runQuickTest();
