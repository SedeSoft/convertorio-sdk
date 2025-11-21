# Testing Guide for Convertorio Ruby SDK

This guide explains how to test the Convertorio Ruby SDK.

## Prerequisites

### Install Ruby

**On Windows:**
1. Download Ruby installer from [rubyinstaller.org](https://rubyinstaller.org/)
2. Run the installer (recommend Ruby 3.2.x with MSYS2)
3. Verify installation:
   ```bash
   ruby --version
   gem --version
   ```

**On macOS:**
```bash
# Using Homebrew
brew install ruby

# Or using rbenv (recommended)
brew install rbenv
rbenv install 3.2.0
rbenv global 3.2.0
```

**On Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ruby-full

# Or using rbenv (recommended)
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc
rbenv install 3.2.0
rbenv global 3.2.0
```

### Install Bundler

```bash
gem install bundler
```

## Running Tests

### 1. Install Test Dependencies

Navigate to the test directory and install dependencies:

```bash
cd sdk/tests/ruby
bundle install
```

### 2. Run All Tests

```bash
bundle exec rspec
```

Expected output:
```
Convertorio::Client
  #initialize
    ✓ creates a client with valid API key
    ✓ allows custom base URL
    ✓ raises error when API key is missing
    ✓ raises error when API key is empty
  #on
    ✓ registers event callbacks
    ✓ allows multiple callbacks for same event
  #get_account
    ✓ retrieves account information
    ✓ raises error on failed request
  #list_jobs
    ✓ lists jobs with default parameters
    ✓ accepts custom parameters
  #get_job
    ✓ retrieves job details
  #convert_file
    ✓ converts a file successfully
    ✓ raises error when input_path is missing
    ✓ raises error when target_format is missing
    ✓ raises error when file does not exist
    ✓ accepts conversion metadata
    ✓ emits start event
    ✓ emits progress events
    ✓ emits complete event
    ✓ emits error event on failure
  error handling
    ✓ handles conversion timeout
    ✓ handles failed job
    ✓ handles expired job

Finished in 0.5 seconds (files took 0.2 seconds to load)
22 examples, 0 failures
```

### 3. Run Specific Tests

```bash
# Run specific test file
bundle exec rspec spec/convertorio_spec.rb

# Run specific test line
bundle exec rspec spec/convertorio_spec.rb:10

# Run tests matching a pattern
bundle exec rspec spec/convertorio_spec.rb -e "convert_file"
```

### 4. Run Tests with Verbose Output

```bash
bundle exec rspec --format documentation
```

### 5. Run Tests with Coverage (if SimpleCov is configured)

```bash
bundle exec rake coverage
```

## Manual Testing

If you want to test the SDK manually without running the full test suite:

### 1. Install the Gem Locally

```bash
cd sdk/libs/ruby
bundle install
bundle exec rake build
bundle exec rake install
```

### 2. Create a Test Script

Create a file `manual_test.rb`:

```ruby
#!/usr/bin/env ruby

require 'convertorio'

# Initialize client
client = Convertorio::Client.new(
  api_key: 'your_actual_api_key_here'
)

# Add event listeners
client.on(:start) do |data|
  puts "🚀 Starting: #{data[:file_name]}"
end

client.on(:progress) do |data|
  puts "⏳ #{data[:message]}"
end

client.on(:complete) do |data|
  puts "✅ Complete: #{data[:output_path]}"
end

client.on(:error) do |data|
  puts "❌ Error: #{data[:error]}"
end

# Test conversion
begin
  # Create a test image (or use an existing one)
  # You'll need an actual image file for this test

  result = client.convert_file(
    input_path: './test_image.png',
    target_format: 'jpg'
  )

  puts "\nResult:"
  puts "  Job ID: #{result[:job_id]}"
  puts "  Input: #{result[:input_path]}"
  puts "  Output: #{result[:output_path]}"
  puts "  Format: #{result[:source_format]} → #{result[:target_format]}"
  puts "  Size: #{result[:file_size]} bytes"
  puts "  Time: #{result[:processing_time]} ms"

rescue Convertorio::Error => e
  puts "Error: #{e.message}"
end
```

### 3. Run the Test Script

```bash
ruby manual_test.rb
```

## Testing Individual Components

### Test Client Initialization

```ruby
require 'convertorio'

# Should work
client = Convertorio::Client.new(api_key: 'test_key')
puts "✓ Client created: #{client.class}"

# Should fail
begin
  client = Convertorio::Client.new(api_key: nil)
rescue Convertorio::Error => e
  puts "✓ Error caught: #{e.message}"
end
```

### Test Event System

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'test_key')

callback_triggered = false
client.on(:test_event) do |data|
  callback_triggered = true
  puts "✓ Callback triggered with: #{data}"
end

# Manually trigger event (for testing)
client.send(:emit, :test_event, { message: 'test' })

puts callback_triggered ? "✓ Event system works" : "✗ Event system failed"
```

### Test Path Generation

```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'test_key')

input = './test.png'
output = client.send(:generate_output_path, input, 'jpg')
expected = './test.jpg'

puts output == expected ? "✓ Path generation works" : "✗ Path generation failed"
puts "  Input: #{input}"
puts "  Output: #{output}"
puts "  Expected: #{expected}"
```

## Testing with Real API

To test with the actual Convertorio API:

1. **Get an API Key**
   - Sign up at [convertorio.com](https://convertorio.com)
   - Go to [Account Settings](https://convertorio.com/account)
   - Generate an API key

2. **Set Environment Variable**
   ```bash
   export CONVERTORIO_API_KEY='your_actual_key_here'
   ```

3. **Run Examples**
   ```bash
   cd sdk/examples/ruby
   bundle install

   # Update the API key in the example files, then run:
   ruby basic_conversion.rb
   ruby with_events.rb
   ruby account_info.rb
   ```

## Troubleshooting

### Bundle Install Fails

```bash
# Update bundler
gem update bundler

# Clear gem cache
rm -rf vendor/bundle
bundle install
```

### Tests Fail Due to WebMock

Make sure WebMock is properly configured in `spec_helper.rb`:

```ruby
require 'webmock/rspec'
WebMock.disable_net_connect!(allow_localhost: true)
```

### Ruby Version Issues

Check Ruby version:
```bash
ruby --version
```

The SDK requires Ruby >= 2.7.0. Upgrade if needed:
```bash
# Using rbenv
rbenv install 3.2.0
rbenv global 3.2.0

# Using rvm
rvm install 3.2.0
rvm use 3.2.0 --default
```

### Permission Errors

On Linux/macOS, you might need to use:
```bash
gem install bundler --user-install
```

Or use a Ruby version manager (rbenv/rvm) instead of system Ruby.

## Continuous Integration

The tests are designed to run in CI environments. Example GitHub Actions:

```yaml
name: Ruby Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        ruby-version: ['2.7', '3.0', '3.1', '3.2']

    steps:
    - uses: actions/checkout@v3

    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: ${{ matrix.ruby-version }}
        bundler-cache: true

    - name: Install dependencies
      run: |
        cd sdk/tests/ruby
        bundle install

    - name: Run tests
      run: |
        cd sdk/tests/ruby
        bundle exec rspec
```

## Performance Testing

For performance testing:

```ruby
require 'benchmark'
require 'convertorio'

client = Convertorio::Client.new(api_key: 'test_key')

time = Benchmark.measure do
  # Your test code here
end

puts "Execution time: #{time.real} seconds"
```

## Next Steps

After tests pass:
1. Review code coverage
2. Test examples with real API
3. Test on different Ruby versions
4. Test on different operating systems
5. Prepare for release

## Support

For testing issues:
- Check [GitHub Issues](https://github.com/SedeSoft/convertorio-sdk/issues)
- Email: [support@convertorio.com](mailto:support@convertorio.com)
