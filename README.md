# Convertorio SDK

Official SDKs for the Convertorio API - Convert images between 20+ formats with ease.

## 🌟 Features

- ✅ Simple, intuitive APIs
- ✅ Support for 20+ image formats
- ✅ Automatic file upload and download
- ✅ Event-driven progress tracking
- ✅ Comprehensive error handling
- ✅ TypeScript support
- ✅ Well documented with examples
- ✅ PDF to Thumbnail conversion
- ✅ AI-powered OCR text extraction

## 📦 Supported Languages

| Language | Status | Documentation | Package |
|----------|--------|---------------|---------|
| **Node.js** | ✅ Available | [docs/nodejs](./docs/nodejs/README.md) | `convertorio-sdk` |
| **Python** | ✅ Available | [docs/python](./docs/python/README.md) | `convertorio-sdk` |
| **PHP** | ✅ Available | [README-PHP.md](./README-PHP.md) | `convertorio/sdk` |
| **Go** | ✅ Available | [docs/go](./docs/go/README.md) | `github.com/SedeSoft/convertorio-sdk/libs/go` |
| **Java** | ✅ Available | [libs/java](./libs/java/README.md) | `com.sedesoft:convertorio-sdk` |
| **Ruby** | ✅ Available | [libs/ruby](./libs/ruby/README.md) | `convertorio-sdk` |
| **.NET/C#** | ✅ Available | [libs/dotnet](./libs/dotnet/README.md) | `Convertorio.SDK` |

## 🚀 Quick Start

### Node.js

```bash
npm install convertorio-sdk
```

```javascript
const ConvertorioClient = require('convertorio-sdk');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

const result = await client.convertFile({
    inputPath: './image.png',
    targetFormat: 'jpg'
});

console.log('Converted!', result.outputPath);
```

[**→ Full Node.js Documentation**](./docs/nodejs/README.md)

### Python

```bash
pip install convertorio-sdk
```

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

result = client.convert_file(
    input_path='./image.png',
    target_format='jpg'
)

print(f"Converted! {result['output_path']}")
```

[**→ Full Python Documentation**](./docs/python/README.md)

### PHP

```bash
composer require convertorio/sdk
```

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

$result = $client->convertFile(
    './image.png',
    'jpg'
);

echo "Converted! {$result['output_path']}";
```

[**→ Full PHP Documentation**](./README-PHP.md)

### Go

```bash
go install github.com/SedeSoft/convertorio-sdk/libs/go
```

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
        InputPath:    "./image.png",
        TargetFormat: "jpg",
    })

    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Converted! %s\n", result.OutputPath)
}
```

[**→ Full Go Documentation**](./docs/go/README.md)

### Java

```xml
<!-- Maven: Add to pom.xml -->
<dependency>
    <groupId>com.sedesoft</groupId>
    <artifactId>convertorio-sdk</artifactId>
    <version>1.2.0</version>
</dependency>
```

```java
import com.sedesoft.convertorio.*;

public class Example {
    public static void main(String[] args) {
        try {
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

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

[**→ Full Java Documentation**](./libs/java/README.md)

### Ruby

```bash
gem install convertorio-sdk
```

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'your_api_key_here')

result = client.convert_file(
  input_path: './image.png',
  target_format: 'jpg'
)

puts "Converted! #{result[:output_path]}"
```

[**→ Full Ruby Documentation**](./libs/ruby/README.md)

### .NET/C#

```bash
dotnet add package Convertorio.SDK
```

```csharp
using Convertorio.SDK;

using (var client = new ConvertorioClient("your_api_key_here"))
{
    var result = await client.ConvertFileAsync(new ConversionOptions
    {
        InputPath = "./image.png",
        TargetFormat = "jpg"
    });

    Console.WriteLine($"Converted! {result.OutputPath}");
}
```

[**→ Full .NET Documentation**](./libs/dotnet/README.md)

## 📖 Language-Specific Documentation

### Node.js (JavaScript/TypeScript)

The Node.js SDK provides a simple, promise-based API with event support for tracking conversion progress.

**Installation:**
```bash
npm install convertorio-sdk
```

**Features:**
- Promise-based async/await API
- Event emitters for progress tracking
- TypeScript definitions included
- Automatic file handling

**[→ View Node.js Documentation](./docs/nodejs/README.md)**

**[→ View Node.js Examples](./examples/nodejs/)**

---

### Python

The Python SDK provides an intuitive API with event callbacks for tracking conversion progress.

**Installation:**
```bash
pip install convertorio-sdk
```

**Features:**
- Simple, synchronous API
- Event callbacks for progress tracking
- Type hints for IDE support
- Automatic file handling

**[→ View Python Documentation](./docs/python/README.md)**

**[→ View Python Examples](./examples/python/)**

---

### PHP

The PHP SDK provides a clean, PSR-4 compliant API with event callbacks for tracking conversion progress.

**Installation:**
```bash
composer require convertorio/sdk
```

**Features:**
- PSR-4 autoloading
- Event callbacks for progress tracking
- Compatible with modern PHP frameworks
- Automatic file handling
- Supports PHP 7.4+

**[→ View PHP Documentation](./README-PHP.md)**

**[→ View PHP Examples](./examples.php)**

---

### Go

The Go SDK provides a type-safe, idiomatic Go API with event callbacks for tracking conversion progress.

**Installation:**
```bash
go install github.com/SedeSoft/convertorio-sdk/libs/go
```

**Features:**
- Type-safe API with structs
- Event callbacks for progress tracking
- No external dependencies (standard library only)
- Automatic file handling
- Supports Go 1.18+

**[→ View Go Documentation](./docs/go/README.md)**

**[→ View Go Examples](./examples/go/)**

---

### Java

The Java SDK provides a type-safe API with builder patterns and event callbacks for tracking conversion progress.

**Installation:**

Maven:
```xml
<dependency>
    <groupId>com.sedesoft</groupId>
    <artifactId>convertorio-sdk</artifactId>
    <version>1.2.0</version>
</dependency>
```

Gradle:
```gradle
implementation 'com.sedesoft:convertorio-sdk:1.2.0'
```

**Features:**
- Type-safe API with builder patterns
- Event callbacks for progress tracking
- Uses OkHttp and Gson (no external image libraries)
- Automatic file handling
- Supports Java 11+

**[→ View Java Documentation](./libs/java/README.md)**

**[→ View Java Examples](./examples/java/)**

---

### Ruby

The Ruby SDK provides a clean, idiomatic Ruby API with event callbacks for tracking conversion progress.

**Installation:**
```bash
gem install convertorio-sdk
```

**Features:**
- Clean, idiomatic Ruby API
- Event callbacks for progress tracking
- HTTParty for HTTP requests
- Automatic file handling
- Supports Ruby 2.7+

**[→ View Ruby Documentation](./libs/ruby/README.md)**

**[→ View Ruby Examples](./examples/ruby/)**

---

### .NET/C#

The .NET SDK provides a modern async/await API with event-driven progress tracking for all .NET platforms.

**Installation:**
```bash
dotnet add package Convertorio.SDK
```

**Features:**
- Modern async/await API
- Event-driven progress tracking
- IDisposable pattern for proper resource cleanup
- Full IntelliSense support with XML documentation
- Supports .NET Standard 2.0+ (.NET Core, .NET 5+, .NET Framework 4.6.1+)

**[→ View .NET Documentation](./libs/dotnet/README.md)**

**[→ View .NET Examples](./examples/dotnet/)**

---

### Other Languages

Want to see support for another language? [Open an issue](https://github.com/convertorio/sdk/issues) or contribute!

## 🔑 Getting Started

### 1. Get Your API Key

1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

### 2. Install the SDK

Choose your preferred language and follow the installation instructions in the language-specific documentation.

### 3. Start Converting

Check out the examples in the `examples/` directory for your chosen language.

## 🎯 Supported Formats

Convert between 20+ image formats:

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

**Special Conversions:**
- Thumbnail (PDF to JPG preview)

**✨ AI-Powered OCR:**
- Extract text from any image format
- Powered by advanced AI technology
- Support for printed and handwritten text
- JSON or TXT output formats

## 🤖 AI-Powered OCR (NEW)

Extract text from images with state-of-the-art AI accuracy.

### Quick OCR Example

#### Node.js
```javascript
const result = await client.convertFile({
    inputPath: './invoice.jpg',
    targetFormat: 'ocr',
    outputPath: './invoice.json',
    conversionMetadata: {
        ocr_format: 'json',
        ocr_instructions: 'Extract invoice data including date, items, and total'
    }
});

console.log(`Extracted text, tokens used: ${result.tokensUsed}`);
```

#### Python
```python
result = client.convert_file(
    input_path='./receipt.jpg',
    target_format='ocr',
    output_path='./receipt.txt',
    conversion_metadata={
        'ocr_format': 'txt',
        'ocr_instructions': 'Extract all text from this receipt'
    }
)

print(f"Tokens used: {result['tokens_used']}")
```

#### PHP
```php
$result = $client->convertFile(
    './document.jpg',
    'ocr',
    './document.json',
    [
        'ocr_format' => 'json',
        'ocr_instructions' => 'Extract form data as structured JSON'
    ]
);

echo "Tokens used: " . $result['tokens_used'];
```

#### Ruby
```ruby
result = client.convert_file(
  input_path: './form.jpg',
  target_format: 'ocr',
  output_path: './form.txt',
  conversion_metadata: {
    ocr_format: 'txt',
    ocr_instructions: 'Extract all text preserving formatting'
  }
)

puts "Tokens used: #{result[:tokens_used]}"
```

#### Go
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

fmt.Printf("Tokens used: %d\n", result.TokensUsed)
```

#### Java
```java
ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./receipt.jpg")
        .targetFormat("ocr")
        .outputPath("./receipt.txt")
        .conversionMetadata(Map.of(
            "ocr_format", "txt",
            "ocr_instructions", "Extract receipt items and total"
        ))
        .build()
);

System.out.println("Tokens used: " + result.getTokensUsed());
```

#### .NET/C#
```csharp
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

### Use Cases

- 📄 **Invoice Processing**: Extract structured data from invoices and receipts
- 📝 **Form Digitization**: Convert paper forms to digital data
- 📋 **Document Archival**: Make scanned documents searchable
- 🏷️ **Label Reading**: Extract text from product labels and tags
- ✍️ **Handwriting Recognition**: Digitize handwritten notes
- 📊 **Table Extraction**: Convert tables in images to structured data

For complete OCR documentation, see the language-specific README files.

## 📄 PDF Thumbnails (NEW)

Generate high-quality thumbnail images from PDF documents. Perfect for document previews, galleries, and file browsers.

### Quick Thumbnail Example

#### Node.js
```javascript
const result = await client.convertFile({
    inputPath: './document.pdf',
    targetFormat: 'thumbnail',
    outputPath: './preview.jpg',
    conversionMetadata: {
        thumbnail_width: 800,
        thumbnail_crop: 'half'  // Optional: capture top 50% of page
    }
});

console.log(`Thumbnail created: ${result.outputPath}`);
```

#### Python
```python
result = client.convert_file(
    input_path='./document.pdf',
    target_format='thumbnail',
    output_path='./preview.jpg',
    conversion_metadata={
        'thumbnail_width': 800,
        'thumbnail_crop': 'half'  # Optional: capture top 50% of page
    }
)

print(f"Thumbnail created: {result['output_path']}")
```

#### PHP
```php
$result = $client->convertFile(
    './document.pdf',
    'thumbnail',
    './preview.jpg',
    [
        'thumbnail_width' => 800,
        'thumbnail_crop' => 'half'  // Optional: capture top 50% of page
    ]
);

echo "Thumbnail created: " . $result['output_path'];
```

#### Ruby
```ruby
result = client.convert_file(
  input_path: './document.pdf',
  target_format: 'thumbnail',
  output_path: './preview.jpg',
  conversion_metadata: {
    thumbnail_width: 800,
    thumbnail_crop: 'half'  # Optional: capture top 50% of page
  }
)

puts "Thumbnail created: #{result[:output_path]}"
```

#### Go
```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./document.pdf",
    TargetFormat: "thumbnail",
    OutputPath:   "./preview.jpg",
    ConversionMetadata: map[string]interface{}{
        "thumbnail_width": 800,
        "thumbnail_crop":  "half",  // Optional: capture top 50% of page
    },
})

fmt.Printf("Thumbnail created: %s\n", result.OutputPath)
```

#### Java
```java
ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./document.pdf")
        .targetFormat("thumbnail")
        .outputPath("./preview.jpg")
        .conversionMetadata(Map.of(
            "thumbnail_width", 800,
            "thumbnail_crop", "half"  // Optional: capture top 50% of page
        ))
        .build()
);

System.out.println("Thumbnail created: " + result.getOutputPath());
```

#### .NET/C#
```csharp
var result = await client.ConvertFileAsync(new ConversionOptions
{
    InputPath = "./document.pdf",
    TargetFormat = "thumbnail",
    OutputPath = "./preview.jpg",
    ConversionMetadata = new ConversionMetadata
    {
        ThumbnailWidth = 800,
        ThumbnailCrop = "half"  // Optional: capture top 50% of page
    }
});

Console.WriteLine($"Thumbnail created: {result.OutputPath}");
```

### Thumbnail Options

| Option | Type | Range | Default | Description |
|--------|------|-------|---------|-------------|
| `thumbnail_width` | int | 50-2000 | 800 | Target width in pixels |
| `thumbnail_height` | int | 50-2000 | auto | Target height (maintains aspect ratio if not specified) |
| `thumbnail_crop` | string | see below | `full` | Portion of page to capture |

### Crop Values

| Value | Description |
|-------|-------------|
| `full` | Full page (default) |
| `half` | Top 50% of page |
| `third` | Top 33% of page |
| `quarter` | Top 25% of page |
| `two-thirds` | Top 66% of page |

### Thumbnail Features

- **High Quality**: Renders PDF at optimal resolution for sharp thumbnails
- **First Page**: Automatically extracts the first page of multi-page PDFs
- **Aspect Ratio**: Maintains document aspect ratio automatically
- **Crop Control**: Capture full page or just the top portion for previews
- **JPEG Output**: Optimized JPEG output at 90% quality

### Use Cases

- 📁 **File Browsers**: Show document previews in file managers
- 📚 **Document Libraries**: Create gallery views of PDF collections
- 📧 **Email Attachments**: Generate previews for attached documents
- 🔍 **Search Results**: Display document thumbnails in search interfaces
- 📱 **Mobile Apps**: Efficient document previews for mobile devices

## 📊 API Limits

| Plan | Daily Free Conversions | Rate Limit | Concurrent Jobs | Max File Size |
|------|----------------------|------------|----------------|---------------|
| Free | 2 per day | 1 req/sec | 5 | 20 MB |
| Paid | Unlimited* | 1 req/sec | 5 | 20 MB |

*With purchased points

## 📁 Repository Structure

```
sdk/
├── src/               # PHP SDK source (root level for Packagist)
│   └── ConvertorioClient.php
├── libs/              # SDK implementations
│   ├── nodejs/        # Node.js SDK
│   ├── python/        # Python SDK
│   ├── php/           # PHP SDK
│   ├── go/            # Go SDK
│   ├── java/          # Java SDK
│   └── ruby/          # Ruby SDK
├── examples/          # Usage examples
│   ├── nodejs/        # Node.js examples
│   ├── python/        # Python examples
│   ├── php/           # PHP examples
│   ├── go/            # Go examples
│   ├── java/          # Java examples
│   └── ruby/          # Ruby examples
├── tests/             # Test suites
│   ├── nodejs/        # Node.js tests
│   ├── python/        # Python tests
│   ├── php/           # PHP tests
│   ├── go/            # Go tests
│   ├── java/          # Java tests
│   └── ruby/          # Ruby tests
├── docs/              # Documentation
│   ├── nodejs/        # Node.js documentation
│   ├── python/        # Python documentation
│   ├── php/           # PHP documentation
│   └── go/            # Go documentation
├── composer.json      # PHP package config (root level)
├── examples.php       # PHP examples (root level)
├── README.md          # This file
└── README-PHP.md      # PHP documentation
```

## 🛠️ Development

### Building from Source

Each language SDK can be built independently. See the language-specific README for build instructions.

### Running Examples

Navigate to the examples directory for your language:

```bash
# Node.js examples
cd examples/nodejs
node basic-conversion.js

# Python examples
cd examples/python
python basic_conversion.py

# PHP examples
php examples.php

# Go examples
cd examples/go
go run examples.go

# Java examples
cd examples/java
javac -cp ".:libs/*" Example.java
java -cp ".:libs/*" Example

# Ruby examples
cd examples/ruby
ruby basic_conversion.rb
```

### Testing

```bash
# Node.js
cd libs/nodejs
npm test

# Python
cd test/python/simple-convert
python simple-test.py
python test-resize.py
python test-with-metadata.py

# PHP
cd test/php/simple-convert
php simple-test.php
php test-resize.php
php test-with-metadata.php

# Go
cd test/go/simple-convert
go run main.go

# Java
cd test/java/simple-convert
javac -cp ".:libs/*" SimpleTest.java
java -cp ".:libs/*" SimpleTest

# Ruby
cd tests/ruby
bundle install
bundle exec rspec
```

## 📚 Resources

- **Main Website:** [convertorio.com](https://convertorio.com)
- **API Documentation:** [convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Support:** [support@convertorio.com](mailto:support@convertorio.com)
- **GitHub Repository:** [github.com/convertorio/sdk](https://github.com/convertorio/sdk)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** - Open an issue describing the problem
2. **Suggest features** - Open an issue with your feature request
3. **Submit pull requests** - Fork, make changes, and submit a PR
4. **Improve documentation** - Help make the docs better
5. **Add SDK for new language** - Implement SDK for a language we don't support yet

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

All SDKs are released under the MIT License. See [LICENSE](./LICENSE) for details.

## 🔔 Stay Updated

- Star this repository to get notifications about new releases
- Follow us on [Twitter](https://twitter.com/convertorio)
- Subscribe to our [newsletter](https://convertorio.com/newsletter)

## ❓ Support

Need help? Here are your options:

1. **Documentation** - Check the language-specific docs
2. **Examples** - Browse the examples directory
3. **GitHub Issues** - [Open an issue](https://github.com/convertorio/sdk/issues)
4. **Email Support** - [support@convertorio.com](mailto:support@convertorio.com)
5. **Community** - Join our [Discord server](https://discord.gg/convertorio)

---

Made with ❤️ by the Convertorio team
