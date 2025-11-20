# Convertorio SDK - PHP Tests

Test suite for the Convertorio PHP SDK.

## Prerequisites

- PHP >= 7.4
- Composer
- Valid Convertorio API key

## Installation

```bash
cd sdk/libs/php
composer install
```

## Running Tests

### Basic Conversion Test

Tests basic image conversion functionality:

```bash
php sdk/test/php/simple-convert/simple-test.php
```

### Resize Tests

Tests various resize scenarios (6 tests):

```bash
php sdk/test/php/simple-convert/test-resize.php
```

Tests included:
1. Resize by width (800px)
2. Resize by height (600px)
3. Resize to exact 1920x1080
4. Aspect ratio 1:1 + resize width 500px
5. Create thumbnail (150x150)
6. HD resize (1280px width) with quality 95%

### Metadata Tests

Tests advanced conversion options (6 tests):

```bash
php sdk/test/php/simple-convert/test-with-metadata.php
```

Tests included:
1. Convert to 16:9 widescreen
2. Convert to 1:1 square for Instagram
3. Create ICO favicon (32x32)
4. High quality JPG conversion (quality 95)
5. Convert to 9:16 vertical for Stories
6. Fit strategy with padding (16:9)

## Test Image

All tests use `test-image.png` in the same directory. Make sure this file exists before running tests.

## Configuration

Update the API key in each test file:

```php
const API_KEY = 'your_api_key_here';
```

Get your API key from [https://convertorio.com/account](https://convertorio.com/account).

## Output Files

Test output files are created in the same directory as the test scripts with descriptive names:
- `output-*.jpg` - Test results
- `output-*.png` - Test results
- `output-*.ico` - Icon test results

## Troubleshooting

**Error: "Input file not found"**
- Ensure `test-image.png` exists in `sdk/test/php/simple-convert/`

**Error: "HTTP request failed"**
- Verify your API key is correct
- Check internet connectivity

**Error: "Insufficient credits"**
- Add more points at [https://convertorio.com/billing](https://convertorio.com/billing)
- Free tier: 5 conversions per day

## Support

- Documentation: [https://convertorio.com/docs](https://convertorio.com/docs)
- Support: [support@convertorio.com](mailto:support@convertorio.com)
