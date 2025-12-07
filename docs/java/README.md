# Convertorio SDK for Java

Official Java SDK for [Convertorio](https://convertorio.com) - Simple and powerful image conversion API.

[![Maven Central](https://img.shields.io/maven-central/v/com.sedesoft/convertorio-sdk.svg)](https://search.maven.org/artifact/com.sedesoft/convertorio-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **Simple API** - Convert images with just a few lines of code
- ✅ **Event Callbacks** - Track conversion progress with event listeners
- ✅ **Type Safe** - Fully typed API with builder patterns
- ✅ **No External Image Libraries** - Uses OkHttp and Gson only
- ✅ **Automatic File Handling** - Upload and download handled automatically
- ✅ **Supports Java 11+** - Compatible with modern Java versions
- ✅ **PDF to Thumbnail** - Generate JPG previews from PDF documents
- ✅ **AI-powered OCR** - Extract text from images using AI

## Supported Formats

Convert between these formats:
- **Raster**: JPG, PNG, WebP, AVIF, HEIC, BMP, TIFF, GIF
- **Icons**: ICO (with custom sizes)
- **Raw**: DNG, CR2, NEF, ARW

## Installation

### Maven

Add to your `pom.xml`:

```xml
<dependency>
    <groupId>com.sedesoft</groupId>
    <artifactId>convertorio-sdk</artifactId>
    <version>1.2.0</version>
</dependency>
```

### Gradle

Add to your `build.gradle`:

```gradle
implementation 'com.sedesoft:convertorio-sdk:1.2.0'
```

## Quick Start

```java
import com.sedesoft.convertorio.*;

public class Example {
    public static void main(String[] args) {
        try {
            // Initialize client
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

            // Convert image
            ConversionResult result = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./image.png")
                    .targetFormat("jpg")
                    .build()
            );

            System.out.println("Converted! " + result.getOutputPath());
        } catch (ConvertorioException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
```

## Usage Examples

### Basic Conversion

```java
ConvertorioClient client = new ConvertorioClient(
    ClientConfig.builder()
        .apiKey("your_api_key_here")
        .build()
);

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./photo.png")
        .targetFormat("webp")
        .outputPath("./photo.webp")
        .build()
);

System.out.println("Job ID: " + result.getJobId());
System.out.println("Processing time: " + result.getProcessingTime() + "ms");
System.out.println("File size: " + result.getFileSize() + " bytes");
```

### With Event Listeners

Track conversion progress with event callbacks:

```java
ConvertorioClient client = new ConvertorioClient(
    ClientConfig.builder()
        .apiKey("your_api_key_here")
        .build()
);

// Register event listeners
client.on("start", data -> {
    System.out.println("Starting conversion...");
    System.out.println("Source: " + data.getString("sourceFormat"));
    System.out.println("Target: " + data.getString("targetFormat"));
});

client.on("progress", data -> {
    System.out.println("Step: " + data.getString("step"));
    System.out.println("Message: " + data.getString("message"));
});

client.on("status", data -> {
    System.out.println("Job status: " + data.getString("status"));
    System.out.println("Attempt: " + data.getInt("attempt") +
                       "/" + data.getInt("maxAttempts"));
});

client.on("complete", data -> {
    System.out.println("Conversion completed!");
    System.out.println("Output: " + data.getString("outputPath"));
});

client.on("error", data -> {
    System.err.println("Conversion failed: " + data.getString("error"));
});

// Perform conversion
ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./image.jpg")
        .targetFormat("avif")
        .build()
);
```

### Advanced Conversion Options

#### Aspect Ratio & Crop Strategy

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Object> metadata = new HashMap<>();
metadata.put("aspect_ratio", "16:9");
metadata.put("crop_strategy", "crop-center");

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./image.jpg")
        .targetFormat("jpg")
        .conversionMetadata(metadata)
        .build()
);
```

Available aspect ratios:
- `original` - Keep original aspect ratio (default)
- `1:1` - Square (Instagram posts)
- `4:3` - Standard photo
- `16:9` - Widescreen
- `9:16` - Vertical (Stories/Reels)
- `21:9` - Ultra-wide

Crop strategies:
- `fit` - Fit entire image (may add padding)
- `crop-center` - Crop from center
- `crop-top` - Crop from top
- `crop-bottom` - Crop from bottom
- `crop-left` - Crop from left
- `crop-right` - Crop from right

#### Quality Control

```java
Map<String, Object> metadata = new HashMap<>();
metadata.put("quality", 90); // 1-100

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./image.png")
        .targetFormat("jpg")
        .conversionMetadata(metadata)
        .build()
);
```

Quality settings:
- **JPG**: 1-100 (recommended: 85-95)
- **WebP**: 1-100 (recommended: 80-90)
- **AVIF**: 1-100 (recommended: 75-85)

#### ICO Generation

```java
Map<String, Object> metadata = new HashMap<>();
metadata.put("icon_size", 32); // 16, 32, 48, 64, 128, 256

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./logo.png")
        .targetFormat("ico")
        .conversionMetadata(metadata)
        .build()
);
```

#### Resize Images

```java
Map<String, Object> metadata = new HashMap<>();
metadata.put("resize_width", 1920);
metadata.put("resize_height", 1080);

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./image.jpg")
        .targetFormat("jpg")
        .conversionMetadata(metadata)
        .build()
);
```

Resize options:
- `resize_width` - Target width in pixels (1-10000)
- `resize_height` - Target height in pixels (1-10000)
- Specify both to force exact dimensions
- Specify one to maintain aspect ratio

#### PDF Thumbnails

Generate JPG preview images from PDF documents. The thumbnail is rendered from the first page of the PDF.

**Basic PDF Thumbnail:**

```java
import com.sedesoft.convertorio.*;
import java.util.HashMap;
import java.util.Map;

public class PDFThumbnailExample {
    public static void main(String[] args) {
        try {
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

            // Configure thumbnail options
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("thumbnail_width", 800);  // Width in pixels (50-2000)

            // Convert PDF first page to JPG thumbnail
            ConversionResult result = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./document.pdf")
                    .targetFormat("thumbnail")
                    .outputPath("./preview.jpg")
                    .conversionMetadata(metadata)
                    .build()
            );

            System.out.println("Thumbnail saved: " + result.getOutputPath());
            System.out.println("Size: " + result.getFileSize() + " bytes");

        } catch (ConvertorioException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
```

**Thumbnail Options:**

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `thumbnail_width` | int | 50-2000 | 800 | Width in pixels |
| `thumbnail_height` | int | 50-2000 | auto | Height (calculated automatically if not set) |
| `thumbnail_crop` | String | see below | full | Portion of page to capture |

**Crop Modes:**

Control which portion of the PDF page to capture (from the top):

| Value | Description |
|-------|-------------|
| `full` | Complete page - 100% (default) |
| `half` | Top half - 50% |
| `third` | Top third - 33% |
| `quarter` | Top quarter - 25% |
| `two-thirds` | Top two-thirds - 66% |

**Thumbnail with Crop:**

```java
Map<String, Object> metadata = new HashMap<>();
metadata.put("thumbnail_width", 600);
metadata.put("thumbnail_crop", "half");  // Only top 50% of page

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./document.pdf")
        .targetFormat("thumbnail")
        .outputPath("./header_preview.jpg")
        .conversionMetadata(metadata)
        .build()
);

System.out.println("Header thumbnail: " + result.getOutputPath());
```

**Thumbnail with Progress Events:**

```java
ConvertorioClient client = new ConvertorioClient(
    ClientConfig.builder()
        .apiKey("your_api_key_here")
        .build()
);

// Set up progress callbacks
client.on("progress", data -> {
    System.out.println("Step: " + data.getString("step"));
});

client.on("complete", data -> {
    System.out.println("Done! Job: " + data.getString("jobId"));
});

client.on("error", data -> {
    System.err.println("Error: " + data.getString("error"));
});

// Convert with progress tracking
Map<String, Object> metadata = new HashMap<>();
metadata.put("thumbnail_width", 400);
metadata.put("thumbnail_crop", "third");  // Just the header area

ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./report.pdf")
        .targetFormat("thumbnail")
        .conversionMetadata(metadata)
        .build()
);
```

**Batch PDF Thumbnails:**

```java
import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class BatchThumbnails {
    public static void main(String[] args) {
        ConvertorioClient client = new ConvertorioClient(
            ClientConfig.builder()
                .apiKey("your_api_key_here")
                .build()
        );

        // Generate thumbnails for all PDFs in a directory
        File pdfDir = new File("./documents");
        File outputDir = new File("./thumbnails");
        outputDir.mkdirs();

        File[] pdfFiles = pdfDir.listFiles((dir, name) -> name.endsWith(".pdf"));

        if (pdfFiles != null) {
            for (File pdfFile : pdfFiles) {
                try {
                    String basename = pdfFile.getName().replace(".pdf", "");
                    String outputPath = outputDir.getPath() + "/" + basename + ".jpg";

                    Map<String, Object> metadata = new HashMap<>();
                    metadata.put("thumbnail_width", 300);
                    metadata.put("thumbnail_crop", "half");

                    ConversionResult result = client.convertFile(
                        ConversionOptions.builder()
                            .inputPath(pdfFile.getPath())
                            .targetFormat("thumbnail")
                            .outputPath(outputPath)
                            .conversionMetadata(metadata)
                            .build()
                    );

                    System.out.println("Created: " + result.getOutputPath());

                } catch (ConvertorioException e) {
                    System.err.println("Error converting " + pdfFile.getName() + ": " + e.getMessage());
                }
            }
        }
    }
}
```

**Thumbnail Notes:**

- Output format is always **JPEG** (quality 90)
- Only the **first page** of the PDF is rendered
- Aspect ratio is **preserved automatically**
- Maximum file size: **20 MB**
- Supported input: PDF files only

### Account Management

```java
// Get account information
Account account = client.getAccount();
System.out.println("Email: " + account.getEmail());
System.out.println("Points: " + account.getPointsBalance());
System.out.println("Total conversions: " + account.getTotalConversions());
```

### Job Management

```java
// Get specific job
Job job = client.getJob("job-id-here");
System.out.println("Status: " + job.getStatus());
System.out.println("Download URL: " + job.getDownloadUrl());

// List recent jobs
Job[] jobs = client.listJobs(10, 0, null);
for (Job j : jobs) {
    System.out.println("Job " + j.getId() + ": " + j.getStatus());
}

// List only completed jobs
Job[] completed = client.listJobs(10, 0, "completed");
```

## API Reference

### ConvertorioClient

Main client class for interacting with the Convertorio API.

#### Constructor

```java
ConvertorioClient(ClientConfig config)
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `convertFile` | `ConversionOptions` | `ConversionResult` | Convert an image file |
| `on` | `String event, Consumer<EventData> listener` | `ConvertorioClient` | Register event listener |
| `getAccount` | - | `Account` | Get account information |
| `listJobs` | `int limit, int offset, String status` | `Job[]` | List conversion jobs |
| `getJob` | `String jobId` | `Job` | Get job details |

### ClientConfig

Configuration for the Convertorio client.

```java
ClientConfig.builder()
    .apiKey("your_api_key_here")
    .baseUrl("https://api.convertorio.com")  // Optional
    .build()
```

### ConversionOptions

Options for file conversion.

```java
ConversionOptions.builder()
    .inputPath("./input.png")
    .targetFormat("jpg")
    .outputPath("./output.jpg")  // Optional
    .conversionMetadata(metadata)  // Optional
    .build()
```

### ConversionResult

Result of a conversion operation.

| Property | Type | Description |
|----------|------|-------------|
| `success` | `boolean` | Whether conversion succeeded |
| `jobId` | `String` | Job ID |
| `inputPath` | `String` | Input file path |
| `outputPath` | `String` | Output file path |
| `sourceFormat` | `String` | Source format |
| `targetFormat` | `String` | Target format |
| `fileSize` | `long` | Output file size in bytes |
| `processingTime` | `long` | Processing time in milliseconds |
| `downloadUrl` | `String` | Download URL (valid for 7 days) |

### Event Types

| Event | When Fired | Data |
|-------|------------|------|
| `start` | Conversion starts | `fileName`, `sourceFormat`, `targetFormat` |
| `progress` | During conversion | `step`, `message`, `jobId`, `status` |
| `status` | Job status check | `jobId`, `status`, `attempt`, `maxAttempts` |
| `complete` | Conversion completes | All `ConversionResult` fields |
| `error` | Conversion fails | `success`, `error`, `inputPath`, `targetFormat` |

## Error Handling

```java
try {
    ConversionResult result = client.convertFile(
        ConversionOptions.builder()
            .inputPath("./image.png")
            .targetFormat("jpg")
            .build()
    );
    System.out.println("Success!");
} catch (ConvertorioException e) {
    System.err.println("Conversion failed: " + e.getMessage());
    e.printStackTrace();
} catch (IllegalArgumentException e) {
    System.err.println("Invalid parameters: " + e.getMessage());
}
```

Common errors:
- `IllegalArgumentException` - Missing required parameters
- `ConvertorioException` - API errors, network issues, invalid API key

## Rate Limiting

The API implements rate limiting:
- **Free tier**: 5 conversions per day
- **Paid tiers**: Higher limits based on plan

Rate limit responses:
- Status: `429 Too Many Requests`
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## Best Practices

1. **Reuse Client Instance**: Create one client instance and reuse it
```java
// Good
ConvertorioClient client = new ConvertorioClient(config);
client.convertFile(options1);
client.convertFile(options2);

// Avoid
new ConvertorioClient(config).convertFile(options1);
new ConvertorioClient(config).convertFile(options2);
```

2. **Handle Exceptions**: Always catch `ConvertorioException`
```java
try {
    ConversionResult result = client.convertFile(options);
} catch (ConvertorioException e) {
    logger.error("Conversion failed", e);
}
```

3. **Use Event Listeners**: Monitor progress for long conversions
```java
client.on("progress", data ->
    logger.info("Progress: " + data.getString("step"))
);
```

4. **Secure API Keys**: Never commit API keys to version control
```java
// Use environment variables
String apiKey = System.getenv("CONVERTORIO_API_KEY");
```

5. **Validate Files**: Check file exists before conversion
```java
File inputFile = new File(inputPath);
if (!inputFile.exists()) {
    throw new FileNotFoundException("Input file not found");
}
```

## Requirements

- Java 11 or higher
- Maven or Gradle
- Internet connection

## Dependencies

- [OkHttp](https://square.github.io/okhttp/) - HTTP client
- [Gson](https://github.com/google/gson) - JSON parsing

## Support

- **Documentation**: [https://convertorio.com/docs](https://convertorio.com/docs)
- **API Reference**: [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Support Email**: [support@convertorio.com](mailto:support@convertorio.com)
- **GitHub Issues**: [https://github.com/SedeSoft/convertorio-sdk/issues](https://github.com/SedeSoft/convertorio-sdk/issues)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.
