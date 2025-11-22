# Convertorio SDK for .NET

[![NuGet](https://img.shields.io/nuget/v/Convertorio.SDK.svg)](https://www.nuget.org/packages/Convertorio.SDK/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official .NET SDK for [Convertorio](https://convertorio.com) - Convert images easily with a simple, async API.

## Features

- 🎯 Simple, intuitive async API
- 📦 Supports .NET Standard 2.0+ (compatible with .NET Core, .NET 5+, .NET Framework 4.6.1+)
- 🎨 Support for 20+ image formats (JPG, PNG, WebP, AVIF, HEIC, and more)
- ⚡ Event-driven progress tracking
- 🔄 Automatic file handling and downloads
- 🛡️ Type-safe with full IntelliSense support
- 📝 Comprehensive XML documentation
- ✅ Unit tested
- 🔌 Async/await support
- 💪 Built with modern C# features

## Installation

### Via NuGet Package Manager

```bash
Install-Package Convertorio.SDK
```

### Via .NET CLI

```bash
dotnet add package Convertorio.SDK
```

### Via Package Reference

Add to your `.csproj` file:

```xml
<ItemGroup>
  <PackageReference Include="Convertorio.SDK" Version="1.2.0" />
</ItemGroup>
```

## Quick Start

```csharp
using System;
using System.Threading.Tasks;
using Convertorio.SDK;

class Program
{
    static async Task Main(string[] args)
    {
        // Create client with your API key
        using (var client = new ConvertorioClient("your_api_key_here"))
        {
            // Convert an image
            var result = await client.ConvertFileAsync(new ConversionOptions
            {
                InputPath = "photo.png",
                TargetFormat = "jpg"
            });

            Console.WriteLine($"✅ Converted! Output: {result.OutputPath}");
            Console.WriteLine($"   Size: {result.FileSize / 1024} KB");
            Console.WriteLine($"   Time: {result.ProcessingTime}ms");
        }
    }
}
```

## Authentication

Get your API key from your [Convertorio account dashboard](https://convertorio.com/account).

```csharp
var client = new ConvertorioClient("your_api_key_here");
```

Or use a custom API endpoint:

```csharp
var client = new ConvertorioClient("your_api_key_here", "https://custom-api.example.com");
```

## Usage Examples

### Basic Conversion

```csharp
using (var client = new ConvertorioClient(apiKey))
{
    var result = await client.ConvertFileAsync(new ConversionOptions
    {
        InputPath = "image.png",
        TargetFormat = "jpg"
    });

    Console.WriteLine($"Output: {result.OutputPath}");
}
```

### Conversion with Events

Track conversion progress using events:

```csharp
using (var client = new ConvertorioClient(apiKey))
{
    // Subscribe to events
    client.ConversionStart += (sender, e) =>
    {
        Console.WriteLine($"🚀 Converting {e.FileName}");
        Console.WriteLine($"   {e.SourceFormat.ToUpper()} → {e.TargetFormat.ToUpper()}");
    };

    client.ConversionProgress += (sender, e) =>
    {
        Console.WriteLine($"⏳ {e.Step}: {e.Message}");
    };

    client.ConversionStatus += (sender, e) =>
    {
        Console.WriteLine($"📊 Status: {e.Status} (attempt {e.Attempt}/{e.MaxAttempts})");
    };

    client.ConversionComplete += (sender, e) =>
    {
        Console.WriteLine($"✅ Complete! File: {e.Result.OutputPath}");
    };

    client.ConversionError += (sender, e) =>
    {
        Console.WriteLine($"❌ Error: {e.Error}");
    };

    // Perform conversion
    var result = await client.ConvertFileAsync(new ConversionOptions
    {
        InputPath = "photo.heic",
        TargetFormat = "png"
    });
}
```

### Advanced Conversion Options

```csharp
var result = await client.ConvertFileAsync(new ConversionOptions
{
    InputPath = "photo.jpg",
    TargetFormat = "webp",
    OutputPath = "optimized-photo.webp",
    ConversionMetadata = new ConversionMetadata
    {
        AspectRatio = "16:9",
        CropStrategy = "crop-center",
        Quality = 85
    }
});
```

### Batch Conversion

```csharp
var files = Directory.GetFiles("./images", "*.png");

foreach (var file in files)
{
    try
    {
        var result = await client.ConvertFileAsync(new ConversionOptions
        {
            InputPath = file,
            TargetFormat = "webp"
        });

        Console.WriteLine($"✅ Converted: {Path.GetFileName(file)}");
    }
    catch (ConvertorioException ex)
    {
        Console.WriteLine($"❌ Failed: {ex.Message}");
    }
}
```

### Account Information

```csharp
var account = await client.GetAccountAsync();

Console.WriteLine($"Email: {account.Email}");
Console.WriteLine($"Points: {account.PointsBalance}");
Console.WriteLine($"Daily conversions: {account.DailyConversionsUsed}/{account.DailyConversionsLimit}");
Console.WriteLine($"Total conversions: {account.TotalConversions}");
```

### List Jobs

```csharp
var jobs = await client.ListJobsAsync(new ListJobsOptions
{
    Limit = 10,
    Offset = 0,
    Status = "completed"
});

foreach (var job in jobs)
{
    Console.WriteLine($"{job.SourceFormat} → {job.TargetFormat} ({job.Status})");
}
```

### Get Job Status

```csharp
var job = await client.GetJobAsync("job_id_here");

Console.WriteLine($"Status: {job.Status}");
Console.WriteLine($"Created: {job.CreatedAt}");

if (job.Status == "completed")
{
    Console.WriteLine($"Download URL: {job.DownloadUrl}");
    Console.WriteLine($"Processing time: {job.ProcessingTimeMs}ms");
}
```

## API Reference

### ConvertorioClient

#### Constructor

```csharp
ConvertorioClient(string apiKey, string baseUrl = "https://api.convertorio.com")
```

Creates a new Convertorio client instance.

#### Methods

##### ConvertFileAsync

```csharp
Task<ConversionResult> ConvertFileAsync(
    ConversionOptions options,
    CancellationToken cancellationToken = default
)
```

Convert an image file.

**Parameters:**
- `options` - Conversion options (input path, target format, etc.)
- `cancellationToken` - Optional cancellation token

**Returns:** `ConversionResult` with output path, file size, processing time, and download URL.

**Throws:**
- `ArgumentNullException` - If options is null
- `ArgumentException` - If InputPath or TargetFormat is missing
- `FileNotFoundException` - If input file doesn't exist
- `ConvertorioException` - For API errors

##### GetAccountAsync

```csharp
Task<AccountInfo> GetAccountAsync(CancellationToken cancellationToken = default)
```

Get account information and usage stats.

##### ListJobsAsync

```csharp
Task<JobInfo[]> ListJobsAsync(
    ListJobsOptions options = null,
    CancellationToken cancellationToken = default
)
```

List conversion jobs with optional filtering.

##### GetJobAsync

```csharp
Task<JobDetails> GetJobAsync(string jobId, CancellationToken cancellationToken = default)
```

Get detailed information about a specific job.

#### Events

##### ConversionStart

```csharp
event EventHandler<ConversionStartEventArgs> ConversionStart
```

Fired when a conversion starts.

##### ConversionProgress

```csharp
event EventHandler<ConversionProgressEventArgs> ConversionProgress
```

Fired when conversion progress updates.

##### ConversionStatus

```csharp
event EventHandler<ConversionStatusEventArgs> ConversionStatus
```

Fired when job status is polled.

##### ConversionComplete

```csharp
event EventHandler<ConversionCompleteEventArgs> ConversionComplete
```

Fired when conversion completes successfully.

##### ConversionError

```csharp
event EventHandler<ConversionErrorEventArgs> ConversionError
```

Fired when a conversion error occurs.

### ConversionOptions

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `InputPath` | `string` | Yes | Path to the input file |
| `TargetFormat` | `string` | Yes | Target format (jpg, png, webp, avif, etc.) |
| `OutputPath` | `string` | No | Output path (auto-generated if not provided) |
| `ConversionMetadata` | `ConversionMetadata` | No | Advanced conversion options |

### ConversionMetadata

| Property | Type | Description | Values |
|----------|------|-------------|--------|
| `AspectRatio` | `string` | Target aspect ratio | `original`, `1:1`, `4:3`, `16:9`, `9:16`, `21:9`, `custom` |
| `CropStrategy` | `string` | How to crop the image | `fit`, `crop-center`, `crop-top`, `crop-bottom`, `crop-left`, `crop-right` |
| `Quality` | `int?` | Compression quality 1-100 | For JPG, WebP, AVIF formats |
| `IconSize` | `int?` | Icon size in pixels | For ICO format: 16, 32, 48, 64, 128, 256 |
| `CustomWidth` | `int?` | Custom width in pixels | When `AspectRatio = "custom"` |
| `CustomHeight` | `int?` | Custom height in pixels | When `AspectRatio = "custom"` |

### ConversionResult

| Property | Type | Description |
|----------|------|-------------|
| `Success` | `bool` | Whether conversion was successful |
| `JobId` | `string` | Unique job identifier |
| `InputPath` | `string` | Input file path |
| `OutputPath` | `string` | Output file path |
| `SourceFormat` | `string` | Source format |
| `TargetFormat` | `string` | Target format |
| `FileSize` | `long` | Output file size in bytes |
| `ProcessingTime` | `int` | Processing time in milliseconds |
| `DownloadUrl` | `string` | Direct download URL |

## Supported Formats

**Input Formats:** JPG, JPEG, PNG, GIF, BMP, TIFF, TIF, WEBP, HEIC, HEIF, AVIF, SVG, ICO, PSD, AI, EPS, PDF, CR2, NEF, DNG, RAW, JXL

**Output Formats:** JPG, PNG, WEBP, AVIF, GIF, BMP, TIFF, ICO, PDF, JXL

**✨ AI-Powered OCR:** Extract text from any image format with advanced AI technology

## 🤖 AI-Powered OCR

Extract text from images with state-of-the-art AI accuracy.

### Quick OCR Example

```csharp
using (var client = new ConvertorioClient(apiKey))
{
    var result = await client.ConvertFileAsync(new ConversionOptions
    {
        InputPath = "./invoice.jpg",
        TargetFormat = "ocr",
        OutputPath = "./invoice.json",
        ConversionMetadata = new ConversionMetadata
        {
            OcrFormat = "json",
            OcrInstructions = "Extract invoice data with line items"
        }
    });

    Console.WriteLine($"Tokens used: {result.TokensUsed}");
}
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

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `OcrFormat` | string | `txt`, `json` | Output format (default: `txt`) |
| `OcrInstructions` | string | Any text | Custom instructions to guide extraction |

### OCR Use Cases

- 📄 **Invoice Processing**: Extract structured data from invoices and receipts
- 📝 **Form Digitization**: Convert paper forms to digital data
- 📋 **Document Archival**: Make scanned documents searchable
- 🏷️ **Label Reading**: Extract text from product labels and tags
- ✍️ **Handwriting Recognition**: Digitize handwritten notes and documents

### Complete OCR Example

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Convertorio.SDK;
using Newtonsoft.Json;

class Program
{
    static async Task Main(string[] args)
    {
        using (var client = new ConvertorioClient("your_api_key_here"))
        {
            // Extract text as JSON with custom instructions
            var result = await client.ConvertFileAsync(new ConversionOptions
            {
                InputPath = "./receipt.jpg",
                TargetFormat = "ocr",
                OutputPath = "./receipt.json",
                ConversionMetadata = new ConversionMetadata
                {
                    OcrFormat = "json",
                    OcrInstructions = "Extract merchant name, date, items with prices, and total amount"
                }
            });

            Console.WriteLine("OCR completed!");
            Console.WriteLine($"Tokens used: {result.TokensUsed}");
            Console.WriteLine($"Output saved to: {result.OutputPath}");

            // Read the extracted text
            var jsonContent = await File.ReadAllTextAsync("./receipt.json");
            var extractedData = JsonConvert.DeserializeObject(jsonContent);
            Console.WriteLine(extractedData);
        }
    }
}
```

## Error Handling

The SDK throws `ConvertorioException` for API-related errors:

```csharp
try
{
    var result = await client.ConvertFileAsync(options);
}
catch (ConvertorioException ex)
{
    Console.WriteLine($"API Error: {ex.Message}");
}
catch (FileNotFoundException ex)
{
    Console.WriteLine($"File not found: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"Unexpected error: {ex.Message}");
}
```

## Cancellation Support

All async methods support cancellation tokens:

```csharp
using (var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30)))
{
    try
    {
        var result = await client.ConvertFileAsync(options, cts.Token);
    }
    catch (OperationCanceledException)
    {
        Console.WriteLine("Conversion was cancelled");
    }
}
```

## Best Practices

### 1. Use `using` Statements

Always dispose of the client when done:

```csharp
using (var client = new ConvertorioClient(apiKey))
{
    // Use client
}
```

### 2. Handle Errors Gracefully

```csharp
try
{
    var result = await client.ConvertFileAsync(options);
}
catch (ConvertorioException ex)
{
    // Handle API errors
    logger.LogError($"Conversion failed: {ex.Message}");
}
```

### 3. Use Cancellation Tokens for Long Operations

```csharp
var cts = new CancellationTokenSource();
var result = await client.ConvertFileAsync(options, cts.Token);
```

### 4. Subscribe to Events for Progress Tracking

```csharp
client.ConversionProgress += (s, e) =>
{
    progressBar.Update(e.Step);
};
```

## Examples

Complete examples are available in the [`examples/dotnet`](../../examples/dotnet/) directory:

- **[BasicConversion.cs](../../examples/dotnet/BasicConversion.cs)** - Simple image conversion
- **[WithEvents.cs](../../examples/dotnet/WithEvents.cs)** - Conversion with progress events
- **[BatchConversion.cs](../../examples/dotnet/BatchConversion.cs)** - Convert multiple files
- **[AccountInfo.cs](../../examples/dotnet/AccountInfo.cs)** - Retrieve account information
- **[AdvancedOptions.cs](../../examples/dotnet/AdvancedOptions.cs)** - Advanced conversion options

## Testing

Run the test suite:

```bash
cd tests/dotnet/Convertorio.SDK.Tests
dotnet test
```

## Building from Source

```bash
cd libs/dotnet/Convertorio.SDK
dotnet build
```

## Creating a NuGet Package

```bash
cd libs/dotnet/Convertorio.SDK
dotnet pack --configuration Release
```

The package will be created in `bin/Release/Convertorio.SDK.1.2.0.nupkg`.

## Publishing to NuGet

```bash
dotnet nuget push bin/Release/Convertorio.SDK.1.2.0.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

## Requirements

- **.NET Standard 2.0+**
- Compatible with:
  - .NET Core 2.0+
  - .NET 5.0+
  - .NET Framework 4.6.1+
  - Mono 5.4+
  - Xamarin.iOS 10.14+
  - Xamarin.Android 8.0+
  - UWP 10.0.16299+

## Dependencies

- `Newtonsoft.Json` >= 13.0.3
- `System.Net.Http` >= 4.3.4

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## Support

- **Documentation:** [convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Email:** [support@convertorio.com](mailto:support@convertorio.com)
- **Issues:** [GitHub Issues](https://github.com/SedeSoft/convertorio-sdk/issues)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.2.0 (2024-11-21)

- Initial release of .NET SDK
- Full async/await support
- Event-driven progress tracking
- Support for 20+ image formats
- Comprehensive documentation and examples
- Unit test coverage
- NuGet package ready

---

Made with ❤️ by the [Convertorio](https://convertorio.com) team
