# Convertorio SDK for Go

Official Go SDK for the Convertorio API. Convert images between 20+ formats with just a few lines of code.

## Features

- ✅ Simple, idiomatic Go API
- ✅ Event-driven progress tracking
- ✅ Automatic file upload and download
- ✅ Support for 20+ image formats
- ✅ Full error handling
- ✅ Type-safe API with structs
- ✅ Batch conversion support

## Requirements

- Go >= 1.18

## Installation

```bash
go get github.com/SedeSoft/convertorio-sdk/libs/go
```

## Quick Start

```go
package main

import (
    "fmt"
    "log"

    convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

func main() {
    // Initialize the client
    client := convertorio.NewClient(convertorio.ClientConfig{
        APIKey: "your_api_key_here",
    })

    // Convert an image
    result, err := client.ConvertFile(convertorio.ConvertFileOptions{
        InputPath:    "./image.png",
        TargetFormat: "jpg",
    })

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Converted! %s\n", result.OutputPath)
}
```

## Configuration

### Creating a Client

```go
client := convertorio.NewClient(convertorio.ClientConfig{
    APIKey:       "your_api_key_here",           // Required: Your API key
    BaseURL:      "https://api.convertorio.com", // Optional: Custom API URL
    MaxAttempts:  120,                            // Optional: Max polling attempts
    PollInterval: 2 * time.Second,                // Optional: Polling interval
})
```

**Getting your API Key:**
1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

## API Reference

### `ConvertFile()`

Convert an image file from one format to another.

**Parameters:**

```go
type ConvertFileOptions struct {
    InputPath          string                 // Required: Path to input file
    TargetFormat       string                 // Required: Target format (jpg, png, webp, etc.)
    OutputPath         string                 // Optional: Custom output path
    ConversionMetadata map[string]interface{} // Optional: Advanced conversion options
}
```

**Returns:** `*ConvertFileResult`, `error`

**Example:**

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.png",
    TargetFormat: "webp",
    OutputPath:   "./converted/photo.webp",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Job ID: %s\n", result.JobID)
fmt.Printf("Output: %s\n", result.OutputPath)
fmt.Printf("Size: %d bytes\n", result.FileSize)
fmt.Printf("Processing time: %dms\n", result.ProcessingTime)
```

### `GetAccount()`

Get account information including points balance and usage.

**Returns:** `*Account`, `error`

**Example:**

```go
account, err := client.GetAccount()
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Email: %s\n", account.Email)
fmt.Printf("Plan: %s\n", account.Plan)
fmt.Printf("Points: %d\n", account.Points)
fmt.Printf("Daily conversions remaining: %d\n", account.DailyConversionsRemaining)
```

### `ListJobs()`

List your conversion jobs with optional filtering.

**Parameters:**
- `limit` (int): Number of jobs to return (max: 100)
- `offset` (int): Offset for pagination
- `status` (string): Filter by status ("completed", "failed", "processing", etc.)

**Returns:** `[]*Job`, `error`

**Example:**

```go
jobs, err := client.ListJobs(10, 0, "completed")
if err != nil {
    log.Fatal(err)
}

for _, job := range jobs {
    fmt.Printf("Job %s: %s -> %s (%s)\n",
        job.ID, job.SourceFormat, job.TargetFormat, job.Status)
}
```

### `GetJob()`

Get details for a specific conversion job.

**Parameters:**
- `jobID` (string): The job ID

**Returns:** `*Job`, `error`

**Example:**

```go
job, err := client.GetJob("job-123")
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Status: %s\n", job.Status)
fmt.Printf("Download URL: %s\n", job.DownloadURL)
```

## Events

The client supports event callbacks for tracking conversion progress:

### Event: `start`

Emitted when conversion starts.

```go
client.On("start", func(data map[string]interface{}) {
    fmt.Printf("Starting: %v\n", data["file_name"])
    fmt.Printf("Converting %v to %v\n", data["source_format"], data["target_format"])
})
```

### Event: `progress`

Emitted at each step of the conversion process.

```go
client.On("progress", func(data map[string]interface{}) {
    fmt.Printf("Step: %v\n", data["step"])
    fmt.Printf("Message: %v\n", data["message"])
    // Possible steps:
    // - "requesting-upload-url"
    // - "uploading"
    // - "confirming"
    // - "converting"
    // - "downloading"
})
```

### Event: `status`

Emitted during polling for job completion.

```go
client.On("status", func(data map[string]interface{}) {
    fmt.Printf("Status: %v\n", data["status"])
    fmt.Printf("Attempt: %v/%v\n", data["attempt"], data["max_attempts"])
})
```

### Event: `complete`

Emitted when conversion completes successfully.

```go
client.On("complete", func(data map[string]interface{}) {
    fmt.Println("Conversion complete!")
    fmt.Printf("Output: %v\n", data["output_path"])
    fmt.Printf("Size: %v bytes\n", data["file_size"])
    fmt.Printf("Time: %vms\n", data["processing_time"])
})
```

### Event: `error`

Emitted when an error occurs.

```go
client.On("error", func(data map[string]interface{}) {
    fmt.Printf("Conversion failed: %v\n", data["error"])
})
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

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./invoice.jpg",
    TargetFormat: "ocr",
    OutputPath:   "./invoice.json",
    ConversionMetadata: map[string]interface{}{
        "ocr_format":       "json",
        "ocr_instructions": "Extract invoice items and total",
    },
})
if err != nil {
    log.Fatal(err)
}

fmt.Printf("Tokens used: %d\n", result.TokensUsed)
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

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "os"

    "github.com/convertorio/convertorio-go"
)

func main() {
    client := convertorio.NewClient("your_api_key_here")

    // Extract text as JSON with custom instructions
    result, err := client.ConvertFile(convertorio.ConvertFileOptions{
        InputPath:    "./receipt.jpg",
        TargetFormat: "ocr",
        OutputPath:   "./receipt.json",
        ConversionMetadata: map[string]interface{}{
            "ocr_format":       "json",
            "ocr_instructions": "Extract merchant name, date, items with prices, and total amount",
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("OCR completed!")
    fmt.Printf("Tokens used: %d\n", result.TokensUsed)
    fmt.Printf("Output saved to: %s\n", result.OutputPath)

    // Read the extracted text
    data, _ := os.ReadFile("./receipt.json")
    var extractedData map[string]interface{}
    json.Unmarshal(data, &extractedData)
    fmt.Printf("%+v\n", extractedData)
}
```

## Advanced Conversion Options

The SDK supports advanced conversion options through the `ConversionMetadata` parameter. This allows you to control aspect ratio, quality, resize dimensions, and more.

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

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "jpg",
    ConversionMetadata: map[string]interface{}{
        "aspect_ratio":  "16:9",
        "crop_strategy": "crop-center",
    },
})
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

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "webp",
    ConversionMetadata: map[string]interface{}{
        "quality": 90,
    },
})
```

### ICO Format Options

Create Windows icons with specific pixel sizes.

**Available Sizes:** 16, 32, 48, 64, 128, 256

The image will be automatically cropped to square using the selected crop strategy.

**Example:**

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./logo.png",
    TargetFormat: "ico",
    ConversionMetadata: map[string]interface{}{
        "icon_size":     32,
        "crop_strategy": "crop-center",
    },
})
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

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "jpg",
    ConversionMetadata: map[string]interface{}{
        "resize_width": 800, // Height will be calculated automatically
    },
})
```

**Example - Resize by height:**

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "jpg",
    ConversionMetadata: map[string]interface{}{
        "resize_height": 600, // Width will be calculated automatically
    },
})
```

**Example - Resize to exact dimensions:**

```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "jpg",
    ConversionMetadata: map[string]interface{}{
        "resize_width":  1920,
        "resize_height": 1080, // May distort if original aspect ratio differs
    },
})
```

**Example - Combine resize with aspect ratio:**

```go
// Create a 500x500 square thumbnail with center crop
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "jpg",
    ConversionMetadata: map[string]interface{}{
        "aspect_ratio":  "1:1",
        "crop_strategy": "crop-center",
        "resize_width":  500,
        "quality":       90,
    },
})
```

## Examples

### Basic Conversion

```go
package main

import (
    "fmt"
    "log"

    convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

func main() {
    client := convertorio.NewClient(convertorio.ClientConfig{
        APIKey: "your_api_key_here",
    })

    result, err := client.ConvertFile(convertorio.ConvertFileOptions{
        InputPath:    "./input.png",
        TargetFormat: "jpg",
    })

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Done! %s\n", result.OutputPath)
}
```

### With Progress Events

```go
package main

import (
    "fmt"
    "log"

    convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

func main() {
    client := convertorio.NewClient(convertorio.ClientConfig{
        APIKey: "your_api_key_here",
    })

    client.On("progress", func(data map[string]interface{}) {
        fmt.Printf("[%v] %v\n", data["step"], data["message"])
    })

    client.On("complete", func(data map[string]interface{}) {
        fmt.Printf("✓ Conversion completed!\n")
        fmt.Printf("Output: %v\n", data["output_path"])
    })

    result, err := client.ConvertFile(convertorio.ConvertFileOptions{
        InputPath:    "./photo.png",
        TargetFormat: "webp",
    })

    if err != nil {
        log.Fatal(err)
    }
}
```

### Batch Conversion

```go
package main

import (
    "fmt"
    "log"
    "path/filepath"

    convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

func main() {
    client := convertorio.NewClient(convertorio.ClientConfig{
        APIKey: "your_api_key_here",
    })

    // Get all PNG files
    files, err := filepath.Glob("./images/*.png")
    if err != nil {
        log.Fatal(err)
    }

    // Convert all to WebP
    for i, file := range files {
        fmt.Printf("Converting %d/%d: %s\n", i+1, len(files), filepath.Base(file))

        result, err := client.ConvertFile(convertorio.ConvertFileOptions{
            InputPath:    file,
            TargetFormat: "webp",
            ConversionMetadata: map[string]interface{}{
                "quality": 85,
            },
        })

        if err != nil {
            log.Printf("Error converting %s: %v\n", file, err)
            continue
        }

        fmt.Printf("  ✓ Saved to: %s\n", result.OutputPath)
    }

    fmt.Printf("\nConverted %d files\n", len(files))
}
```

### Advanced Conversion with Metadata

```go
package main

import (
    "fmt"
    "log"

    convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

func main() {
    client := convertorio.NewClient(convertorio.ClientConfig{
        APIKey: "your_api_key_here",
    })

    // Convert to 16:9 aspect ratio with high quality
    result, err := client.ConvertFile(convertorio.ConvertFileOptions{
        InputPath:    "./photo.jpg",
        TargetFormat: "webp",
        ConversionMetadata: map[string]interface{}{
            "aspect_ratio":  "16:9",
            "crop_strategy": "crop-center",
            "quality":       90,
        },
    })

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Converted to 16:9: %s\n", result.OutputPath)
}
```

### Error Handling

```go
package main

import (
    "fmt"
    "log"
    "strings"

    convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

func main() {
    client := convertorio.NewClient(convertorio.ClientConfig{
        APIKey: "your_api_key_here",
    })

    result, err := client.ConvertFile(convertorio.ConvertFileOptions{
        InputPath:    "./image.png",
        TargetFormat: "jpg",
    })

    if err != nil {
        fmt.Printf("Conversion failed: %v\n", err)

        // Handle specific errors
        if strings.Contains(err.Error(), "Insufficient") {
            fmt.Println("Not enough points/credits - please add more")
        } else if strings.Contains(err.Error(), "not found") {
            fmt.Println("Input file does not exist")
        }

        return
    }

    fmt.Printf("Success: %s\n", result.OutputPath)
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
| `API key is required` | No API key provided | Provide your API key in ClientConfig |\n| `Input file not found` | File doesn't exist | Check the file path |
| `HTTP request failed` | Wrong or expired API key | Verify your API key in account settings |
| `Insufficient credits` | Not enough points | Purchase more points or use free tier |
| `File size exceeds limit` | File too large | Maximum file size is 20 MB |
| `Conversion timeout` | Job took too long | Try again or contact support |

## Best Practices

1. **Reuse the client instance** - Don't create a new client for each conversion
2. **Use events for long conversions** - Monitor progress instead of just waiting
3. **Handle errors gracefully** - Always check for errors and handle them appropriately
4. **Respect rate limits** - Use batch processing with delays if converting many files
5. **Check file sizes** - Maximum file size is 20 MB
6. **Validate formats** - Check that the target format is supported

## Support

- **Documentation:** [https://convertorio.com/docs](https://convertorio.com/docs)
- **API Reference:** [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Support:** [support@convertorio.com](mailto:support@convertorio.com)
- **GitHub Issues:** [https://github.com/SedeSoft/convertorio-sdk/issues](https://github.com/SedeSoft/convertorio-sdk/issues)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
