# Changelog

All notable changes to the Convertorio SDK for Node.js will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-11-20

### Added
- **Resize Control**: Support for `resize_width` and `resize_height` in `conversionMetadata`
  - Resize by width only (maintains aspect ratio)
  - Resize by height only (maintains aspect ratio)
  - Resize to exact dimensions (both width and height)
  - Range: 1-10000 pixels
  - Can be combined with aspect ratio and crop strategy
- **Enhanced Documentation**: Added comprehensive resize examples and guidelines
- **TypeScript Support**: Updated `ConversionMetadata` interface with `resize_width` and `resize_height` properties

### Changed
- Bumped version to 1.2.0 (minor version for new features)
- Updated README with detailed resize section and examples

## [1.1.0] - 2025-11-20

### Added
- **Advanced Conversion Options**: Support for `conversionMetadata` parameter in `convertFile()`
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
- **TypeScript Definitions**: Added `ConversionMetadata` interface with full type safety
- **Examples File**: Comprehensive `examples.js` with 12 usage examples

### Changed
- Updated `convertFile()` method signature to accept optional `conversionMetadata`
- Enhanced JSDoc documentation with detailed parameter descriptions
- Bumped version to 1.1.0 (minor version for new features)

### Documentation
- Updated README.md with "Advanced Conversion Options" section
- Added examples for all advanced features
- Documented aspect ratios, crop strategies, quality control, and ICO options

## [1.0.1] - 2025-11-19

### Fixed
- Minor documentation improvements
- Updated package metadata

## [1.0.0] - 2025-11-18

### Added
- Initial release of Convertorio SDK for Node.js
- Core conversion functionality (`convertFile()`)
- Account management (`getAccount()`)
- Job management (`listJobs()`, `getJob()`)
- Event-driven architecture with progress tracking
- Support for 20+ image formats
- TypeScript definitions included
- Comprehensive documentation

### Features
- File upload to cloud storage
- Asynchronous conversion with polling
- Automatic file download
- Event emitters for progress tracking
- Error handling and validation
- Promise-based API

---

## Migration Guide

### From 1.0.x to 1.1.0

The 1.1.0 release is **fully backward compatible**. All existing code will continue to work without changes.

#### New Features (Optional)

To use the new advanced conversion options, add the `conversionMetadata` parameter:

**Before (still works):**
```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'png'
});
```

**After (with advanced options):**
```javascript
const result = await client.convertFile({
    inputPath: './photo.jpg',
    targetFormat: 'png',
    conversionMetadata: {
        aspect_ratio: '16:9',
        crop_strategy: 'crop-center',
        quality: 85
    }
});
```

No breaking changes were introduced in this release.
