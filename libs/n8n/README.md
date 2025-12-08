# n8n-nodes-convertorio

This is an n8n community node that integrates with [Convertorio](https://convertorio.com) - a powerful image conversion API supporting 20+ formats.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Convertorio](https://convertorio.com) is an API for converting images between formats, generating PDF thumbnails, and extracting text with AI-powered OCR.

## Features

- **Image Conversion**: Convert between JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL and more
- **PDF Thumbnails**: Generate high-quality JPG previews from PDF documents
- **AI-powered OCR**: Extract text from images using advanced AI technology
- **Resize & Crop**: Resize images with custom dimensions and aspect ratios
- **Quality Control**: Set compression quality for lossy formats

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Quick Install

1. Go to **Settings > Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-convertorio` and click **Install**

### Manual Installation

```bash
npm install n8n-nodes-convertorio
```

## Operations

### Convert Image

Convert images between formats with optional resize and quality settings.

**Supported formats:**
- **Input**: JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL, RAW (CR2, NEF, DNG, ARW), PSD
- **Output**: JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL

**Options:**
| Parameter | Description |
|-----------|-------------|
| Target Format | The format to convert the image to |
| Quality | Compression quality 1-100 (for JPG, WebP, AVIF, HEIC, JXL) |
| Width | Target width in pixels |
| Height | Target height in pixels |
| Aspect Ratio | Target aspect ratio (1:1, 4:3, 16:9, etc.) |
| Crop Strategy | How to handle images that don't match the target aspect ratio |

### PDF Thumbnail

Generate a JPG thumbnail from the first page of a PDF document.

**Options:**
| Parameter | Description |
|-----------|-------------|
| Thumbnail Width | Width in pixels (50-2000, default: 800) |
| Crop Mode | Portion of page to capture (full, half, third, quarter, two-thirds) |

### OCR (Extract Text)

Extract text from images using AI-powered optical character recognition.

**Options:**
| Parameter | Description |
|-----------|-------------|
| Output Format | Plain text (TXT) or structured JSON |

### Get Account Info

Retrieve your account information including points balance and usage statistics.

## Credentials

To use this node, you need a Convertorio API key:

1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key
4. Enter the API key in your n8n credentials

## Example Workflows

### Convert PNG to WebP

1. Add a **Read Binary File** node to load a PNG image
2. Add a **Convertorio** node with:
   - Operation: `Convert Image`
   - Target Format: `WebP`
   - Quality: `85`
3. Add a **Write Binary File** node to save the result

### Generate PDF Thumbnails

1. Add a **Read Binary File** node to load a PDF
2. Add a **Convertorio** node with:
   - Operation: `PDF Thumbnail`
   - Thumbnail Width: `600`
   - Crop Mode: `half` (capture top 50% of page)
3. Add a **Write Binary File** node to save the thumbnail

### Extract Text from Image

1. Add a **Read Binary File** node to load an image
2. Add a **Convertorio** node with:
   - Operation: `OCR (Extract Text)`
   - Output Format: `Plain Text`
3. The extracted text is available in `$json.text`

## Pricing

Convertorio uses a points-based pricing system:

| Action | Points |
|--------|--------|
| Image Conversion | 1-3 points |
| PDF Thumbnail | 2 points |
| OCR | 5 points |

New accounts receive free points to get started. Additional points can be purchased at [convertorio.com/billing](https://convertorio.com/billing).

## Resources

* [Convertorio Website](https://convertorio.com)
* [Convertorio API Documentation](https://convertorio.com/docs)
* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
