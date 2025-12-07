# Convertorio SDK for Python

Official Python SDK for the Convertorio API. Convert images between 20+ formats with just a few lines of code.

## Features

- ✅ Simple, intuitive API
- ✅ Event-driven progress tracking
- ✅ Automatic file upload and download
- ✅ Support for 20+ image formats
- ✅ Type hints included
- ✅ Batch conversion support
- ✅ Full error handling
- ✅ PDF to Thumbnail conversion
- ✅ AI-powered OCR text extraction

## Installation

```bash
pip install convertorio-sdk
```

## Quick Start

```python
from convertorio_sdk import ConvertorioClient

# Initialize the client
client = ConvertorioClient(
    api_key='your_api_key_here'  # Get your API key from https://convertorio.com/account
)

# Convert an image
result = client.convert_file(
    input_path='./image.png',
    target_format='jpg'
)

print(f"Converted! {result['output_path']}")
```

## Configuration

### Creating a Client

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(
    api_key='your_api_key_here',           # Required: Your API key
    base_url='https://api.convertorio.com'  # Optional: Custom API URL
)
```

**Getting your API Key:**
1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

## API Reference

### `convert_file()`

Convert an image file from one format to another.

**Parameters:**
- `input_path` (str, required): Path to the input image file
- `target_format` (str, required): Target format (jpg, png, webp, avif, gif, bmp, tiff, ico, heic, etc.)
- `output_path` (str, optional): Custom output path. If not provided, uses the same directory as input with new extension
- `conversion_metadata` (dict, optional): Advanced conversion options (see Advanced Options section below)

**Returns:** dict

**Example:**

```python
result = client.convert_file(
    input_path='./photo.png',
    target_format='webp',
    output_path='./converted/photo.webp'
)

print(result)
# {
#   'success': True,
#   'job_id': 'abc-123-def',
#   'input_path': './photo.png',
#   'output_path': './converted/photo.webp',
#   'source_format': 'png',
#   'target_format': 'webp',
#   'file_size': 45620,
#   'processing_time': 1250,
#   'download_url': 'https://...'
# }
```

### `get_account()`

Get account information including points balance and usage.

**Returns:** dict

**Example:**

```python
account = client.get_account()

print(account)
# {
#   'id': 'user-123',
#   'email': 'user@example.com',
#   'name': 'John Doe',
#   'plan': 'free',
#   'points': 100,
#   'daily_conversions_remaining': 5,
#   'total_conversions': 42
# }
```

### `list_jobs()`

List your conversion jobs with optional filtering.

**Parameters:**
- `limit` (int, optional): Number of jobs to return (default: 50, max: 100)
- `offset` (int, optional): Offset for pagination (default: 0)
- `status` (str, optional): Filter by status ('completed', 'failed', 'processing', etc.)

**Returns:** list[dict]

**Example:**

```python
jobs = client.list_jobs(limit=10, status='completed')

print(jobs)
# [
#   {
#     'id': 'job-123',
#     'status': 'completed',
#     'original_filename': 'photo.png',
#     'source_format': 'png',
#     'target_format': 'jpg',
#     'processing_time_ms': 1200,
#     'created_at': '2025-01-20T10:30:00Z'
#   },
#   ...
# ]
```

### `get_job()`

Get details for a specific conversion job.

**Parameters:**
- `job_id` (str, required): The job ID

**Returns:** dict

**Example:**

```python
job = client.get_job('job-123')

print(job)
# {
#   'id': 'job-123',
#   'status': 'completed',
#   'original_filename': 'photo.png',
#   'download_url': 'https://...',
#   ...
# }
```

## Events

The client supports event callbacks for tracking conversion progress:

### Event: `start`

Emitted when conversion starts.

```python
def on_start(data):
    print(f"Starting: {data['file_name']}")
    print(f"Converting {data['source_format']} to {data['target_format']}")

client.on('start', on_start)
```

### Event: `progress`

Emitted at each step of the conversion process.

```python
def on_progress(data):
    print(f"Step: {data['step']}")
    print(f"Message: {data['message']}")
    # data['step'] can be:
    # - 'requesting-upload-url'
    # - 'uploading'
    # - 'confirming'
    # - 'converting'
    # - 'downloading'

client.on('progress', on_progress)
```

### Event: `status`

Emitted during polling for job completion.

```python
def on_status(data):
    print(f"Status: {data['status']}")
    print(f"Attempt: {data['attempt']}/{data['max_attempts']}")

client.on('status', on_status)
```

### Event: `complete`

Emitted when conversion completes successfully.

```python
def on_complete(result):
    print('Conversion complete!')
    print(f"Output: {result['output_path']}")
    print(f"Size: {result['file_size']} bytes")
    print(f"Time: {result['processing_time']} ms")

client.on('complete', on_complete)
```

### Event: `error`

Emitted when an error occurs.

```python
def on_error(data):
    print(f"Conversion failed: {data['error']}")

client.on('error', on_error)
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

The SDK supports advanced conversion options through the `conversion_metadata` parameter. This allows you to control aspect ratio, quality, resize dimensions, and more.

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

```python
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'aspect_ratio': '16:9',
        'crop_strategy': 'crop-center'
    }
)
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

```python
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='webp',
    conversion_metadata={
        'quality': 90
    }
)
```

### ICO Format Options

Create Windows icons with specific pixel sizes.

**Available Sizes:** 16, 32, 48, 64, 128, 256

The image will be automatically cropped to square using the selected crop strategy.

**Example:**

```python
result = client.convert_file(
    input_path='./logo.png',
    target_format='ico',
    conversion_metadata={
        'icon_size': 64,
        'crop_strategy': 'crop-center'
    }
)
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

```python
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'resize_width': 800  # Height will be calculated automatically
    }
)
```

**Example - Resize by height:**

```python
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'resize_height': 600  # Width will be calculated automatically
    }
)
```

**Example - Resize to exact dimensions:**

```python
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'resize_width': 1920,
        'resize_height': 1080  # May distort if original aspect ratio differs
    }
)
```

**Example - Combine resize with aspect ratio:**

```python
# Create a 500x500 square thumbnail with center crop
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'aspect_ratio': '1:1',
        'crop_strategy': 'crop-center',
        'resize_width': 500,
        'quality': 90
    }
)
```

**Resize Guidelines:**
- Use width/height resize for responsive images
- Combine with aspect ratio for precise control
- Quality parameter affects lossy formats (JPG, WebP, AVIF)
- LANCZOS resampling ensures high-quality results

## PDF Thumbnails

Generate JPG preview images from PDF documents. The thumbnail is rendered from the first page of the PDF.

### Basic PDF Thumbnail

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

# Convert PDF first page to JPG thumbnail
result = client.convert_file(
    input_path='./document.pdf',
    target_format='thumbnail',
    output_path='./preview.jpg',
    conversion_metadata={
        'thumbnail_width': 800  # Width in pixels (50-2000)
    }
)

print(f"Thumbnail saved: {result['output_path']}")
print(f"Size: {result['file_size']} bytes")
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

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

# Capture only the top half of the PDF page
result = client.convert_file(
    input_path='./document.pdf',
    target_format='thumbnail',
    output_path='./header_preview.jpg',
    conversion_metadata={
        'thumbnail_width': 600,
        'thumbnail_crop': 'half'  # Only top 50% of page
    }
)

print(f"Header thumbnail: {result['output_path']}")
```

### Thumbnail with Progress Events

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

# Set up progress callbacks
client.on('progress', lambda d: print(f"Step: {d['step']}"))
client.on('complete', lambda d: print(f"Done! Job: {d['job_id']}"))
client.on('error', lambda d: print(f"Error: {d['error']}"))

# Convert with progress tracking
result = client.convert_file(
    input_path='./report.pdf',
    target_format='thumbnail',
    conversion_metadata={
        'thumbnail_width': 400,
        'thumbnail_crop': 'third'  # Just the header area
    }
)
```

### Batch PDF Thumbnails

```python
from pathlib import Path
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

# Generate thumbnails for all PDFs in a directory
pdf_dir = Path('./documents')
output_dir = Path('./thumbnails')
output_dir.mkdir(exist_ok=True)

for pdf_file in pdf_dir.glob('*.pdf'):
    output_path = output_dir / f"{pdf_file.stem}.jpg"

    result = client.convert_file(
        input_path=str(pdf_file),
        target_format='thumbnail',
        output_path=str(output_path),
        conversion_metadata={
            'thumbnail_width': 300,
            'thumbnail_crop': 'half'
        }
    )
    print(f"Created: {output_path}")
```

### Thumbnail Notes

- Output format is always **JPEG** (quality 90)
- Only the **first page** of the PDF is rendered
- Aspect ratio is **preserved automatically**
- Maximum file size: **20 MB**
- Supported input: PDF files only

## Examples

### Basic Conversion

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

result = client.convert_file(
    input_path='./input.png',
    target_format='jpg'
)

print(f"Done! {result['output_path']}")
```

### With Progress Events

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

def on_progress(data):
    print(f"[{data['step']}] {data['message']}")

def on_complete(result):
    print('✓ Conversion completed!')
    print(f"Output: {result['output_path']}")

client.on('progress', on_progress)
client.on('complete', on_complete)

result = client.convert_file(
    input_path='./photo.png',
    target_format='webp'
)
```

### Batch Conversion

```python
from pathlib import Path
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

# Get all PNG files
images_dir = Path('./images')
png_files = list(images_dir.glob('*.png'))

# Convert all to WebP
for file_path in png_files:
    result = client.convert_file(
        input_path=str(file_path),
        target_format='webp'
    )
    print(f'Converted: {file_path}')
```

### Advanced Conversion with Metadata

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

# Convert to 16:9 aspect ratio with high quality
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='webp',
    conversion_metadata={
        'aspect_ratio': '16:9',
        'crop_strategy': 'crop-center',
        'quality': 90
    }
)

print(f"Converted to 16:9: {result['output_path']}")
```

### Error Handling

```python
from convertorio_sdk import ConvertorioClient, ConversionError

client = ConvertorioClient(api_key='your_api_key_here')

try:
    result = client.convert_file(
        input_path='./image.png',
        target_format='jpg'
    )
    print(f"Success: {result['output_path']}")
except FileNotFoundError as e:
    print('Input file does not exist')
except ConversionError as e:
    print(f'Conversion failed: {e}')

    # Handle specific errors
    if 'Insufficient' in str(e):
        print('Not enough points/credits')
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
| `ValueError: API key is required` | No API key provided | Provide your API key in the constructor |
| `FileNotFoundError` | File doesn't exist | Check the file path |
| `ConversionError: Invalid API key` | Wrong or expired API key | Verify your API key in account settings |
| `ConversionError: Insufficient credits` | Not enough points | Purchase more points or use free tier |
| `ConversionError: File size exceeds limit` | File too large | Maximum file size is 20 MB |
| `ConversionError: Conversion timeout` | Job took too long | Try again or contact support |

## Best Practices

1. **Reuse the client instance** - Don't create a new client for each conversion
2. **Use events for long conversions** - Monitor progress instead of just waiting
3. **Handle errors gracefully** - Always wrap conversions in try/except
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
