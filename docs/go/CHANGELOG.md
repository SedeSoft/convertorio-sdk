# Changelog

All notable changes to the Convertorio SDK for Go will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-11-20

### Added
- **Initial Go SDK Release**: First stable release of Convertorio SDK for Go
- **Core Conversion Functionality**: `ConvertFile()` method for image conversion
- **Advanced Conversion Options**: Support for `ConversionMetadata` parameter
  - **Aspect Ratio Control**: Transform images to specific aspect ratios
    - Presets: `original`, `1:1`, `4:3`, `16:9`, `9:16`, `21:9`
    - Custom ratios: `16:10`, `3:2`, etc.
  - **Crop Strategies**: Choose how to handle aspect ratio changes
    - `fit` - Add padding (letterbox/pillarbox)
    - `crop-center` - Crop from center
    - `crop-top`, `crop-bottom`, `crop-left`, `crop-right` - Directional cropping
  - **Quality Control**: Adjust compression quality (1-100) for lossy formats
    - Applies to JPG, WebP, AVIF, HEIC/HEIF
    - Default: 85%
  - **ICO Format Support**: Create icons with specific pixel sizes
    - Supported sizes: 16, 32, 48, 64, 128, 256 pixels
    - Automatic square cropping with selectable strategy
  - **Resize Control**: Support for `resize_width` and `resize_height`
    - Resize by width only (maintains aspect ratio)
    - Resize by height only (maintains aspect ratio)
    - Resize to exact dimensions (both width and height)
    - Range: 1-10000 pixels
    - Can be combined with aspect ratio and crop strategy
- **Account Management**: `GetAccount()` method
- **Job Management**: `ListJobs()` and `GetJob()` methods
- **Event System**: Event callbacks for progress tracking
  - `start` - Conversion started
  - `progress` - Progress updates
  - `status` - Job status polling
  - `complete` - Conversion completed
  - `error` - Error occurred
- **Type-Safe API**: Strongly typed structs and interfaces
- **Comprehensive Documentation**: Detailed README with examples
- **Error Handling**: Go-style error handling with wrapped errors
- **Automatic File Management**: Upload and download handled automatically

### Features
- File upload to cloud storage
- Asynchronous conversion with polling
- Automatic file download
- Event callbacks for progress tracking
- Error handling with wrapped errors
- Support for 20+ image formats
- Compatible with Go 1.18+

---

## Version Compatibility

This SDK is compatible with Go 1.18+.

Recommended Go versions:
- Go 1.18+
- Go 1.19+
- Go 1.20+
- Go 1.21+
- Go 1.22+
- Go 1.23+

Required dependencies:
- Standard library only (no external dependencies)

---

## Migration Guide

### From Other SDKs

If you're migrating from the Node.js, Python, or PHP SDK, the Go SDK provides similar functionality with Go conventions:

**Node.js:**
```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'png',
    conversionMetadata: {
        aspect_ratio: '16:9',
        quality: 85
    }
});
```

**Go:**
```go
result, err := client.ConvertFile(convertorio.ConvertFileOptions{
    InputPath:    "./photo.jpg",
    TargetFormat: "png",
    ConversionMetadata: map[string]interface{}{
        "aspect_ratio": "16:9",
        "quality":      85,
    },
})
if err != nil {
    log.Fatal(err)
}
```

**Key Differences:**
- Uses Go structs instead of objects
- Explicit error handling (no exceptions)
- Field names use Go conventions (PascalCase for exported fields)
- Map keys use snake_case for consistency with API
- Event registration uses `On()` method similar to Node.js
- Synchronous API with explicit error returns

---

## Support

For issues, questions, or feature requests, please visit:
- GitHub Issues: https://github.com/SedeSoft/convertorio-sdk/issues
- Email: support@convertorio.com
- Documentation: https://convertorio.com/docs
