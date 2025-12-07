# Convertorio SDK for PHP

Official PHP SDK for the Convertorio API. Convert images between 20+ formats with just a few lines of code.

## Features

- ✅ Simple, intuitive API
- ✅ Event-driven progress tracking
- ✅ Automatic file upload and download
- ✅ Support for 20+ image formats
- ✅ PSR-4 autoloading
- ✅ Batch conversion support
- ✅ Full error handling
- ✅ PDF to Thumbnail conversion
- ✅ AI-powered OCR text extraction

## Requirements

- PHP >= 7.4
- cURL extension
- JSON extension

## Installation

```bash
composer require convertorio/sdk
```

## Quick Start

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

// Initialize the client
$client = new ConvertorioClient('your_api_key_here');

// Convert an image
$result = $client->convertFile(
    './image.png',
    'jpg'
);

echo "Converted! " . $result['output_path'];
```

## Configuration

### Creating a Client

```php
use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient(
    'your_api_key_here',           // Required: Your API key
    'https://api.convertorio.com'  // Optional: Custom API URL
);
```

**Getting your API Key:**
1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

## API Reference

### `convertFile()`

Convert an image file from one format to another.

**Parameters:**
- `$inputPath` (string, required): Path to the input image file
- `$targetFormat` (string, required): Target format (jpg, png, webp, avif, gif, bmp, tiff, ico, heic, etc.)
- `$outputPath` (string, optional): Custom output path. If not provided, uses the same directory as input with new extension
- `$conversionMetadata` (array, optional): Advanced conversion options (see Advanced Options section below)

**Returns:** array

**Example:**

```php
$result = $client->convertFile(
    './photo.png',
    'webp',
    './converted/photo.webp'
);

print_r($result);
// Array
// (
//     [success] => true
//     [job_id] => abc-123-def
//     [input_path] => ./photo.png
//     [output_path] => ./converted/photo.webp
//     [source_format] => png
//     [target_format] => webp
//     [file_size] => 45620
//     [processing_time] => 1250
//     [download_url] => https://...
// )
```

### `getAccount()`

Get account information including points balance and usage.

**Returns:** array

**Example:**

```php
$account = $client->getAccount();

print_r($account);
// Array
// (
//     [id] => user-123
//     [email] => user@example.com
//     [name] => John Doe
//     [plan] => free
//     [points] => 100
//     [daily_conversions_remaining] => 5
//     [total_conversions] => 42
// )
```

### `listJobs()`

List your conversion jobs with optional filtering.

**Parameters:**
- `$limit` (int, optional): Number of jobs to return (default: 50, max: 100)
- `$offset` (int, optional): Offset for pagination (default: 0)
- `$status` (string, optional): Filter by status ('completed', 'failed', 'processing', etc.)

**Returns:** array

**Example:**

```php
$jobs = $client->listJobs(10, 0, 'completed');

print_r($jobs);
// Array
// (
//     [0] => Array
//         (
//             [id] => job-123
//             [status] => completed
//             [original_filename] => photo.png
//             [source_format] => png
//             [target_format] => jpg
//             [processing_time_ms] => 1200
//             [created_at] => 2025-01-20T10:30:00Z
//         )
//     ...
// )
```

### `getJob()`

Get details for a specific conversion job.

**Parameters:**
- `$jobId` (string, required): The job ID

**Returns:** array

**Example:**

```php
$job = $client->getJob('job-123');

print_r($job);
// Array
// (
//     [id] => job-123
//     [status] => completed
//     [original_filename] => photo.png
//     [download_url] => https://...
//     ...
// )
```

## Events

The client supports event callbacks for tracking conversion progress:

### Event: `start`

Emitted when conversion starts.

```php
$client->on('start', function($data) {
    echo "Starting: {$data['file_name']}\n";
    echo "Converting {$data['source_format']} to {$data['target_format']}\n";
});
```

### Event: `progress`

Emitted at each step of the conversion process.

```php
$client->on('progress', function($data) {
    echo "Step: {$data['step']}\n";
    echo "Message: {$data['message']}\n";
    // $data['step'] can be:
    // - 'requesting-upload-url'
    // - 'uploading'
    // - 'confirming'
    // - 'converting'
    // - 'downloading'
});
```

### Event: `status`

Emitted during polling for job completion.

```php
$client->on('status', function($data) {
    echo "Status: {$data['status']}\n";
    echo "Attempt: {$data['attempt']}/{$data['max_attempts']}\n";
});
```

### Event: `complete`

Emitted when conversion completes successfully.

```php
$client->on('complete', function($result) {
    echo "Conversion complete!\n";
    echo "Output: {$result['output_path']}\n";
    echo "Size: {$result['file_size']} bytes\n";
    echo "Time: {$result['processing_time']} ms\n";
});
```

### Event: `error`

Emitted when an error occurs.

```php
$client->on('error', function($data) {
    echo "Conversion failed: {$data['error']}\n";
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

The SDK supports advanced conversion options through the `$conversionMetadata` parameter. This allows you to control aspect ratio, quality, resize dimensions, and more.

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

```php
$result = $client->convertFile(
    './photo.jpg',
    'jpg',
    null,
    [
        'aspect_ratio' => '16:9',
        'crop_strategy' => 'crop-center'
    ]
);
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

```php
$result = $client->convertFile(
    './photo.jpg',
    'webp',
    null,
    ['quality' => 90]
);
```

### ICO Format Options

Create Windows icons with specific pixel sizes.

**Available Sizes:** 16, 32, 48, 64, 128, 256

The image will be automatically cropped to square using the selected crop strategy.

**Example:**

```php
$result = $client->convertFile(
    './logo.png',
    'ico',
    null,
    [
        'icon_size' => 64,
        'crop_strategy' => 'crop-center'
    ]
);
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

```php
$result = $client->convertFile(
    './photo.jpg',
    'jpg',
    null,
    ['resize_width' => 800]  // Height will be calculated automatically
);
```

**Example - Resize by height:**

```php
$result = $client->convertFile(
    './photo.jpg',
    'jpg',
    null,
    ['resize_height' => 600]  // Width will be calculated automatically
);
```

**Example - Resize to exact dimensions:**

```php
$result = $client->convertFile(
    './photo.jpg',
    'jpg',
    null,
    [
        'resize_width' => 1920,
        'resize_height' => 1080  // May distort if original aspect ratio differs
    ]
);
```

**Example - Combine resize with aspect ratio:**

```php
// Create a 500x500 square thumbnail with center crop
$result = $client->convertFile(
    './photo.jpg',
    'jpg',
    null,
    [
        'aspect_ratio' => '1:1',
        'crop_strategy' => 'crop-center',
        'resize_width' => 500,
        'quality' => 90
    ]
);
```

**Resize Guidelines:**
- Use width/height resize for responsive images
- Combine with aspect ratio for precise control
- Quality parameter affects lossy formats (JPG, WebP, AVIF)
- LANCZOS resampling ensures high-quality results

## PDF Thumbnails

Generate JPG preview images from PDF documents. The thumbnail is rendered from the first page of the PDF.

### Basic PDF Thumbnail

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

// Convert PDF first page to JPG thumbnail
$result = $client->convertFile(
    './document.pdf',
    'thumbnail',
    './preview.jpg',
    ['thumbnail_width' => 800]  // Width in pixels (50-2000)
);

echo "Thumbnail saved: {$result['output_path']}\n";
echo "Size: {$result['file_size']} bytes\n";
```

### Thumbnail Options

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `thumbnail_width` | int | 50-2000 | 800 | Width in pixels |
| `thumbnail_height` | int | 50-2000 | auto | Height (calculated automatically if not set) |
| `thumbnail_crop` | string | see below | full | Portion of page to capture |

### Crop Modes

Control which portion of the PDF page to capture (from the top):

| Value | Description |
|-------|-------------|
| `full` | Complete page - 100% (default) |
| `half` | Top half - 50% |
| `third` | Top third - 33% |
| `quarter` | Top quarter - 25% |
| `two-thirds` | Top two-thirds - 66% |

### Thumbnail with Crop

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

// Capture only the top half of the PDF page
$result = $client->convertFile(
    './document.pdf',
    'thumbnail',
    './header_preview.jpg',
    [
        'thumbnail_width' => 600,
        'thumbnail_crop' => 'half'  // Only top 50% of page
    ]
);

echo "Header thumbnail: {$result['output_path']}\n";
```

### Thumbnail with Progress Events

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

// Set up progress callbacks
$client->on('progress', function($data) {
    echo "Step: {$data['step']}\n";
});

$client->on('complete', function($data) {
    echo "Done! Job: {$data['job_id']}\n";
});

$client->on('error', function($data) {
    echo "Error: {$data['error']}\n";
});

// Convert with progress tracking
$result = $client->convertFile(
    './report.pdf',
    'thumbnail',
    null,
    [
        'thumbnail_width' => 400,
        'thumbnail_crop' => 'third'  // Just the header area
    ]
);
```

### Batch PDF Thumbnails

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

// Generate thumbnails for all PDFs in a directory
$pdfDir = './documents';
$outputDir = './thumbnails';

// Create output directory if needed
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
}

$pdfFiles = glob($pdfDir . '/*.pdf');

foreach ($pdfFiles as $pdfFile) {
    $basename = basename($pdfFile, '.pdf');
    $outputPath = $outputDir . '/' . $basename . '.jpg';

    $result = $client->convertFile(
        $pdfFile,
        'thumbnail',
        $outputPath,
        [
            'thumbnail_width' => 300,
            'thumbnail_crop' => 'half'
        ]
    );
    echo "Created: {$outputPath}\n";
}
```

### Thumbnail Notes

- Output format is always **JPEG** (quality 90)
- Only the **first page** of the PDF is rendered
- Aspect ratio is **preserved automatically**
- Maximum file size: **20 MB**
- Supported input: PDF files only

## Examples

### Basic Conversion

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

$result = $client->convertFile('./input.png', 'jpg');

echo "Done! " . $result['output_path'];
```

### With Progress Events

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

$client->on('progress', function($data) {
    echo "[{$data['step']}] {$data['message']}\n";
});

$client->on('complete', function($result) {
    echo "✓ Conversion completed!\n";
    echo "Output: {$result['output_path']}\n";
});

$result = $client->convertFile('./photo.png', 'webp');
```

### Batch Conversion

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

// Get all PNG files
$files = glob('./images/*.png');

// Convert all to WebP
foreach ($files as $file) {
    $result = $client->convertFile($file, 'webp');
    echo "Converted: {$file}\n";
}
```

### Advanced Conversion with Metadata

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

// Convert to 16:9 aspect ratio with high quality
$result = $client->convertFile(
    './photo.jpg',
    'webp',
    null,
    [
        'aspect_ratio' => '16:9',
        'crop_strategy' => 'crop-center',
        'quality' => 90
    ]
);

echo "Converted to 16:9: {$result['output_path']}";
```

### Error Handling

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

try {
    $result = $client->convertFile('./image.png', 'jpg');
    echo "Success: {$result['output_path']}";
} catch (Exception $e) {
    echo "Conversion failed: {$e->getMessage()}";

    // Handle specific errors
    if (strpos($e->getMessage(), 'Insufficient') !== false) {
        echo "Not enough points/credits";
    }
}
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
| `API key is required` | No API key provided | Provide your API key in the constructor |
| `Input file not found` | File doesn't exist | Check the file path |
| `HTTP request failed` | Wrong or expired API key | Verify your API key in account settings |
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
