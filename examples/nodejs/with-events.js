/**
 * Conversion with Event Listeners
 *
 * This example shows how to use event listeners to track conversion progress
 */

const ConvertorioClient = require('../../libs/nodejs');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

// Listen to conversion events
client.on('start', (data) => {
    console.log(`🚀 Starting conversion: ${data.fileName}`);
    console.log(`   ${data.sourceFormat.toUpperCase()} → ${data.targetFormat.toUpperCase()}\n`);
});

client.on('progress', (data) => {
    console.log(`⏳ ${data.message}`);
    if (data.jobId) {
        console.log(`   Job ID: ${data.jobId}`);
    }
});

client.on('status', (data) => {
    console.log(`📊 Status: ${data.status} (attempt ${data.attempt}/${data.maxAttempts})`);
});

client.on('complete', (data) => {
    console.log('\n✅ Conversion completed!');
    console.log('📁 Output file:', data.outputPath);
    console.log('⚡ Processing time:', `${data.processingTime} ms`);
    console.log('💾 File size:', `${(data.fileSize / 1024).toFixed(2)} KB`);
});

client.on('error', (data) => {
    console.error('\n❌ Error:', data.error);
});

async function main() {
    try {
        await client.convertFile({
            inputPath: './input.png',
            targetFormat: 'webp',
            outputPath: './output.webp'
        });
    } catch (error) {
        console.error('Conversion failed:', error.message);
        process.exit(1);
    }
}

main();
