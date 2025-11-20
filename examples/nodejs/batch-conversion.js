/**
 * Batch Image Conversion Example
 *
 * This example shows how to convert multiple images in batch
 */

const ConvertorioClient = require('../../libs/nodejs');
const fs = require('fs');
const path = require('path');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

async function convertBatch(files, targetFormat) {
    console.log(`Converting ${files.length} files to ${targetFormat.toUpperCase()}...\n`);

    const results = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`[${i + 1}/${files.length}] Converting ${path.basename(file)}...`);

        try {
            const result = await client.convertFile({
                inputPath: file,
                targetFormat
            });

            results.push({
                success: true,
                file,
                outputPath: result.outputPath
            });

            console.log(`✓ Completed: ${result.outputPath}\n`);

        } catch (error) {
            results.push({
                success: false,
                file,
                error: error.message
            });

            console.error(`✗ Failed: ${error.message}\n`);
        }
    }

    return results;
}

async function main() {
    // Example: Convert all PNG files in a directory to JPG
    const inputDir = './images';
    const targetFormat = 'jpg';

    // Get all PNG files
    const files = fs.readdirSync(inputDir)
        .filter(file => file.toLowerCase().endsWith('.png'))
        .map(file => path.join(inputDir, file));

    if (files.length === 0) {
        console.log('No PNG files found in', inputDir);
        return;
    }

    const results = await convertBatch(files, targetFormat);

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('\n========================================');
    console.log('Batch Conversion Summary');
    console.log('========================================');
    console.log(`Total: ${results.length}`);
    console.log(`✓ Successful: ${successful}`);
    console.log(`✗ Failed: ${failed}`);
    console.log('========================================\n');

    if (failed > 0) {
        console.log('Failed conversions:');
        results.filter(r => !r.success).forEach(r => {
            console.log(`  - ${r.file}: ${r.error}`);
        });
    }
}

main();
