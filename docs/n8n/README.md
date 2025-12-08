# Convertorio for n8n

Official n8n community node for [Convertorio](https://convertorio.com) - The powerful image conversion API. Convert images between 20+ formats, generate PDF thumbnails, and extract text with AI-powered OCR directly in your n8n workflows.

[![npm version](https://badge.fury.io/js/n8n-nodes-convertorio.svg)](https://www.npmjs.com/package/n8n-nodes-convertorio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Official SDK Repository:** [https://github.com/SedeSoft/convertorio-sdk](https://github.com/SedeSoft/convertorio-sdk/tree/main/docs/n8n)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Operations](#operations)
  - [Convert Image](#convert-image)
  - [PDF Thumbnail](#pdf-thumbnail)
  - [OCR (Extract Text)](#ocr-extract-text)
  - [Get Account Info](#get-account-info)
- [Supported Formats](#supported-formats)
- [Advanced Options](#advanced-options)
- [Example Workflows](#example-workflows)
- [Pricing](#pricing)
- [Error Handling](#error-handling)
- [Resources](#resources)

---

## Features

| Feature | Description |
|---------|-------------|
| **Image Conversion** | Convert between 20+ formats: JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL, and more |
| **PDF Thumbnails** | Generate high-quality JPG previews from PDF documents (first page) |
| **AI-powered OCR** | Extract text from images using advanced AI technology with support for multiple languages |
| **Resize & Crop** | Resize images to specific dimensions with smart cropping options |
| **Aspect Ratio Control** | Transform images to specific aspect ratios (1:1, 16:9, 4:3, etc.) |
| **Quality Control** | Fine-tune compression quality for lossy formats (1-100) |
| **Batch Processing** | Process multiple files using n8n's loop functionality |

---

## Installation

### Via n8n Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-convertorio`
5. Click **Install**
6. Restart n8n if prompted

### Via npm (Self-hosted)

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-convertorio
```

Then restart your n8n instance.

### Via Docker

Add to your Dockerfile or docker-compose.yml:

```dockerfile
# In Dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-convertorio
```

```yaml
# In docker-compose.yml
environment:
  - N8N_COMMUNITY_PACKAGES=n8n-nodes-convertorio
```

---

## Setup

### Step 1: Get Your API Key

1. **Sign up** at [convertorio.com](https://convertorio.com) (free account includes 2 conversions/day)
2. Go to [Account Settings](https://convertorio.com/account)
3. Click **Generate API Key**
4. Copy your API key (starts with `cv_`)

### Step 2: Configure Credentials in n8n

1. In n8n, go to **Credentials** > **Add Credential**
2. Search for **"Convertorio API"**
3. Paste your API key
4. Click **Save**

Your credentials are now ready to use with any Convertorio node!

---

## Operations

### Convert Image

Convert images between formats with optional resize, crop, and quality settings.

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| **Target Format** | Select | Output format | `webp` |
| **Quality** | Number | Compression quality 1-100 (lossy formats only) | `90` |
| **Width** | Number | Target width in pixels (1-10000) | - |
| **Height** | Number | Target height in pixels (1-10000) | - |
| **Aspect Ratio** | Select | Target aspect ratio | `original` |
| **Crop Strategy** | Select | How to handle aspect ratio changes | `crop-center` |

#### Example: Convert PNG to WebP

```
Input: photo.png (binary data)
Settings:
  - Target Format: webp
  - Quality: 85

Output: photo.webp (optimized binary data)
```

#### Example: Create Instagram-ready Square Image

```
Input: landscape.jpg
Settings:
  - Target Format: jpg
  - Aspect Ratio: 1:1
  - Crop Strategy: crop-center
  - Width: 1080
  - Quality: 90

Output: 1080x1080 square image cropped from center
```

---

### PDF Thumbnail

Generate a high-quality JPG preview image from the first page of a PDF document. Perfect for document previews, galleries, and search results.

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| **Thumbnail Width** | Number | Width in pixels (50-2000) | `800` |
| **Thumbnail Height** | Number | Height in pixels (optional, auto-calculated) | - |
| **Crop Mode** | Select | Portion of page to capture | `full` |

#### Crop Modes Explained

| Mode | Captures | Use Case |
|------|----------|----------|
| `full` | 100% of page | Complete document preview |
| `half` | Top 50% | Header/title area focus |
| `third` | Top 33% | Just the header |
| `quarter` | Top 25% | Logo/letterhead only |
| `two-thirds` | Top 66% | Main content area |

#### Example: Document Preview Gallery

```
Input: report.pdf
Settings:
  - Thumbnail Width: 400
  - Crop Mode: half

Output: 400px wide JPG showing top half of first page
```

---

### OCR (Extract Text)

Extract text from images using AI-powered optical character recognition. Supports printed text, handwriting, receipts, invoices, labels, and more.

#### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| **Output Format** | Select | `txt` (plain text) or `json` (structured data) | `txt` |
| **Instructions** | String | Custom instructions to guide AI extraction | - |

#### Supported Image Types for OCR

- Scanned documents
- Photos of text
- Screenshots
- Receipts and invoices
- Handwritten notes
- Product labels
- Business cards
- Whiteboards

#### Example: Invoice Data Extraction

```
Input: invoice.jpg
Settings:
  - Output Format: json
  - Instructions: "Extract invoice number, date, vendor name, line items with prices, and total amount"

Output:
{
  "success": true,
  "jobId": "abc123",
  "text": "{\n  \"invoice_number\": \"INV-2024-001\",\n  \"date\": \"2024-01-15\",\n  \"vendor\": \"Acme Corp\",\n  \"items\": [...],\n  \"total\": \"$1,234.56\"\n}",
  "tokensUsed": 150
}
```

#### Example: Simple Text Extraction

```
Input: document_scan.png
Settings:
  - Output Format: txt

Output:
{
  "success": true,
  "text": "This is the extracted text from the image...",
  "tokensUsed": 50
}
```

---

### Get Account Info

Retrieve your account information including points balance and usage statistics.

#### Output Example

```json
{
  "success": true,
  "account": {
    "email": "user@example.com",
    "name": "John Doe",
    "pointsBalance": 1500,
    "totalConversions": 342,
    "dailyConversionsRemaining": 2
  }
}
```

Use this to:
- Monitor your points balance before batch operations
- Display remaining conversions in dashboards
- Set up alerts when points are low

---

## Supported Formats

### Input Formats

| Category | Formats |
|----------|---------|
| **Common** | JPG, JPEG, PNG, WebP, GIF, BMP, TIFF |
| **Modern** | AVIF, HEIC, HEIF, JXL (JPEG XL) |
| **Professional** | PSD (Photoshop) |
| **RAW Camera** | CR2 (Canon), NEF (Nikon), DNG, ARW (Sony), ORF (Olympus), RW2 (Panasonic) |
| **Vector** | SVG |
| **Documents** | PDF (for thumbnail generation) |

### Output Formats

| Format | Best For |
|--------|----------|
| **JPG** | Photos, web images, broad compatibility |
| **PNG** | Graphics with transparency, screenshots |
| **WebP** | Web optimization, smaller file sizes |
| **AVIF** | Best compression, modern browsers |
| **HEIC** | Apple devices, very efficient |
| **GIF** | Simple animations, legacy support |
| **BMP** | Uncompressed, Windows compatibility |
| **TIFF** | Print, archival, professional |
| **ICO** | Website favicons, Windows icons |
| **JXL** | Next-gen format, excellent quality |

---

## Advanced Options

### Aspect Ratio Options

| Value | Ratio | Common Use |
|-------|-------|------------|
| `original` | Keep original | Default behavior |
| `1:1` | Square | Instagram, profile pictures |
| `4:3` | Traditional | Photos, presentations |
| `16:9` | Widescreen | YouTube thumbnails, HD video |
| `9:16` | Vertical | TikTok, Instagram Stories, Reels |
| `21:9` | Ultrawide | Cinematic banners |
| `3:2` | Classic photo | DSLR standard |
| `2:3` | Portrait | Book covers, posters |

### Crop Strategies

| Strategy | Behavior |
|----------|----------|
| `fit` | Add padding (letterbox/pillarbox) to preserve entire image |
| `crop-center` | Crop from center (default) |
| `crop-top` | Crop from top edge |
| `crop-bottom` | Crop from bottom edge |
| `crop-left` | Crop from left edge |
| `crop-right` | Crop from right edge |

### Quality Guidelines

| Range | Quality Level | File Size | Use Case |
|-------|--------------|-----------|----------|
| 95-100 | Excellent | Largest | Archival, print |
| 85-94 | High | Large | Photography, portfolios |
| 70-84 | Good | Medium | General web use |
| 50-69 | Medium | Small | Thumbnails, previews |
| 1-49 | Low | Smallest | Placeholders |

---

## Example Workflows

### 1. Batch Image Optimization for Web

Automatically convert all images in a folder to optimized WebP format:

```
[Read Binary Files] → [Split In Batches] → [Convertorio: Convert] → [Write Binary File]
                                                    ↓
                                            targetFormat: webp
                                            quality: 80
                                            width: 1200
```

### 2. Generate Thumbnails from Uploaded PDFs

Create preview images when PDFs are uploaded to cloud storage:

```
[Dropbox Trigger] → [Convertorio: PDF Thumbnail] → [Upload to S3]
       ↓                       ↓
  on new PDF file       thumbnailWidth: 400
                        thumbnailCrop: third
```

### 3. OCR Document Processing Pipeline

Extract text from scanned documents and save to database:

```
[Webhook] → [Convertorio: OCR] → [Extract JSON] → [Insert to Database]
    ↓              ↓                    ↓
 image URL    outputFormat: json    invoice data
```

### 4. Social Media Image Resizer

Create multiple sizes for different social platforms:

```
[Read Image] → [Convertorio] → [Set Name: instagram.jpg]
                    ↓
             aspectRatio: 1:1
             width: 1080

           → [Convertorio] → [Set Name: twitter.jpg]
                    ↓
             aspectRatio: 16:9
             width: 1200

           → [Convertorio] → [Set Name: pinterest.jpg]
                    ↓
             aspectRatio: 2:3
             width: 1000
```

### 5. Low Balance Alert System

Monitor points and send notification when low:

```
[Schedule Trigger] → [Convertorio: Get Account] → [IF] → [Send Email]
      ↓                                             ↓
  every hour                              if pointsBalance < 100
```

### 6. Convert HEIC iPhone Photos

Convert iPhone photos (HEIC) to JPG for compatibility:

```
[Google Drive Trigger] → [IF file is HEIC] → [Convertorio: Convert] → [Upload JPG]
                                                      ↓
                                               targetFormat: jpg
                                               quality: 90
```

---

## Pricing

Convertorio uses a points-based system. Each operation consumes points based on complexity:

| Operation | Points Cost |
|-----------|-------------|
| Basic image conversion | 1 |
| Complex format conversion (HEIC, RAW, PSD) | 2-3 |
| PDF Thumbnail | 2 |
| OCR Text Extraction | 5+ (based on tokens) |

### Free Tier

- **2 free conversions per day** (no payment required)
- Perfect for testing and light usage

### Points Packages

| Package | Points | Bonus | Price |
|---------|--------|-------|-------|
| Starter | 500 | - | $5 |
| Basic | 1,200 | +20% | $10 |
| Pro | 3,000 | +50% | $20 |
| Business | 10,000 | +100% | $50 |
| Enterprise | 25,000 | +150% | $100 |

Purchase points at [convertorio.com/billing](https://convertorio.com/billing)

---

## Error Handling

### Continue On Fail

The node supports n8n's **"Continue On Fail"** option. When enabled, errors won't stop your workflow:

```json
{
  "success": false,
  "error": "File format not supported",
  "errorCode": "INVALID_FORMAT"
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid API key` | Wrong or expired key | Check credentials in n8n |
| `Insufficient credits` | No points remaining | Purchase more points |
| `File too large` | File exceeds 20MB | Reduce file size or split |
| `Unsupported format` | Format not supported | Check supported formats list |
| `Conversion timeout` | Processing took too long | Try with smaller file |

### Retry Logic

For production workflows, consider adding retry logic:

```
[Convertorio] → [IF success=false] → [Wait 5s] → [Retry Convertorio]
```

---

## Resources

### Official Links

- **Convertorio Website:** [https://convertorio.com](https://convertorio.com)
- **API Documentation:** [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- **SDK Repository:** [https://github.com/SedeSoft/convertorio-sdk](https://github.com/SedeSoft/convertorio-sdk)
- **n8n Documentation:** [https://github.com/SedeSoft/convertorio-sdk/tree/main/docs/n8n](https://github.com/SedeSoft/convertorio-sdk/tree/main/docs/n8n)

### Support

- **Issues & Bug Reports:** [GitHub Issues](https://github.com/SedeSoft/n8n-nodes-convertorio/issues)
- **Email Support:** [support@convertorio.com](mailto:support@convertorio.com)
- **n8n Community:** [n8n Community Forum](https://community.n8n.io/)

### Related SDKs

Convertorio is available for multiple platforms:

| Platform | Package |
|----------|---------|
| Node.js | `npm install convertorio-sdk` |
| Python | `pip install convertorio-sdk` |
| PHP | `composer require convertorio/sdk` |
| Go | `go get github.com/SedeSoft/convertorio-sdk` |
| Java | Maven Central: `com.sedesoft:convertorio-sdk` |
| Ruby | `gem install convertorio-sdk` |
| .NET | NuGet: `Convertorio.SDK` |

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Changelog

### v1.0.0

- Initial release
- Image conversion between 20+ formats
- PDF thumbnail generation
- AI-powered OCR
- Account info retrieval

---

Made with love by [SedeSoft](https://sedesoft.com) for the n8n community.
