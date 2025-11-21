# Changelog

All notable changes to the Convertorio Java SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-11-20

### Added
- Initial release of Java SDK
- Core conversion functionality with `convertFile()` method
- Event listener system for tracking conversion progress
- Support for advanced conversion options:
  - Aspect ratio control (original, 1:1, 4:3, 16:9, 9:16, 21:9)
  - Crop strategies (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
  - Quality control for JPG, WebP, AVIF formats (1-100)
  - ICO icon generation with custom sizes (16, 32, 48, 64, 128, 256)
  - Image resizing with width/height control
- Account management with `getAccount()` method
- Job management with `listJobs()` and `getJob()` methods
- Type-safe API with builder patterns
- Comprehensive error handling with `ConvertorioException`
- Event system with 5 event types:
  - `start` - Conversion begins
  - `progress` - Progress updates
  - `status` - Job status checks
  - `complete` - Conversion completes
  - `error` - Conversion fails
- Full support for all image formats:
  - Raster: JPG, PNG, WebP, AVIF, HEIC, BMP, TIFF, GIF
  - Icons: ICO
  - Raw: DNG, CR2, NEF, ARW
- Automatic file upload and download handling
- Maven Central distribution support
- Comprehensive documentation and examples

### Technical Details
- Built with OkHttp for HTTP client
- Uses Gson for JSON parsing
- Requires Java 11 or higher
- No external image processing libraries required
- Follows Java best practices and conventions
- Builder pattern for configuration objects
- Immutable result objects

### Dependencies
- `com.squareup.okhttp3:okhttp:4.12.0`
- `com.google.code.gson:gson:2.10.1`

## Migration Guide

This is the first release of the Java SDK. If you're migrating from direct API calls:

### Before (Direct API)
```java
// Manual HTTP requests and file handling
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.convertorio.com/v1/convert/upload-url"))
    .header("Authorization", "Bearer " + apiKey)
    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
// ... handle upload, polling, download manually
```

### After (SDK)
```java
// Simple, one-line conversion
ConvertorioClient client = new ConvertorioClient(
    ClientConfig.builder().apiKey("your_api_key_here").build()
);
ConversionResult result = client.convertFile(
    ConversionOptions.builder()
        .inputPath("./image.png")
        .targetFormat("jpg")
        .build()
);
```

### Benefits of SDK
- ✅ No manual HTTP request handling
- ✅ Automatic file upload/download
- ✅ Built-in polling and error handling
- ✅ Type-safe API with compile-time checks
- ✅ Event system for progress tracking
- ✅ Clean, idiomatic Java code

[1.2.0]: https://github.com/SedeSoft/convertorio-sdk/releases/tag/v1.2.0
