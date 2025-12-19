# Convertorio SDK for n8n

Official n8n community node for [Convertorio](https://convertorio.com) - Convert images between 20+ formats, generate PDF thumbnails, and extract text with AI-powered OCR.

## Features

- **Image Conversion**: Convert between JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL
- **PDF Thumbnails**: Generate high-quality JPG previews from PDF documents
- **PDF to Images**: Convert all PDF pages to JPG images (one per page)
- **AI-powered OCR**: Extract text from images using advanced AI technology
- **Resize & Crop**: Resize images with custom dimensions and aspect ratios
- **Quality Control**: Set compression quality for lossy formats

## Installation

### Via n8n UI

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-convertorio` and click **Install**

### Via npm

```bash
npm install n8n-nodes-convertorio
```

## Setup

### Get an API Key

1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to [Account Settings](https://convertorio.com/account)
3. Generate an API key
4. In n8n, add new credentials of type "Convertorio API"
5. Enter your API key

## Operations

### Convert Image

Convert images between formats with optional resize and quality settings.

**Input:**
- Binary data containing the source image

**Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| Target Format | Output format (JPG, PNG, WebP, AVIF, etc.) | webp |
| Quality | Compression quality 1-100 (for lossy formats) | 90 |
| Width | Target width in pixels | - |
| Height | Target height in pixels | - |
| Aspect Ratio | Target aspect ratio | original |
| Crop Strategy | How to handle aspect ratio mismatch | crop-center |

**Supported Input Formats:**
- Common: JPG, PNG, WebP, GIF, BMP, TIFF
- Modern: AVIF, HEIC, JXL
- Professional: PSD, RAW (CR2, NEF, DNG, ARW)

**Supported Output Formats:**
- JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL

### PDF Thumbnail

Generate a JPG thumbnail from the first page of a PDF document.

**Input:**
- Binary data containing a PDF file

**Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| Thumbnail Width | Width in pixels (50-2000) | 800 |
| Crop Mode | Portion of page to capture | full |

**Crop Modes:**
| Value | Description |
|-------|-------------|
| full | Complete page (100%) |
| half | Top half (50%) |
| third | Top third (33%) |
| quarter | Top quarter (25%) |
| two-thirds | Top two-thirds (66%) |

### PDF to Images

Convert all pages of a PDF document to JPG images. Each page becomes a separate output item with its own binary data.

**Input:**
- Binary data containing a PDF file

**Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| Image Width | Width of each image in pixels (50-4000) | 1200 |
| Image Quality | JPEG quality 1-100 | 90 |
| DPI | Rendering DPI (72-300) | 150 |

**Output:**
Returns multiple items, one per page, each with:
```json
{
  "success": true,
  "jobId": "abc123",
  "pageNumber": 1,
  "totalPages": 5,
  "width": 1200,
  "height": 1697,
  "fileSize": 245620
}
```

Each item also includes binary data with the JPG image.

### OCR (Extract Text)

Extract text from images using AI-powered optical character recognition.

**Input:**
- Binary data containing an image

**Parameters:**
| Parameter | Description | Default |
|-----------|-------------|---------|
| Output Format | TXT (plain text) or JSON (structured) | txt |

**Output:**
```json
{
  "success": true,
  "jobId": "abc123",
  "text": "Extracted text content..."
}
```

### Get Account Info

Retrieve account information including points balance.

**Output:**
```json
{
  "success": true,
  "account": {
    "email": "user@example.com",
    "pointsBalance": 1000,
    "totalConversions": 150
  }
}
```

## Example Workflows

### Convert PNG to WebP

```
[Read Binary File] → [Convertorio: Convert Image] → [Write Binary File]
                           ↓
                     targetFormat: webp
                     quality: 85
```

### Generate PDF Thumbnails

```
[Read Binary File] → [Convertorio: PDF Thumbnail] → [Write Binary File]
                           ↓
                     thumbnailWidth: 600
                     thumbnailCrop: half
```

### Convert PDF to Images

```
[Read Binary File] → [Convertorio: PDF to Images] → [Loop Over Items] → [Write Binary File]
                           ↓                                                    ↓
                     imagesWidth: 1200                               Save each page as JPG
                     imagesQuality: 90
                     imagesDpi: 150
```

This operation returns multiple items (one per page), so you can use Loop Over Items to process each page individually.

### Batch Image Conversion

```
[List Folder] → [Loop Over Items] → [Read Binary File] → [Convertorio] → [Write Binary File]
                      ↓
                 For each image...
```

### OCR from HTTP Image

```
[HTTP Request] → [Convertorio: OCR] → [Set Variable]
     ↓                  ↓                    ↓
  image URL      outputFormat: txt      $json.text
```

## Pricing

Conversions consume points:

| Action | Points |
|--------|--------|
| Image Conversion | 1-3 |
| PDF Thumbnail | 2 |
| PDF to Images | 2 per page |
| OCR | 5 |

Purchase points at [convertorio.com/billing](https://convertorio.com/billing).

## Error Handling

The node supports n8n's "Continue On Fail" option. When enabled, errors return:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Resources

- [Convertorio Website](https://convertorio.com)
- [Convertorio API Docs](https://convertorio.com/docs)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [Report Issues](https://github.com/SedeSoft/n8n-nodes-convertorio/issues)

## License

MIT
