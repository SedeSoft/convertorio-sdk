# Changelog

All notable changes to the Convertorio SDK for Python will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-11-20

### Added
- **Initial Python SDK Release**: First stable release of Convertorio SDK for Python
- **Core Conversion Functionality**: `convert_file()` method for image conversion
- **Advanced Conversion Options**: Support for `conversion_metadata` parameter
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
- **Account Management**: `get_account()` method
- **Job Management**: `list_jobs()` and `get_job()` methods
- **Event System**: Event callbacks for progress tracking
  - `start` - Conversion started
  - `progress` - Progress updates
  - `status` - Job status polling
  - `complete` - Conversion completed
  - `error` - Error occurred
- **Type Hints**: Full type annotations for all methods
- **Comprehensive Documentation**: Detailed README with examples
- **Error Handling**: Custom `ConversionError` exception
- **Automatic File Management**: Upload and download handled automatically

### Features
- File upload to cloud storage
- Asynchronous conversion with polling
- Automatic file download
- Event callbacks for progress tracking
- Error handling and validation
- Support for 20+ image formats

---

## Version Compatibility

This SDK is compatible with Python 3.7+.

Recommended Python versions:
- Python 3.9+
- Python 3.10+
- Python 3.11+
- Python 3.12+

---

## Migration Guide

### From Other SDKs

If you're migrating from the Node.js SDK, the Python SDK provides similar functionality with Pythonic conventions:

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

**Python:**
```python
result = client.convert_file(
    input_path='./photo.jpg',
    target_format='png',
    conversion_metadata={
        'aspect_ratio': '16:9',
        'quality': 85
    }
)
```

**Key Differences:**
- Method names use snake_case instead of camelCase
- No async/await required (synchronous API)
- Dictionary keys use snake_case (e.g., `aspect_ratio` instead of `aspectRatio`)
- Event registration uses `.on()` method similar to Node.js

---

## Support

For issues, questions, or feature requests, please visit:
- GitHub Issues: https://github.com/SedeSoft/convertorio-sdk/issues
- Email: support@convertorio.com
- Documentation: https://convertorio.com/docs
