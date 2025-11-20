# Convertorio SDK - Python Test Files

This directory contains test files for the Convertorio Python SDK with different levels of complexity.

## Test Files Overview

### 1. `simple-test.py` - Basic Conversion
**Purpose:** Test basic conversion without advanced options.

**Usage:**
```bash
python simple-test.py
```

**Features:**
- Basic PNG to JPG conversion
- No advanced metadata
- Simple error handling

---

### 2. `test-with-metadata.py` - Complete Metadata Test Suite
**Purpose:** Comprehensive test suite covering all advanced conversion options.

**Usage:**
```bash
python test-with-metadata.py
```

**Features:**
- 6 different conversion tests
- Event listeners for progress tracking
- Multiple aspect ratios (16:9, 1:1, 9:16)
- Different crop strategies (crop-center, fit)
- Quality control tests
- ICO favicon creation
- Detailed statistics and summary

**Tests Included:**
1. **16:9 Widescreen** - Center crop, quality 90%
2. **1:1 Square** - For Instagram, WebP format
3. **ICO Favicon** - 32x32 icon size
4. **High Quality** - Quality 95%, JPG format
5. **9:16 Vertical** - For TikTok/Stories
6. **Fit Strategy** - 16:9 with padding (no crop)

**Output Files:**
- `output-16x9.jpg` - Widescreen format
- `output-square.webp` - Square format
- `favicon-32x32.ico` - Favicon icon
- `output-high-quality.jpg` - High quality JPG
- `output-vertical.jpg` - Vertical format
- `output-fit.png` - Fitted with padding

---

### 3. `test-resize.py` - Resize Feature Test Suite ⭐ NEW (v1.2.0)
**Purpose:** Test suite specifically for resize functionality.

**Usage:**
```bash
python test-resize.py
```

**Features:**
- 6 resize tests demonstrating different strategies
- Width-only resize (maintains aspect ratio)
- Height-only resize (maintains aspect ratio)
- Exact dimensions resize
- Combining resize with aspect ratio changes
- Thumbnail generation
- HD resolution output

**Tests Included:**
1. **Resize by Width** - 800px width, auto height
2. **Resize by Height** - 600px height, auto width
3. **Exact Dimensions** - 1920x1080 (16:9 HD)
4. **Square + Resize** - 1:1 aspect ratio, 500px width
5. **Thumbnail** - 150x150 small image
6. **HD Quality** - 1280px width with 95% quality

**Output Files:**
- `output-resize-width-800.jpg` - Width-based resize
- `output-resize-height-600.jpg` - Height-based resize
- `output-resize-1920x1080.jpg` - Exact HD dimensions
- `output-square-500.jpg` - Square 500x500
- `output-thumbnail-150.jpg` - Thumbnail 150x150
- `output-hd-1280.jpg` - HD with high quality

---

## Requirements

1. **Install SDK:**
   ```bash
   pip install convertorio-sdk
   ```

2. **Test Image:**
   - Use the included `test-image.png`
   - Or replace with your own test image

3. **API Key:**
   - Get your API key from https://convertorio.com/account
   - The current key in the files is for testing purposes

---

## Advanced Conversion Options Reference

### Aspect Ratios
- `original` - Keep original aspect ratio (default)
- `1:1` - Square (Instagram, profile photos)
- `4:3` - Standard photo/video
- `16:9` - Widescreen video, HD
- `9:16` - Vertical/portrait video (TikTok, Stories)
- `21:9` - Ultra-widescreen
- Custom: `16:10`, `3:2`, etc.

### Crop Strategies
- `fit` - Add padding (letterbox/pillarbox)
- `crop-center` - Crop from center
- `crop-top` - Crop aligned to top
- `crop-bottom` - Crop aligned to bottom
- `crop-left` - Crop aligned to left
- `crop-right` - Crop aligned to right

### Quality Control
- Range: 1-100
- Default: 85
- Applies to: JPG, WebP, AVIF, HEIC/HEIF
- Guidelines:
  - 90-100: Excellent quality, large files
  - 80-90: High quality, good balance (recommended)
  - 70-80: Good quality, smaller files
  - 50-70: Medium quality, small files

### ICO Format Options
- Available sizes: 16, 32, 48, 64, 128, 256 pixels
- Always results in square images
- Use `crop_strategy` to control how the image is made square

### Resize Control
- `resize_width` - Target width in pixels (1-10000)
- `resize_height` - Target height in pixels (1-10000)
- Specify only width or height to maintain aspect ratio
- Specify both to force exact dimensions (may distort)
- Can be combined with aspect ratio and crop strategy

---

## Example Usage

### Basic Conversion with Metadata
```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

result = client.convert_file(
    input_path='./photo.jpg',
    target_format='webp',
    conversion_metadata={
        'aspect_ratio': '16:9',
        'crop_strategy': 'crop-center',
        'quality': 85
    }
)
```

### Creating Favicons
```python
result = client.convert_file(
    input_path='./logo.png',
    target_format='ico',
    conversion_metadata={
        'icon_size': 32,
        'crop_strategy': 'crop-center'
    }
)
```

### Resizing Images
```python
# Resize by width (maintains aspect ratio)
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'resize_width': 800
    }
)

# Resize by height (maintains aspect ratio)
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'resize_height': 600
    }
)

# Resize to exact dimensions (may distort)
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='jpg',
    conversion_metadata={
        'resize_width': 800,
        'resize_height': 600
    }
)
```

---

## Troubleshooting

### Error: "Input file not found"
- Make sure `test-image.png` exists in this directory
- Or update the `input_path` to point to your test image

### Error: "API key is required"
- Get your API key from https://convertorio.com/account
- Update the `API_KEY` constant in the test files

### Error: "Failed to get upload URL"
- Check your internet connection
- Verify your API key is valid
- Check if you have enough points in your account

---

## SDK Version

These tests are designed for **Convertorio SDK v1.2.0+** which includes support for advanced conversion metadata including resize control.

For more information:
- SDK Documentation: https://github.com/SedeSoft/convertorio-sdk
- API Documentation: https://convertorio.com/docs
- Support: support@convertorio.com
