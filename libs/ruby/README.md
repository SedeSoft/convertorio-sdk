# Convertorio SDK for Ruby

Official Ruby SDK for the Convertorio API. Convert images between 20+ formats with just a few lines of code.

## Features

- ✅ Simple, clean Ruby API
- ✅ Event-driven progress tracking
- ✅ Automatic file upload and download
- ✅ Support for 20+ image formats
- ✅ Full YARD documentation
- ✅ Batch conversion support
- ✅ Comprehensive error handling

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'convertorio-sdk'
```

And then execute:

```bash
bundle install
```

Or install it yourself as:

```bash
gem install convertorio-sdk
```

## Quick Start

```ruby
require 'convertorio'

# Initialize the client
client = Convertorio::Client.new(
  api_key: 'your_api_key_here' # Get your API key from https://convertorio.com/account
)

# Convert an image
result = client.convert_file(
  input_path: './image.png',
  target_format: 'jpg'
)

puts "Converted! #{result[:output_path]}"
```

## Configuration

### Creating a Client

```ruby
client = Convertorio::Client.new(
  api_key: 'your_api_key_here',                   # Required: Your API key
  base_url: 'https://api.convertorio.com'         # Optional: Custom API URL
)
```

**Getting your API Key:**
1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

## API Reference

### `convert_file(options)`

Convert an image file from one format to another.

**Parameters:**
- `input_path` (String, required): Path to the input image file
- `target_format` (String, required): Target format (jpg, png, webp, avif, gif, bmp, tiff, ico, heic, etc.)
- `output_path` (String, optional): Custom output path. If not provided, uses the same directory as input with new extension
- `conversion_metadata` (Hash, optional): Advanced conversion options (see Advanced Options section below)

**Returns:** Hash with conversion result

**Example:**

```ruby
result = client.convert_file(
  input_path: './photo.png',
  target_format: 'webp',
  output_path: './converted/photo.webp'
)

puts result
# {
#   success: true,
#   job_id: 'abc-123-def',
#   input_path: './photo.png',
#   output_path: './converted/photo.webp',
#   source_format: 'png',
#   target_format: 'webp',
#   file_size: 45620,
#   processing_time: 1250,
#   download_url: 'https://...'
# }
```

### `get_account()`

Get account information including points balance and usage.

**Returns:** Hash with account details

**Example:**

```ruby
account = client.get_account

puts account
# {
#   'id' => 'user-123',
#   'email' => 'user@example.com',
#   'name' => 'John Doe',
#   'plan' => 'free',
#   'points' => 100,
#   'daily_conversions_remaining' => 5,
#   'total_conversions' => 42
# }
```

### `list_jobs(options)`

List your conversion jobs with optional filtering.

**Parameters:**
- `limit` (Integer, optional): Number of jobs to return (default: 50, max: 100)
- `offset` (Integer, optional): Offset for pagination (default: 0)
- `status` (String, optional): Filter by status ('completed', 'failed', 'processing', etc.)

**Returns:** Array of job hashes

**Example:**

```ruby
jobs = client.list_jobs(limit: 10, status: 'completed')

puts jobs
# [
#   {
#     'id' => 'job-123',
#     'status' => 'completed',
#     'original_filename' => 'photo.png',
#     'source_format' => 'png',
#     'target_format' => 'jpg',
#     'processing_time_ms' => 1200,
#     'created_at' => '2025-01-20T10:30:00Z'
#   },
#   ...
# ]
```

### `get_job(job_id)`

Get details for a specific conversion job.

**Parameters:**
- `job_id` (String, required): The job ID

**Returns:** Hash with job details

**Example:**

```ruby
job = client.get_job('job-123')

puts job
# {
#   'id' => 'job-123',
#   'status' => 'completed',
#   'original_filename' => 'photo.png',
#   'download_url' => 'https://...',
#   ...
# }
```

## Events

The client supports event callbacks for tracking conversion progress:

### Event: `start`

Emitted when conversion starts.

```ruby
client.on(:start) do |data|
  puts "Starting: #{data[:file_name]}"
  puts "Converting #{data[:source_format]} to #{data[:target_format]}"
end
```

### Event: `progress`

Emitted at each step of the conversion process.

```ruby
client.on(:progress) do |data|
  puts "Step: #{data[:step]}"
  puts "Message: #{data[:message]}"
  # data[:step] can be:
  # - 'requesting-upload-url'
  # - 'uploading'
  # - 'confirming'
  # - 'converting'
  # - 'downloading'
end
```

### Event: `status`

Emitted during polling for job completion.

```ruby
client.on(:status) do |data|
  puts "Status: #{data[:status]}"
  puts "Attempt: #{data[:attempt]}/#{data[:max_attempts]}"
end
```

### Event: `complete`

Emitted when conversion completes successfully.

```ruby
client.on(:complete) do |result|
  puts 'Conversion complete!'
  puts "Output: #{result[:output_path]}"
  puts "Size: #{result[:file_size]} bytes"
  puts "Time: #{result[:processing_time]} ms"
end
```

### Event: `error`

Emitted when an error occurs.

```ruby
client.on(:error) do |data|
  puts "Conversion failed: #{data[:error]}"
end
```

## Supported Formats

The SDK supports conversion between all formats supported by Convertorio:

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

**✨ AI-Powered OCR:**
- Extract text from any image format
- Powered by advanced AI technology
- Support for printed and handwritten text
- JSON or TXT output formats

## 🤖 AI-Powered OCR

Extract text from images with state-of-the-art AI accuracy.

### Quick OCR Example

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

### OCR Use Cases

- 📄 **Invoice Processing**: Extract structured data from invoices and receipts
- 📝 **Form Digitization**: Convert paper forms to digital data
- 📋 **Document Archival**: Make scanned documents searchable
- 🏷️ **Label Reading**: Extract text from product labels and tags
- ✍️ **Handwriting Recognition**: Digitize handwritten notes and documents

### Complete OCR Example

```ruby
require 'convertorio'
require 'json'

client = Convertorio::Client.new(api_key: 'your_api_key_here')

# Extract text as JSON with custom instructions
result = client.convert_file(
  input_path: './invoice.jpg',
  target_format: 'ocr',
  output_path: './invoice.json',
  conversion_metadata: {
    ocr_format: 'json',
    ocr_instructions: 'Extract merchant name, date, items with prices, and total amount'
  }
)

puts 'OCR completed!'
puts "Tokens used: #{result[:tokens_used]}"
puts "Output saved to: #{result[:output_path]}"

# Read the extracted text
extracted_data = JSON.parse(File.read('./invoice.json'))
puts extracted_data
```

## Advanced Conversion Options

You can control various aspects of the conversion process by passing a `conversion_metadata` hash:

### Aspect Ratio Control

Change the aspect ratio of the output image:

```ruby
client.convert_file(
  input_path: './photo.jpg',
  target_format: 'png',
  conversion_metadata: {
    aspect_ratio: '16:9',        # Target aspect ratio
    crop_strategy: 'crop-center'  # How to handle the change
  }
)
```

**Available aspect ratios:**
- `'original'` - Keep original aspect ratio (default)
- `'1:1'` - Square (Instagram, profile photos)
- `'4:3'` - Standard photo/video
- `'16:9'` - Widescreen video, HD
- `'9:16'` - Vertical/portrait video (TikTok, Stories)
- `'21:9'` - Ultra-widescreen
- Custom ratios like `'16:10'`, `'3:2'`, etc.

**Crop strategies:**
- `'fit'` - Contain image with padding (letterbox/pillarbox)
- `'crop-center'` - Crop from center
- `'crop-top'` - Crop aligned to top
- `'crop-bottom'` - Crop aligned to bottom
- `'crop-left'` - Crop aligned to left
- `'crop-right'` - Crop aligned to right

### Quality Control

Adjust compression quality for lossy formats (JPG, WebP, AVIF):

```ruby
client.convert_file(
  input_path: './photo.png',
  target_format: 'jpg',
  conversion_metadata: {
    quality: 90  # 1-100, default is 85
  }
)
```

**Quality guidelines:**
- `90-100` - Excellent quality, large files
- `80-90` - High quality, good balance (recommended)
- `70-80` - Good quality, smaller files
- `50-70` - Medium quality, small files
- `1-50` - Low quality, very small files

### ICO Format Options

When converting to ICO format, specify the icon size:

```ruby
client.convert_file(
  input_path: './logo.png',
  target_format: 'ico',
  conversion_metadata: {
    icon_size: 32,              # 16, 32, 48, 64, 128, or 256
    crop_strategy: 'crop-center' # How to make it square
  }
)
```

**Available icon sizes:** 16, 32, 48, 64, 128, 256 pixels

### Resize Control

Resize images to specific dimensions while maintaining aspect ratio:

```ruby
# Resize by width (height calculated automatically)
client.convert_file(
  input_path: './photo.jpg',
  target_format: 'jpg',
  conversion_metadata: {
    resize_width: 800  # Height will be calculated to maintain aspect ratio
  }
)

# Resize by height (width calculated automatically)
client.convert_file(
  input_path: './photo.jpg',
  target_format: 'jpg',
  conversion_metadata: {
    resize_height: 600  # Width will be calculated to maintain aspect ratio
  }
)

# Resize to exact dimensions (may distort image)
client.convert_file(
  input_path: './photo.jpg',
  target_format: 'jpg',
  conversion_metadata: {
    resize_width: 800,
    resize_height: 600  # Forces exact dimensions
  }
)
```

**Resize guidelines:**
- Specify only `resize_width` to scale by width (maintains aspect ratio)
- Specify only `resize_height` to scale by height (maintains aspect ratio)
- Specify both to force exact dimensions (may distort if ratios don't match)
- Range: 1-10000 pixels
- Can be combined with aspect ratio and crop strategy for advanced control

### Complete Example

```ruby
result = client.convert_file(
  input_path: './photo.jpg',
  target_format: 'webp',
  output_path: './output/photo-optimized.webp',
  conversion_metadata: {
    aspect_ratio: '16:9',
    crop_strategy: 'crop-center',
    quality: 85,
    resize_width: 1920  # Final width after aspect ratio change
  }
)

puts "Converted with custom options! #{result}"
```

## Examples

### Basic Conversion

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'your_api_key_here')

result = client.convert_file(
  input_path: './input.png',
  target_format: 'jpg'
)

puts "Done! #{result[:output_path]}"
```

### With Progress Events

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'your_api_key_here')

client.on(:progress) do |data|
  puts "[#{data[:step]}] #{data[:message]}"
end

client.on(:complete) do |result|
  puts '✓ Conversion completed!'
  puts "Output: #{result[:output_path]}"
end

client.convert_file(
  input_path: './photo.png',
  target_format: 'webp'
)
```

### Batch Conversion

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'your_api_key_here')

# Get all PNG files
files = Dir.glob('./images/*.png')

# Convert all to WebP
files.each do |file|
  client.convert_file(
    input_path: file,
    target_format: 'webp'
  )
  puts "Converted: #{file}"
end
```

### Error Handling

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'your_api_key_here')

begin
  result = client.convert_file(
    input_path: './image.png',
    target_format: 'jpg'
  )
  puts "Success: #{result[:output_path]}"
rescue Convertorio::FileNotFoundError => e
  puts "Input file does not exist: #{e.message}"
rescue Convertorio::APIError => e
  puts "API error: #{e.message}"
  puts "Not enough points/credits" if e.message.include?('Insufficient')
rescue Convertorio::ConversionTimeoutError => e
  puts "Conversion took too long: #{e.message}"
rescue Convertorio::Error => e
  puts "Conversion failed: #{e.message}"
end
```

## Rate Limiting

The API has the following rate limits:
- **1 request per second** per IP address
- **5 concurrent jobs** maximum per user

The SDK automatically handles rate limiting by polling job status with appropriate delays.

## Error Handling

Common errors you might encounter:

| Error | Description | Solution |
|-------|-------------|----------|
| `Convertorio::Error` | API key missing | Provide your API key in the config |
| `Convertorio::FileNotFoundError` | File doesn't exist | Check the file path |
| `Convertorio::APIError` | API request failed | Check error message for details |
| `Convertorio::ConversionTimeoutError` | Job took too long | Try again or contact support |

**API Error Messages:**
- `Invalid API key` - Wrong or expired API key (verify in account settings)
- `Insufficient credits` - Not enough points (purchase more or use free tier)
- `File size exceeds limit` - Maximum file size is 20 MB
- `Unsupported format` - Format not supported

## Best Practices

1. **Reuse the client instance** - Don't create a new client for each conversion
2. **Use events for long conversions** - Monitor progress instead of just waiting
3. **Handle errors gracefully** - Always use rescue blocks for conversions
4. **Respect rate limits** - Use batch processing with delays if converting many files
5. **Check file sizes** - Maximum file size is 20 MB
6. **Validate formats** - Check that the target format is supported

## Development

After checking out the repo, run `bundle install` to install dependencies. Then, run `rake spec` to run the tests.

To install this gem onto your local machine, run `bundle exec rake install`.

To release a new version, update the version number in `convertorio-sdk.gemspec`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Support

- **Documentation:** [https://convertorio.com/docs](https://convertorio.com/docs)
- **API Reference:** [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Support:** [support@convertorio.com](mailto:support@convertorio.com)
- **GitHub Issues:** [https://github.com/convertorio/sdk/issues](https://github.com/convertorio/sdk/issues)

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
