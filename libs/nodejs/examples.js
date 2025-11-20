/**
 * Convertorio SDK - Usage Examples with Advanced Conversion Options
 *
 * This file demonstrates how to use the SDK with advanced conversion features:
 * - Aspect ratio control
 * - Crop strategies
 * - Quality control
 * - ICO format with icon sizes
 */

const ConvertorioClient = require('./index');

// Initialize the client
const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

// Example 1: Basic conversion (without advanced options)
async function basicConversion() {
    console.log('Example 1: Basic conversion');

    const result = await client.convertFile({
        inputPath: './photo.png',
        targetFormat: 'jpg'
    });

    console.log('✓ Conversion completed:', result.outputPath);
}

// Example 2: Convert with aspect ratio control
async function aspectRatioConversion() {
    console.log('\nExample 2: Aspect ratio conversion (16:9 widescreen)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'png',
        conversionMetadata: {
            aspect_ratio: '16:9',
            crop_strategy: 'crop-center'
        }
    });

    console.log('✓ Converted to 16:9 aspect ratio:', result.outputPath);
}

// Example 3: Convert to square (1:1) for social media
async function squareConversion() {
    console.log('\nExample 3: Square conversion (1:1 for Instagram)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'jpg',
        conversionMetadata: {
            aspect_ratio: '1:1',
            crop_strategy: 'crop-center',
            quality: 85
        }
    });

    console.log('✓ Square image created:', result.outputPath);
}

// Example 4: High-quality WebP conversion
async function highQualityWebP() {
    console.log('\nExample 4: High-quality WebP conversion');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'webp',
        conversionMetadata: {
            quality: 95  // High quality
        }
    });

    console.log('✓ High-quality WebP created:', result.outputPath);
}

// Example 5: Optimized for web (smaller file size)
async function webOptimized() {
    console.log('\nExample 5: Web-optimized conversion');

    const result = await client.convertFile({
        inputPath: './photo.png',
        targetFormat: 'jpg',
        conversionMetadata: {
            quality: 75,  // Good quality, smaller file
            aspect_ratio: '16:9',
            crop_strategy: 'crop-center'
        }
    });

    console.log('✓ Web-optimized image:', result.outputPath);
}

// Example 6: Create ICO favicon with specific size
async function createFavicon() {
    console.log('\nExample 6: Create ICO favicon (32x32)');

    const result = await client.convertFile({
        inputPath: './logo.png',
        targetFormat: 'ico',
        conversionMetadata: {
            icon_size: 32,
            crop_strategy: 'crop-center'  // Make it square first
        }
    });

    console.log('✓ Favicon created:', result.outputPath);
}

// Example 7: Create multiple icon sizes
async function createMultipleIcons() {
    console.log('\nExample 7: Create multiple icon sizes');

    const sizes = [16, 32, 48, 64, 128, 256];

    for (const size of sizes) {
        const result = await client.convertFile({
            inputPath: './logo.png',
            targetFormat: 'ico',
            outputPath: `./icons/favicon-${size}x${size}.ico`,
            conversionMetadata: {
                icon_size: size,
                crop_strategy: 'crop-center'
            }
        });

        console.log(`✓ Icon ${size}x${size} created`);
    }
}

// Example 8: Vertical video format (9:16 for TikTok/Stories)
async function verticalVideo() {
    console.log('\nExample 8: Vertical format (9:16 for TikTok/Stories)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'jpg',
        conversionMetadata: {
            aspect_ratio: '9:16',
            crop_strategy: 'crop-center',
            quality: 85
        }
    });

    console.log('✓ Vertical format created:', result.outputPath);
}

// Example 9: Custom aspect ratio
async function customAspectRatio() {
    console.log('\nExample 9: Custom aspect ratio (3:2)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'jpg',
        conversionMetadata: {
            aspect_ratio: '3:2',
            crop_strategy: 'crop-top'  // Crop from top
        }
    });

    console.log('✓ Custom aspect ratio created:', result.outputPath);
}

// Example 10: Fit strategy (add padding instead of cropping)
async function fitStrategy() {
    console.log('\nExample 10: Fit strategy (add padding)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'png',
        conversionMetadata: {
            aspect_ratio: '16:9',
            crop_strategy: 'fit'  // Add padding, don't crop
        }
    });

    console.log('✓ Image with padding created:', result.outputPath);
}

// Example 11: With event listeners for progress tracking
async function conversionWithEvents() {
    console.log('\nExample 11: Conversion with progress events');

    // Listen to events
    client.on('start', (data) => {
        console.log(`▶ Starting: ${data.sourceFormat} → ${data.targetFormat}`);
    });

    client.on('progress', (data) => {
        console.log(`  ${data.step}: ${data.message}`);
    });

    client.on('complete', (result) => {
        console.log(`✓ Completed in ${result.processingTime}ms`);
        console.log(`  File size: ${(result.fileSize / 1024).toFixed(2)} KB`);
    });

    client.on('error', (error) => {
        console.error('✗ Error:', error.error);
    });

    // Perform conversion
    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'webp',
        conversionMetadata: {
            aspect_ratio: '16:9',
            crop_strategy: 'crop-center',
            quality: 85
        }
    });

    return result;
}

// Example 12: Resize by width (maintains aspect ratio)
async function resizeByWidth() {
    console.log('\nExample 12: Resize by width (maintains aspect ratio)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'jpg',
        conversionMetadata: {
            resize_width: 800  // Height calculated automatically
        }
    });

    console.log(`✓ Resized to width 800px: ${result.outputPath}`);
    return result;
}

// Example 13: Resize by height (maintains aspect ratio)
async function resizeByHeight() {
    console.log('\nExample 13: Resize by height (maintains aspect ratio)');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'jpg',
        conversionMetadata: {
            resize_height: 600  // Width calculated automatically
        }
    });

    console.log(`✓ Resized to height 600px: ${result.outputPath}`);
    return result;
}

// Example 14: Resize to exact dimensions (may distort)
async function resizeExact() {
    console.log('\nExample 14: Resize to exact dimensions');

    const result = await client.convertFile({
        inputPath: './photo.jpg',
        targetFormat: 'jpg',
        conversionMetadata: {
            resize_width: 800,
            resize_height: 600  // Forces exact 800x600
        }
    });

    console.log(`✓ Resized to exact 800x600: ${result.outputPath}`);
    return result;
}

// Example 15: Batch conversion with different settings
async function batchConversion() {
    console.log('\nExample 15: Batch conversion with different settings');

    const conversions = [
        {
            input: './photo1.jpg',
            format: 'webp',
            metadata: { quality: 85 }
        },
        {
            input: './photo2.png',
            format: 'jpg',
            metadata: { aspect_ratio: '16:9', crop_strategy: 'crop-center', quality: 90 }
        },
        {
            input: './logo.png',
            format: 'ico',
            metadata: { icon_size: 32, crop_strategy: 'crop-center' }
        }
    ];

    for (const conversion of conversions) {
        const result = await client.convertFile({
            inputPath: conversion.input,
            targetFormat: conversion.format,
            conversionMetadata: conversion.metadata
        });

        console.log(`✓ ${conversion.input} → ${result.outputPath}`);
    }
}

// Run examples
async function runExamples() {
    try {
        // Uncomment the examples you want to run:

        // await basicConversion();
        // await aspectRatioConversion();
        // await squareConversion();
        // await highQualityWebP();
        // await webOptimized();
        // await createFavicon();
        // await createMultipleIcons();
        // await verticalVideo();
        // await customAspectRatio();
        // await fitStrategy();
        // await conversionWithEvents();
        // await resizeByWidth();
        // await resizeByHeight();
        // await resizeExact();
        // await batchConversion();

        console.log('\n✓ All examples completed!');

    } catch (error) {
        console.error('Error running examples:', error.message);
    }
}

// Uncomment to run:
// runExamples();

module.exports = {
    basicConversion,
    aspectRatioConversion,
    squareConversion,
    highQualityWebP,
    webOptimized,
    createFavicon,
    createMultipleIcons,
    verticalVideo,
    customAspectRatio,
    fitStrategy,
    conversionWithEvents,
    resizeByWidth,
    resizeByHeight,
    resizeExact,
    batchConversion
};
