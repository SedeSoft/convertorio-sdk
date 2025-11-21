# Changelog

All notable changes to the Convertorio .NET SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-11-21

### Added
- Initial release of Convertorio SDK for .NET
- Full async/await support with `ConvertFileAsync`
- Event-driven architecture for progress tracking
  - `ConversionStart` event
  - `ConversionProgress` event
  - `ConversionStatus` event
  - `ConversionComplete` event
  - `ConversionError` event
- Support for 20+ image formats (JPG, PNG, WebP, AVIF, HEIC, and more)
- Advanced conversion options:
  - Aspect ratio control (1:1, 4:3, 16:9, 9:16, 21:9, custom)
  - Crop strategies (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
  - Quality control (1-100 for JPG, WebP, AVIF)
  - Icon size options (16, 32, 48, 64, 128, 256 for ICO format)
  - Custom dimensions support
- Account management:
  - `GetAccountAsync` - Retrieve account information and usage stats
  - `ListJobsAsync` - List conversion jobs with filtering
  - `GetJobAsync` - Get detailed job information
- Comprehensive error handling with `ConvertorioException`
- Full XML documentation for IntelliSense support
- Cancellation token support for all async operations
- Complete unit test suite (24 tests)
- Five example applications demonstrating all features
- .NET Standard 2.0 compatibility
- NuGet package configuration
- MIT License

### Dependencies
- Newtonsoft.Json 13.0.3
- System.Net.Http 4.3.4

### Compatibility
- .NET Standard 2.0+
- .NET Core 2.0+
- .NET 5.0+
- .NET Framework 4.6.1+
- Mono 5.4+
- Xamarin.iOS 10.14+
- Xamarin.Android 8.0+
- UWP 10.0.16299+

### Documentation
- Comprehensive README with usage examples
- API reference documentation
- Five complete example applications
- Unit test coverage

## [Unreleased]

### Planned
- WebSocket support for real-time progress updates
- Streaming upload/download for large files
- Retry policies with exponential backoff
- Batch conversion optimization
- .NET 8 specific optimizations

---

For more information, visit [https://convertorio.com](https://convertorio.com)
