const ConvertorioClient = require('convertorio-sdk');
const path = require('path');

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

async function runResizeTests() {
    console.log('='.repeat(60));
    console.log('Testing Convertorio SDK - Resize Feature (v1.2.0)');
    console.log('='.repeat(60));

    try {
        const client = new ConvertorioClient({
            apiKey: API_KEY,
            baseUrl: 'https://api.convertorio.com'
        });

        // Test 1: Resize by width (maintains aspect ratio)
        console.log('\n📐 Test 1: Resize by width (800px)');
        const test1 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-resize-width-800.jpg'),
            conversionMetadata: {
                resize_width: 800
            }
        });

        console.log('✓ Test 1 completed');
        console.log(`  Job ID: ${test1.jobId}`);
        console.log(`  Processing time: ${test1.processingTime}ms`);
        console.log(`  File size: ${(test1.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test1.outputPath}`);

        // Test 2: Resize by height (maintains aspect ratio)
        console.log('\n📏 Test 2: Resize by height (600px)');
        const test2 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-resize-height-600.jpg'),
            conversionMetadata: {
                resize_height: 600
            }
        });

        console.log('✓ Test 2 completed');
        console.log(`  Job ID: ${test2.jobId}`);
        console.log(`  Processing time: ${test2.processingTime}ms`);
        console.log(`  File size: ${(test2.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test2.outputPath}`);

        // Test 3: Resize to exact dimensions (may distort)
        console.log('\n⚙️  Test 3: Resize to exact 1920x1080 (16:9)');
        const test3 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-resize-1920x1080.jpg'),
            conversionMetadata: {
                resize_width: 1920,
                resize_height: 1080
            }
        });

        console.log('✓ Test 3 completed');
        console.log(`  Job ID: ${test3.jobId}`);
        console.log(`  Processing time: ${test3.processingTime}ms`);
        console.log(`  File size: ${(test3.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test3.outputPath}`);

        // Test 4: Combine resize with aspect ratio change
        console.log('\n🎨 Test 4: Aspect ratio 1:1 + resize width 500px');
        const test4 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-square-500.jpg'),
            conversionMetadata: {
                aspect_ratio: '1:1',
                crop_strategy: 'crop-center',
                resize_width: 500,
                quality: 90
            }
        });

        console.log('✓ Test 4 completed');
        console.log(`  Job ID: ${test4.jobId}`);
        console.log(`  Processing time: ${test4.processingTime}ms`);
        console.log(`  File size: ${(test4.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test4.outputPath}`);

        // Test 5: Create thumbnail (small size)
        console.log('\n🖼️  Test 5: Create thumbnail (150x150)');
        const test5 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-thumbnail-150.jpg'),
            conversionMetadata: {
                resize_width: 150,
                resize_height: 150,
                quality: 85
            }
        });

        console.log('✓ Test 5 completed');
        console.log(`  Job ID: ${test5.jobId}`);
        console.log(`  Processing time: ${test5.processingTime}ms`);
        console.log(`  File size: ${(test5.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test5.outputPath}`);

        // Test 6: HD resolution with quality control
        console.log('\n📺 Test 6: HD resize (1280px width) with quality 95%');
        const test6 = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output-hd-1280.jpg'),
            conversionMetadata: {
                resize_width: 1280,
                quality: 95
            }
        });

        console.log('✓ Test 6 completed');
        console.log(`  Job ID: ${test6.jobId}`);
        console.log(`  Processing time: ${test6.processingTime}ms`);
        console.log(`  File size: ${(test6.fileSize / 1024).toFixed(2)} KB`);
        console.log(`  Output: ${test6.outputPath}`);

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('✅ All resize tests completed successfully!');
        console.log('='.repeat(60));

        const totalTests = 6;
        const avgProcessingTime = (test1.processingTime + test2.processingTime + test3.processingTime +
                                   test4.processingTime + test5.processingTime + test6.processingTime) / totalTests;

        console.log(`\nTotal tests: ${totalTests}`);
        console.log(`Average processing time: ${Math.round(avgProcessingTime)}ms`);
        console.log('\nOutput files:');
        console.log(`  1. ${test1.outputPath} (width: 800px)`);
        console.log(`  2. ${test2.outputPath} (height: 600px)`);
        console.log(`  3. ${test3.outputPath} (1920x1080)`);
        console.log(`  4. ${test4.outputPath} (square 500x500)`);
        console.log(`  5. ${test5.outputPath} (thumbnail 150x150)`);
        console.log(`  6. ${test6.outputPath} (HD 1280px)`);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        process.exit(1);
    }
}

runResizeTests();
