const ConvertorioClient = require('convertorio-sdk');
const path = require('path');

const API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3';

async function runTest() {
    console.log('Iniciando conversión...');

    try {
        const client = new ConvertorioClient({
            apiKey: API_KEY,
            baseUrl: 'https://api.convertorio.com'
        });

        const result = await client.convertFile({
            inputPath: path.join(__dirname, 'test-image.png'),
            targetFormat: 'jpg',
            outputPath: path.join(__dirname, 'output.jpg')
        });

        console.log('Conversión finalizada');
        console.log(`Job ID: ${result.jobId}`);
        console.log(`Tiempo: ${result.processingTime}ms`);

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

runTest();
