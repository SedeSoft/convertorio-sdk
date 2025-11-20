# Convertorio SDK - Node.js Examples

This directory contains examples demonstrating how to use the Convertorio SDK for Node.js.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Get your API key from [convertorio.com/account](https://convertorio.com/account)

3. Update the API key in each example file (replace `'your_api_key_here'`)

## Examples

### 1. Basic Conversion (`basic-conversion.js`)

The simplest way to convert an image.

```bash
npm run basic
# or
node basic-conversion.js
```

**What it does:**
- Converts a single image file
- Shows the basic usage pattern
- Displays the result

### 2. Conversion with Events (`with-events.js`)

Shows how to track conversion progress using event listeners.

```bash
npm run events
# or
node with-events.js
```

**What it does:**
- Demonstrates all available events
- Shows progress tracking
- Provides detailed status updates

**Events covered:**
- `start` - When conversion begins
- `progress` - Step-by-step progress
- `status` - Job status updates
- `complete` - Successful completion
- `error` - Error handling

### 3. Batch Conversion (`batch-conversion.js`)

Convert multiple files in sequence.

```bash
npm run batch
# or
node batch-conversion.js
```

**What it does:**
- Finds all PNG files in a directory
- Converts them to JPG
- Shows a summary of results

**Use cases:**
- Converting multiple files
- Batch processing workflows
- Directory-based conversion

### 4. Account Information (`account-info.js`)

Get account details and list conversion jobs.

```bash
npm run account
# or
node account-info.js
```

**What it does:**
- Retrieves account information
- Lists recent conversion jobs
- Shows job details

**APIs covered:**
- `getAccount()` - Account information
- `listJobs()` - List conversion jobs
- `getJob()` - Get specific job details

## Common Use Cases

### Converting a Single File

```javascript
const ConvertorioClient = require('@convertorio/sdk');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

const result = await client.convertFile({
    inputPath: './image.png',
    targetFormat: 'jpg'
});

console.log('Done!', result.outputPath);
```

### Converting with Custom Output Path

```javascript
const result = await client.convertFile({
    inputPath: './photos/vacation.png',
    targetFormat: 'webp',
    outputPath: './converted/vacation.webp'
});
```

### Tracking Progress

```javascript
client.on('progress', (data) => {
    console.log(`[${data.step}] ${data.message}`);
});

client.on('complete', (result) => {
    console.log('Success!', result.outputPath);
});

await client.convertFile({
    inputPath: './image.png',
    targetFormat: 'jpg'
});
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
    console.error('Failed:', error.message);
}
```

## Tips

1. **Reuse the client instance** - Create one client and use it for multiple conversions
2. **Check file paths** - Ensure input files exist before converting
3. **Handle errors** - Always use try/catch or .catch() for error handling
4. **Monitor progress** - Use events for long-running conversions
5. **Respect rate limits** - Wait between conversions if processing many files

## Supported Formats

You can convert between these formats:

- `jpg`, `jpeg` - JPEG images
- `png` - PNG images
- `webp` - WebP images
- `avif` - AVIF images
- `gif` - GIF animations
- `bmp` - Bitmap images
- `tiff`, `tif` - TIFF images
- `ico` - Icon files
- `heic`, `heif` - iPhone photos
- `svg` - Vector graphics
- `raw`, `cr2`, `nef`, `dng` - RAW camera files
- `psd` - Photoshop files
- `pdf` - PDF documents
- `jxl` - JPEG XL

## Need Help?

- [Full Documentation](../../docs/nodejs/README.md)
- [API Reference](https://convertorio.com/api-docs)
- [Support](mailto:support@convertorio.com)
