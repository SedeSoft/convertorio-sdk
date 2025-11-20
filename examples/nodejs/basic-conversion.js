/**
 * Basic Image Conversion Example
 *
 * This example shows how to convert a single image file
 */

const ConvertorioClient = require('../../libs/nodejs');

// Initialize the client with your API key
const client = new ConvertorioClient({
    apiKey: 'your_api_key_here' // Get your API key from https://convertorio.com/account
});

async function main() {
    try {
        console.log('Starting image conversion...\n');

        // Convert an image
        const result = await client.convertFile({
            inputPath: './input.png',
            targetFormat: 'jpg'
            // outputPath is optional - will auto-generate if not provided
        });

        console.log('\n✓ Conversion completed successfully!');
        console.log('Result:', {
            inputFile: result.inputPath,
            outputFile: result.outputPath,
            format: `${result.sourceFormat} → ${result.targetFormat}`,
            fileSize: `${(result.fileSize / 1024).toFixed(2)} KB`,
            processingTime: `${result.processingTime} ms`
        });

    } catch (error) {
        console.error('✗ Conversion failed:', error.message);
        process.exit(1);
    }
}

main();
