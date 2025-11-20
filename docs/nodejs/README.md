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

## Advanced Conversion Options

The SDK supports advanced conversion options through the `conversionMetadata` parameter. This allows you to control aspect ratio, quality, resize dimensions, and more.

### Aspect Ratio Control

Transform images to specific aspect ratios with automatic cropping or padding.

**Available Aspect Ratios:**
- `original` - Keep original aspect ratio (default)
- `1:1` - Square (Instagram, profile pictures)
- `4:3` - Traditional photos
- `16:9` - Widescreen, YouTube thumbnails
- `9:16` - Vertical video, Stories
- `21:9` - Ultrawide
- Custom ratios like `16:10`, `3:2`, etc.

**Crop Strategies:**
- `fit` - Add padding (letterbox/pillarbox) to maintain entire image
- `crop-center` - Crop from center (default)
- `crop-top` - Crop from top
- `crop-bottom` - Crop from bottom
- `crop-left` - Crop from left
- `crop-right` - Crop from right

**Example:**

```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        aspect_ratio: '16:9',
        crop_strategy: 'crop-center'
    }
});
```

### Quality Control

Adjust compression quality for lossy formats (JPG, WebP, AVIF, HEIC).

**Quality Range:** 1-100
- 1 = Lowest quality, smallest file size
- 100 = Highest quality, largest file size
- **Default:** 85 (recommended balance)

**Quality Guidelines:**
- **95-100**: Professional photography, archival
- **85-94**: High quality for web (recommended)
- **70-84**: Good quality, smaller files
- **50-69**: Medium quality, significant compression
- **1-49**: Low quality, maximum compression

**Example:**

```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'webp',
    conversionMetadata: {
        quality: 90
    }
});
```

### ICO Format Options

Create Windows icons with specific pixel sizes.

**Available Sizes:** 16, 32, 48, 64, 128, 256

The image will be automatically cropped to square using the selected crop strategy.

**Example:**

```javascript
const result = await client.convertFile({
    inputPath: './logo.png',
    targetFormat: 'ico',
    conversionMetadata: {
        icon_size: 64,
        crop_strategy: 'crop-center'
    }
});
```

### Resize Control

Resize images to specific dimensions while optionally maintaining aspect ratio.

**Parameters:**
- `resize_width` - Target width in pixels (1-10000)
- `resize_height` - Target height in pixels (1-10000)

**Resize Behavior:**
- **Width only**: Height calculated automatically (maintains aspect ratio)
- **Height only**: Width calculated automatically (maintains aspect ratio)
- **Both specified**: Exact dimensions (may distort image if aspect ratio differs)

**Example - Resize by width:**

```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        resize_width: 800  // Height will be calculated automatically
    }
});
```

**Example - Resize by height:**

```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        resize_height: 600  // Width will be calculated automatically
    }
});
```

**Example - Resize to exact dimensions:**

```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        resize_width: 1920,
        resize_height: 1080  // May distort if original aspect ratio differs
    }
});
```

**Example - Combine resize with aspect ratio:**

```javascript
// Create a 500x500 square thumbnail with center crop
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'jpg',
    conversionMetadata: {
        aspect_ratio: '1:1',
        crop_strategy: 'crop-center',
        resize_width: 500,
        quality: 90
    }
});
```

**Resize Guidelines:**
- Use width/height resize for responsive images
- Combine with aspect ratio for precise control
- Quality parameter affects lossy formats (JPG, WebP, AVIF)
- LANCZOS resampling ensures high-quality results

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
