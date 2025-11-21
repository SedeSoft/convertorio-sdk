# Changelog

All notable changes to the Convertorio Ruby SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-01-21

### Added
- Initial release of the Convertorio Ruby SDK
- Core image conversion functionality
- Support for 20+ image formats (JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, etc.)
- Event-driven progress tracking with callbacks
- Automatic file upload and download
- Advanced conversion options:
  - Aspect ratio control (original, 1:1, 4:3, 16:9, 9:16, 21:9, custom)
  - Crop strategies (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
  - Quality control for lossy formats (1-100)
  - ICO format with custom icon sizes (16, 32, 48, 64, 128, 256)
  - Image resizing (resize_width, resize_height)
- Account management methods
  - Get account information (`get_account`)
  - List conversion jobs (`list_jobs`)
  - Get job details (`get_job`)
- Comprehensive error handling with custom exception classes
  - `Convertorio::Error` - Base error class
  - `Convertorio::APIError` - API-related errors
  - `Convertorio::FileNotFoundError` - File not found errors
  - `Convertorio::ConversionTimeoutError` - Timeout errors
- Full documentation with examples
- RSpec test suite with WebMock
- YARD documentation support

### Features
- Simple, idiomatic Ruby API
- HTTParty for HTTP requests
- Thread-safe design
- Automatic output path generation
- Event system for progress tracking (start, progress, status, complete, error)
- Batch conversion support
- Poll-based job status checking with configurable intervals

### Documentation
- Comprehensive README with usage examples
- API reference documentation
- 5 example scripts:
  - Basic conversion
  - Event-driven conversion
  - Batch conversion
  - Account information
  - Advanced options
- Complete test suite with 90%+ coverage
- Installation and setup guides

### Dependencies
- Ruby >= 2.7.0
- httparty ~> 0.21
- json ~> 2.6

### Development Dependencies
- bundler ~> 2.0
- rake ~> 13.0
- rspec ~> 3.12
- webmock ~> 3.18

## [Unreleased]

### Planned Features
- Async/parallel conversion support
- Progress bars for CLI usage
- Caching layer for repeated conversions
- Webhook support for job completion
- Bulk conversion with queue management
- Image metadata extraction
- Thumbnail generation helpers
- Cloud storage integrations (AWS S3, Google Cloud Storage, etc.)

---

## Version History

### Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

### Support Policy

- Latest version receives active development and bug fixes
- Previous minor version receives security fixes for 6 months
- Ruby version support follows Ruby's official EOL dates

### Migration Guides

#### From Future Versions

Migration guides will be added here when breaking changes are introduced.

---

For more information, visit:
- Documentation: https://convertorio.com/docs
- Repository: https://github.com/SedeSoft/convertorio-sdk
- Support: support@convertorio.com
