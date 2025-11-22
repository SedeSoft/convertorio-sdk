# Convertorio SDK for Node.js

Official Node.js SDK for the Convertorio API. Convert images between 20+ formats with just a few lines of code.

## Features

- ✅ Simple, promise-based API
- ✅ Event-driven progress tracking
- ✅ Automatic file upload and download
- ✅ Support for 20+ image formats
- ✅ TypeScript definitions included
- ✅ Batch conversion support
- ✅ Full error handling

## Installation

```bash
npm install convertorio-sdk
```

Or with yarn:

```bash
yarn add convertorio-sdk
```

## Quick Start

```javascript
const ConvertorioClient = require('convertorio-sdk');

// Initialize the client
const client = new ConvertorioClient({
    apiKey: 'your_api_key_here' // Get your API key from https://convertorio.com/account
});

// Convert an image
async function convert() {
    const result = await client.convertFile({
        inputPath: './image.png',
        targetFormat: 'jpg'
    });

    console.log('Converted!', result.outputPath);
}

convert();
```

## Configuration

### Creating a Client

```javascript
const client = new ConvertorioClient({
    apiKey: 'your_api_key_here',      // Required: Your API key
    baseUrl: 'https://api.convertorio.com'  // Optional: Custom API URL
});
```

**Getting your API Key:**
1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

## API Reference

### `convertFile(options)`

Convert an image file from one format to another.

**Parameters:**
- `options.inputPath` (string, required): Path to the input image file
- `options.targetFormat` (string, required): Target format (jpg, png, webp, avif, gif, bmp, tiff, ico, heic, etc.)
- `options.outputPath` (string, optional): Custom output path. If not provided, uses the same directory as input with new extension
- `options.conversionMetadata` (object, optional): Advanced conversion options (see Advanced Options section below)

**Returns:** Promise<ConversionResult>

**Example:**

```javascript
const result = await client.convertFile({
    inputPath: './photo.png',
    targetFormat: 'webp',
    outputPath: './converted/photo.webp'
});

console.log(result);
// {
//   success: true,
//   jobId: 'abc-123-def',
//   inputPath: './photo.png',
//   outputPath: './converted/photo.webp',
//   sourceFormat: 'png',
//   targetFormat: 'webp',
//   fileSize: 45620,
//   processingTime: 1250,
//   downloadUrl: 'https://...'
// }
```

### `getAccount()`

Get account information including points balance and usage.

**Returns:** Promise<AccountInfo>

**Example:**

```javascript
const account = await client.getAccount();

console.log(account);
// {
//   id: 'user-123',
//   email: 'user@example.com',
//   name: 'John Doe',
//   plan: 'free',
//   points: 100,
//   daily_conversions_remaining: 5,
//   total_conversions: 42
// }
```

### `listJobs(options)`

List your conversion jobs with optional filtering.

**Parameters:**
- `options.limit` (number, optional): Number of jobs to return (default: 50, max: 100)
- `options.offset` (number, optional): Offset for pagination (default: 0)
- `options.status` (string, optional): Filter by status ('completed', 'failed', 'processing', etc.)

**Returns:** Promise<Job[]>

**Example:**

```javascript
const jobs = await client.listJobs({
    limit: 10,
    status: 'completed'
});

console.log(jobs);
// [
//   {
//     id: 'job-123',
//     status: 'completed',
//     original_filename: 'photo.png',
//     source_format: 'png',
//     target_format: 'jpg',
//     processing_time_ms: 1200,
//     created_at: '2025-01-20T10:30:00Z'
//   },
//   ...
// ]
```

### `getJob(jobId)`

Get details for a specific conversion job.

**Parameters:**
- `jobId` (string, required): The job ID

**Returns:** Promise<Job>

**Example:**

```javascript
const job = await client.getJob('job-123');

console.log(job);
// {
//   id: 'job-123',
//   status: 'completed',
//   original_filename: 'photo.png',
//   download_url: 'https://...',
//   ...
// }
```

## Events

The client extends `EventEmitter` and emits several events during conversion:

### Event: `start`

Emitted when conversion starts.

```javascript
client.on('start', (data) => {
    console.log(`Starting: ${data.fileName}`);
    console.log(`Converting ${data.sourceFormat} to ${data.targetFormat}`);
});
```

### Event: `progress`

Emitted at each step of the conversion process.

```javascript
client.on('progress', (data) => {
    console.log(`Step: ${data.step}`);
    console.log(`Message: ${data.message}`);
    // data.step can be:
    // - 'requesting-upload-url'
    // - 'uploading'
    // - 'confirming'
    // - 'converting'
    // - 'downloading'
});
```

### Event: `status`

Emitted during polling for job completion.

```javascript
client.on('status', (data) => {
    console.log(`Status: ${data.status}`);
    console.log(`Attempt: ${data.attempt}/${data.maxAttempts}`);
});
```

### Event: `complete`

Emitted when conversion completes successfully.

```javascript
client.on('complete', (result) => {
    console.log('Conversion complete!');
    console.log(`Output: ${result.outputPath}`);
    console.log(`Size: ${result.fileSize} bytes`);
    console.log(`Time: ${result.processingTime} ms`);
});
```

### Event: `error`

Emitted when an error occurs.

```javascript
client.on('error', (data) => {
    console.error('Conversion failed:', data.error);
});
```

## Supported Formats

The SDK supports conversion between all formats supported by Convertorio:

**Common Formats:**
- JPG/JPEG
- PNG
- WebP
- AVIF
- GIF
- BMP
- TIFF

**Advanced Formats:**
- HEIC/HEIF (iPhone photos)
- ICO (icons)
- SVG (vectors)
- RAW formats (CR2, NEF, DNG)
- PDF
- PSD (Photoshop)
- AI (Adobe Illustrator)
- EPS
- JXL (JPEG XL)

**✨ AI-Powered OCR:**
- Extract text from any image format
- Powered by advanced AI technology
- Support for printed and handwritten text
- JSON or TXT output formats

## 🤖 AI-Powered OCR

Extract text from images with state-of-the-art AI accuracy.

### Quick OCR Example

```javascript
const result = await client.convertFile({
    inputPath: './invoice.jpg',
    targetFormat: 'ocr',
    outputPath: './invoice.json',
    conversionMetadata: {
        ocr_format: 'json',
        ocr_instructions: 'Extract invoice data including date, items, and total'
    }
});

console.log(`Extracted text, tokens used: ${result.tokensUsed}`);
```

### OCR Features

- **High Accuracy**: Powered by advanced AI for state-of-the-art text recognition
- **Multiple Languages**: Automatic language detection and support
- **Flexible Output**: Choose between `txt` (plain text) or `json` (structured data)
- **Custom Instructions**: Guide the AI to extract specific information
- **Handwriting Support**: Recognizes both printed and handwritten text
- **Table Recognition**: Preserves table structure in extracted text
- **Token-Based Billing**: Pay only for what you use, with transparent token counts

### OCR Options

| Option | Type | Values | Description |
|--------|------|--------|-------------|
| `ocr_format` | string | `txt`, `json` | Output format (default: `txt`) |
| `ocr_instructions` | string | Any text | Custom instructions to guide extraction |

### OCR Use Cases

- 📄 **Invoice Processing**: Extract structured data from invoices and receipts
- 📝 **Form Digitization**: Convert paper forms to digital data
- 📋 **Document Archival**: Make scanned documents searchable
- 🏷️ **Label Reading**: Extract text from product labels and tags
- ✍️ **Handwriting Recognition**: Digitize handwritten notes and documents

### Complete OCR Example

```javascript
const ConvertorioClient = require('convertorio-sdk');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

// Extract text as JSON with custom instructions
const result = await client.convertFile({
    inputPath: './receipt.jpg',
    targetFormat: 'ocr',
    outputPath: './receipt.json',
    conversionMetadata: {
        ocr_format: 'json',
        ocr_instructions: 'Extract merchant name, date, items with prices, and total amount'
    }
});

console.log('OCR completed!');
console.log(`Tokens used: ${result.tokensUsed}`);
console.log(`Output saved to: ${result.outputPath}`);

// The extracted text is saved to receipt.json
const fs = require('fs');
const extractedData = JSON.parse(fs.readFileSync('./receipt.json', 'utf8'));
console.log(extractedData);
```

## Advanced Conversion Options

You can control various aspects of the conversion process by passing a `conversionMetadata` object:

### Aspect Ratio Control

Change the aspect ratio of the output image:

```javascript
await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'png',
    conversionMetadata: {
        aspect_ratio: '16:9',        // Target aspect ratio
        crop_strategy: 'crop-center'  // How to handle the change
    }
});
```

**Available aspect ratios:**
- `'original'` - Keep original aspect ratio (default)
- `'1:1'` - Square (Instagram, profile photos)
- `'4:3'` - Standard photo/video
- `'16:9'` - Widescreen video, HD
- `'9:16'` - Vertical/portrait video (TikTok, Stories)
- `'21:9'` - Ultra-widescreen
- Custom ratios like `'16:10'`, `'3:2'`, etc.

**Crop strategies:**
- `'fit'` - Contain image with padding (letterbox/pillarbox)
- `'crop-center'` - Crop from center
- `'crop-top'` - Crop aligned to top
- `'crop-bottom'` - Crop aligned to bottom
- `'crop-left'` - Crop aligned to left
- `'crop-right'` - Crop aligned to right

### Quality Control

Adjust compression quality for lossy formats (JPG, WebP, AVIF):

```javascript
await client.convertFile({
    inputPath: './photo.png',
    targetFormat: 'jpg',
    conversionMetadata: {
        quality: 90  // 1-100, default is 85
    }
});
```

**Quality guidelines:**
- `90-100` - Excellent quality, large files
- `80-90` - High quality, good balance (recommended)
- `70-80` - Good quality, smaller files
- `50-70` - Medium quality, small files
- `1-50` - Low quality, very small files

### ICO Format Options

When converting to ICO format, specify the icon size:

```javascript
await client.convertFile({
    inputPath: './logo.png',
    targetFormat: 'ico',
    conversionMetadata: {
        icon_size: 32,              // 16, 32, 48, 64, 128, or 256
        crop_strategy: 'crop-center' // How to make it square
    }
});
```

**Available icon sizes:** 16, 32, 48, 64, 128, 256 pixels

### Resize Control

Resize images to specific dimensions while maintaining aspect ratio:

```javascript
// Resize by width (height calculated automatically)
await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        resize_width: 800  // Height will be calculated to maintain aspect ratio
    }
});

// Resize by height (width calculated automatically)
await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        resize_height: 600  // Width will be calculated to maintain aspect ratio
    }
});

// Resize to exact dimensions (may distort image)
await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        resize_width: 800,
        resize_height: 600  // Forces exact dimensions
    }
});
```

**Resize guidelines:**
- Specify only `resize_width` to scale by width (maintains aspect ratio)
- Specify only `resize_height` to scale by height (maintains aspect ratio)
- Specify both to force exact dimensions (may distort if ratios don't match)
- Range: 1-10000 pixels
- Can be combined with aspect ratio and crop strategy for advanced control

### Complete Example

```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'webp',
    outputPath: './output/photo-optimized.webp',
    conversionMetadata: {
        aspect_ratio: '16:9',
        crop_strategy: 'crop-center',
        quality: 85,
        resize_width: 1920  // Final width after aspect ratio change
    }
});

console.log('Converted with custom options!', result);
```

## Examples

### Basic Conversion

```javascript
const ConvertorioClient = require('convertorio-sdk');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

const result = await client.convertFile({
    inputPath: './input.png',
    targetFormat: 'jpg'
});

console.log('Done!', result.outputPath);
```

### With Progress Events

```javascript
const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

client.on('progress', (data) => {
    console.log(`[${data.step}] ${data.message}`);
});

client.on('complete', (result) => {
    console.log('✓ Conversion completed!');
    console.log('Output:', result.outputPath);
});

await client.convertFile({
    inputPath: './photo.png',
    targetFormat: 'webp'
});
```

### Batch Conversion

```javascript
const fs = require('fs');
const path = require('path');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

// Get all PNG files
const files = fs.readdirSync('./images')
    .filter(f => f.endsWith('.png'))
    .map(f => path.join('./images', f));

// Convert all to WebP
for (const file of files) {
    await client.convertFile({
        inputPath: file,
        targetFormat: 'webp'
    });
    console.log('Converted:', file);
}
```

### Error Handling

```javascript
try {
    const result = await client.convertFile({
        inputPath: './image.png',
        targetFormat: 'jpg'
    });
    console.log('Success:', result.outputPath);
} catch (error) {
    console.error('Conversion failed:', error.message);

    // Handle specific errors
    if (error.message.includes('not found')) {
        console.error('Input file does not exist');
    } else if (error.message.includes('Insufficient')) {
        console.error('Not enough points/credits');
    }
}
```

### TypeScript Usage

```typescript
import ConvertorioClient, { ConversionOptions, ConversionResult } from 'convertorio-sdk';

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

const options: ConversionOptions = {
    inputPath: './image.png',
    targetFormat: 'webp'
};

const result: ConversionResult = await client.convertFile(options);
console.log(result.outputPath);
```

## Rate Limiting

The API has the following rate limits:
- **1 request per second** per IP address
- **5 concurrent jobs** maximum per user

The SDK automatically handles rate limiting by polling job status with appropriate delays.

## Error Handling

Common errors you might encounter:

| Error | Description | Solution |
|-------|-------------|----------|
| `API key is required` | No API key provided | Provide your API key in the config |
| `Input file not found` | File doesn't exist | Check the file path |
| `Invalid API key` | Wrong or expired API key | Verify your API key in account settings |
| `Insufficient credits` | Not enough points | Purchase more points or use free tier |
| `File size exceeds limit` | File too large | Maximum file size is 20 MB |
| `Conversion timeout` | Job took too long | Try again or contact support |

## Best Practices

1. **Reuse the client instance** - Don't create a new client for each conversion
2. **Use events for long conversions** - Monitor progress instead of just waiting
3. **Handle errors gracefully** - Always wrap conversions in try/catch
4. **Respect rate limits** - Use batch processing with delays if converting many files
5. **Check file sizes** - Maximum file size is 20 MB
6. **Validate formats** - Check that the target format is supported

## Support

- **Documentation:** [https://convertorio.com/docs](https://convertorio.com/docs)
- **API Reference:** [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Support:** [support@convertorio.com](mailto:support@convertorio.com)
- **GitHub Issues:** [https://github.com/convertorio/sdk/issues](https://github.com/convertorio/sdk/issues)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
