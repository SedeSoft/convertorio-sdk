const ConvertorioClient = require('convertorio-sdk');
const path = require('path');

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

async function runTest() {
    console.log('='.repeat(60));
    console.log('Testing Convertorio SDK with Advanced Conversion Metadata');
    console.log('='.repeat(60));

    try {
        const client = new ConvertorioClient({
            apiKey: API_KEY,
            baseUrl: 'https://api.convertorio.com'
        });

        // Listen to events for detailed progress
        client.on('start', (data) => {
            console.log(`\n▶ Starting conversion: ${data.sourceFormat} → ${data.targetFormat}`);
        });

        client.on('progress', (data) => {
            console.log(`  ${data.step}: ${data.message}`);
        });

        client.on('status', (data) => {
            console.log(`  Status: ${data.status} (attempt ${data.attempt}/${data.maxAttempts})`);
        });

        // Test 1: Convert with aspect ratio and crop strategy
        console.log('\n📐 Test 1: Convert to 16:9 widescreen with center crop');
        const test1 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-16x9.jpg'),
            conversionMetadata: {
                aspect_ratio: '16:9',
                crop_strategy: 'crop-center',
                quality: 90
            }
        });

        console.log('✓ Test 1 completed');
        console.log(`  Job ID: ${test1.jobId}`);
        console.log(`  Processing time: ${test1.processingTime}ms`);
        console.log(`  File size: ${(test1.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test1.outputPath}`);

        // Test 2: Convert to square (1:1) for social media
        console.log('\n📱 Test 2: Convert to square (1:1) for Instagram');
        const test2 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'webp',
            outputPath: path.join(__dirname, 'output-square.webp'),
            conversionMetadata: {
                aspect_ratio: '1:1',
                crop_strategy: 'crop-center',
                quality: 85
            }
        });

        console.log('✓ Test 2 completed');
        console.log(`  Job ID: ${test2.jobId}`);
        console.log(`  Processing time: ${test2.processingTime}ms`);
        console.log(`  File size: ${(test2.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test2.outputPath}`);

        // Test 3: Create ICO favicon with specific size
        console.log('\n🎨 Test 3: Create ICO favicon (32x32)');
        const test3 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'ico',
            outputPath: path.join(__dirname, 'favicon-32x32.ico'),
            conversionMetadata: {
                icon_size: 32,
                crop_strategy: 'crop-center'
            }
        });

        console.log('✓ Test 3 completed');
        console.log(`  Job ID: ${test3.jobId}`);
        console.log(`  Processing time: ${test3.processingTime}ms`);
        console.log(`  File size: ${(test3.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test3.outputPath}`);

        // Test 4: High-quality conversion
        console.log('\n⭐ Test 4: High-quality conversion (quality: 95)');
        const test4 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-high-quality.jpg'),
            conversionMetadata: {
                quality: 95
            }
        });

        console.log('✓ Test 4 completed');
        console.log(`  Job ID: ${test4.jobId}`);
        console.log(`  Processing time: ${test4.processingTime}ms`);
        console.log(`  File size: ${(test4.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test4.outputPath}`);

        // Test 5: Vertical format (9:16) for Stories/TikTok
        console.log('\n📲 Test 5: Vertical format (9:16) for TikTok/Stories');
        const test5 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-vertical.jpg'),
            conversionMetadata: {
                aspect_ratio: '9:16',
                crop_strategy: 'crop-center',
                quality: 85
            }
        });

        console.log('✓ Test 5 completed');
        console.log(`  Job ID: ${test5.jobId}`);
        console.log(`  Processing time: ${test5.processingTime}ms`);
        console.log(`  File size: ${(test5.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test5.outputPath}`);

        // Test 6: Fit strategy (add padding instead of crop)
        console.log('\n🖼️  Test 6: Fit strategy with padding (16:9)');
        const test6 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'png',
            outputPath: path.join(__dirname, 'output-fit.png'),
            conversionMetadata: {
                aspect_ratio: '16:9',
                crop_strategy: 'fit'  // Add padding instead of cropping
            }
        });

        console.log('✓ Test 6 completed');
        console.log(`  Job ID: ${test6.jobId}`);
        console.log(`  Processing time: ${test6.processingTime}ms`);
        console.log(`  File size: ${(test6.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test6.outputPath}`);

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests completed successfully!');
        console.log('='.repeat(60));

        const totalTests = 6;
        const avgProcessingTime = (test1.processingTime + test2.processingTime + test3.processingTime +
                                   test4.processingTime + test5.processingTime + test6.processingTime) / totalTests;

        console.log(`\nTotal tests: ${totalTests}`);
        console.log(`Average processing time: ${Math.round(avgProcessingTime)}ms`);
        console.log('\nOutput files:');
        console.log(`  1. ${test1.outputPath} (16:9 widescreen)`);
        console.log(`  2. ${test2.outputPath} (1:1 square)`);
        console.log(`  3. ${test3.outputPath} (32x32 favicon)`);
        console.log(`  4. ${test4.outputPath} (high quality)`);
        console.log(`  5. ${test5.outputPath} (9:16 vertical)`);
        console.log(`  6. ${test6.outputPath} (16:9 with padding)`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

runTest();
