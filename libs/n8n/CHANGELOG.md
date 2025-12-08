# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-07

### Added

- Initial release
- **Convert Image** operation - Convert images between 10+ formats
  - Support for JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, JXL
  - Quality control for lossy formats
  - Resize with width/height options
  - Aspect ratio control with crop strategies
  - ICO size options
- **PDF Thumbnail** operation - Generate JPG thumbnails from PDFs
  - Configurable width (50-2000 pixels)
  - Crop modes: full, half, third, quarter, two-thirds
- **OCR** operation - AI-powered text extraction
  - Plain text or JSON output
- **Get Account Info** operation - Check balance and usage
- Convertorio API credentials with test connection
