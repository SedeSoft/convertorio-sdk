# Convertorio Ruby SDK - Examples

This directory contains example scripts demonstrating how to use the Convertorio Ruby SDK.

## Prerequisites

1. Install the SDK:
   ```bash
   gem install convertorio-sdk
   ```

2. Get your API key from [convertorio.com/account](https://convertorio.com/account)

3. Update each example file with your API key

## Examples

### 1. Basic Conversion (`basic_conversion.rb`)

Simple example showing how to convert a single image file.

```bash
ruby basic_conversion.rb
```

**What it demonstrates:**
- Initializing the client
- Basic file conversion
- Handling the conversion result

### 2. With Events (`with_events.rb`)

Shows how to use event callbacks to track conversion progress in real-time.

```bash
ruby with_events.rb
```

**What it demonstrates:**
- Setting up event listeners
- Tracking conversion progress
- Monitoring job status
- Handling completion and errors

### 3. Batch Conversion (`batch_conversion.rb`)

Demonstrates converting multiple files from a directory.

```bash
ruby batch_conversion.rb
```

**What it demonstrates:**
- Processing multiple files
- Error handling for batch operations
- Progress tracking for multiple conversions
- Success/failure statistics

### 4. Account Info (`account_info.rb`)

Shows how to retrieve account information and list conversion jobs.

```bash
ruby account_info.rb
```

**What it demonstrates:**
- Getting account details
- Listing recent jobs
- Filtering jobs by status
- Calculating statistics

### 5. Advanced Options (`advanced_options.rb`)

Demonstrates using advanced conversion options like aspect ratio, quality, and resizing.

```bash
ruby advanced_options.rb
```

**What it demonstrates:**
- Aspect ratio conversion (16:9, 1:1, 9:16)
- Quality control
- ICO format conversion
- Image resizing
- Combining multiple options
- Social media optimizations

## Running the Examples

1. Make sure you have test images ready:
   - `input.png` - For basic examples
   - `photo.jpg` - For advanced examples
   - `logo.png` - For ICO conversion
   - `./images/` directory with PNG files - For batch conversion

2. Update the API key in each example file:
   ```ruby
   client = Convertorio::Client.new(
     api_key: 'your_actual_api_key_here'
   )
   ```

3. Run any example:
   ```bash
   ruby basic_conversion.rb
   ruby with_events.rb
   ruby batch_conversion.rb
   ruby account_info.rb
   ruby advanced_options.rb
   ```

## Common Issues

**"Input file not found" error:**
- Make sure the input files exist in the current directory
- Update the file paths in the examples to match your setup

**"Invalid API key" error:**
- Verify your API key at [convertorio.com/account](https://convertorio.com/account)
- Make sure you've replaced `'your_api_key_here'` with your actual key

**"Insufficient credits" error:**
- Check your account balance
- Free tier includes daily conversions
- Consider upgrading your plan for more conversions

## Support

- Documentation: [https://convertorio.com/docs](https://convertorio.com/docs)
- API Reference: [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- Support: [support@convertorio.com](mailto:support@convertorio.com)
