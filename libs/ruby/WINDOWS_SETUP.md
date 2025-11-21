# Setting Up Ruby on Windows for Convertorio SDK

This guide explains how to install Ruby on Windows and test the Convertorio SDK.

## Installing Ruby on Windows

### Option 1: RubyInstaller (Recommended)

1. **Download RubyInstaller**
   - Visit [https://rubyinstaller.org/downloads/](https://rubyinstaller.org/downloads/)
   - Download **Ruby+Devkit 3.2.X (x64)** - the latest stable version
   - File will be named something like: `rubyinstaller-devkit-3.2.2-1-x64.exe`

2. **Run the Installer**
   - Double-click the downloaded installer
   - Accept the license agreement
   - **Important:** Check all boxes:
     - ✅ Add Ruby executables to your PATH
     - ✅ Associate .rb and .rbw files with this Ruby installation
     - ✅ Use UTF-8 as default external encoding
   - Click "Install"

3. **MSYS2 Setup**
   - At the end of installation, a command prompt will open
   - Choose option **3** (MSYS2 and MINGW development toolchain)
   - Press Enter and wait for installation to complete
   - This installs essential build tools

4. **Verify Installation**
   - Open a new Command Prompt or PowerShell
   - Run these commands:
   ```cmd
   ruby --version
   # Should show: ruby 3.2.x

   gem --version
   # Should show: 3.4.x or similar
   ```

### Option 2: Windows Subsystem for Linux (WSL)

If you prefer a Linux environment:

1. **Enable WSL**
   ```powershell
   # Run PowerShell as Administrator
   wsl --install
   ```

2. **Install Ubuntu**
   - Open Microsoft Store
   - Search for "Ubuntu"
   - Install Ubuntu 22.04 LTS

3. **Install Ruby in WSL**
   ```bash
   sudo apt update
   sudo apt install ruby-full build-essential
   ruby --version
   ```

## Installing Bundler

After Ruby is installed:

```cmd
gem install bundler
```

Verify:
```cmd
bundle --version
```

## Testing the Convertorio SDK

### 1. Navigate to Test Directory

```cmd
cd C:\GitRepos\convertorio-com\sdk\tests\ruby
```

### 2. Install Dependencies

```cmd
bundle install
```

This will install:
- `rspec` - Testing framework
- `webmock` - HTTP mocking for tests
- `httparty` - HTTP client
- And other dependencies

### 3. Run the Tests

```cmd
bundle exec rspec
```

Expected output:
```
Convertorio::Client
  #initialize
    creates a client with valid API key
    allows custom base URL
    raises error when API key is missing
    raises error when API key is empty
  #on
    registers event callbacks
    allows multiple callbacks for same event
  #get_account
    retrieves account information
    raises error on failed request
  #list_jobs
    lists jobs with default parameters
    accepts custom parameters
  #get_job
    retrieves job details
  #convert_file
    converts a file successfully
    raises error when input_path is missing
    raises error when target_format is missing
    raises error when file does not exist
    accepts conversion metadata
    emits start event
    emits progress events
    emits complete event
    emits error event on failure
  error handling
    handles conversion timeout
    handles failed job
    handles expired job

Finished in 0.5 seconds (files took 0.2 seconds to load)
22 examples, 0 failures
```

### 4. Run with Verbose Output

```cmd
bundle exec rspec --format documentation
```

### 5. Run Specific Tests

```cmd
# Run specific test file
bundle exec rspec spec/convertorio_spec.rb

# Run specific line
bundle exec rspec spec/convertorio_spec.rb:42
```

## Testing Examples

### 1. Navigate to Examples

```cmd
cd C:\GitRepos\convertorio-com\sdk\examples\ruby
```

### 2. Install Dependencies

```cmd
bundle install
```

### 3. Update API Key

Edit any example file and replace:
```ruby
api_key: 'your_api_key_here'
```

With your actual API key from [convertorio.com/account](https://convertorio.com/account)

### 4. Prepare Test Image

Create a test image or copy one to the examples directory:
```cmd
# For basic_conversion.rb, you need:
# - input.png

# For advanced_options.rb, you need:
# - photo.jpg
# - logo.png
```

### 5. Run Examples

```cmd
ruby basic_conversion.rb
ruby with_events.rb
ruby account_info.rb
ruby advanced_options.rb
```

## Building the Gem Locally

### 1. Navigate to SDK Directory

```cmd
cd C:\GitRepos\convertorio-com\sdk\libs\ruby
```

### 2. Install Dependencies

```cmd
bundle install
```

### 3. Build the Gem

```cmd
bundle exec rake build
```

This creates: `convertorio-sdk-1.2.0.gem`

### 4. Install Locally

```cmd
gem install .\convertorio-sdk-1.2.0.gem
```

### 5. Test Installation

Create a test file `test_sdk.rb`:
```ruby
require 'convertorio'

client = Convertorio::Client.new(api_key: 'test_key')
puts "✓ SDK loaded successfully!"
puts "Client class: #{client.class}"
puts "API key: #{client.api_key}"
```

Run it:
```cmd
ruby test_sdk.rb
```

## Troubleshooting

### Issue: "bundle: command not found"

**Solution:**
```cmd
gem install bundler
# Then try again
bundle install
```

### Issue: "Could not locate Gemfile"

**Solution:** Make sure you're in the correct directory:
```cmd
cd C:\GitRepos\convertorio-com\sdk\tests\ruby
# Should see: Gemfile, spec/, etc.
```

### Issue: SSL Certificate Errors

**Solution:**
```cmd
# Update RubyGems
gem update --system

# Or download and install manually
# Download from: https://rubygems.org/pages/download
```

### Issue: Permission Errors

**Solution:** Run Command Prompt or PowerShell as Administrator

### Issue: PATH Not Updated

**Solution:**
1. Close all command prompts
2. Reopen a new command prompt
3. Or manually add to PATH:
   - Open System Properties → Environment Variables
   - Add: `C:\Ruby32-x64\bin` to PATH

### Issue: Tests Fail with WebMock Error

**Solution:**
```cmd
bundle update webmock
bundle exec rspec
```

### Issue: HTTParty SSL Errors

**Solution:**
```cmd
# Install SSL certificates
gem install certified
```

## Alternative: Using Docker

If you prefer not to install Ruby on Windows:

### 1. Install Docker Desktop

Download from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)

### 2. Create Dockerfile

Create `Dockerfile` in `sdk/tests/ruby/`:
```dockerfile
FROM ruby:3.2-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache build-base

# Copy Gemfile
COPY Gemfile ./
RUN bundle install

# Copy test files
COPY . .

CMD ["bundle", "exec", "rspec"]
```

### 3. Build and Run

```cmd
cd C:\GitRepos\convertorio-com\sdk\tests\ruby
docker build -t convertorio-ruby-tests .
docker run --rm convertorio-ruby-tests
```

## Using VS Code

### 1. Install VS Code Extensions

- Ruby
- Ruby Solargraph
- Ruby Test Explorer

### 2. Configure VS Code

Create `.vscode/settings.json`:
```json
{
  "ruby.useLanguageServer": true,
  "ruby.lint": {
    "rubocop": true
  },
  "ruby.format": "rubocop"
}
```

### 3. Run Tests from VS Code

- Open Command Palette (Ctrl+Shift+P)
- Type "Ruby: Run Test"
- Select test to run

## PowerShell Commands

If using PowerShell, use these commands:

```powershell
# Navigate
Set-Location C:\GitRepos\convertorio-com\sdk\tests\ruby

# Install dependencies
bundle install

# Run tests
bundle exec rspec

# Run with verbose output
bundle exec rspec --format documentation

# Run specific test
bundle exec rspec spec/convertorio_spec.rb

# Build gem
Set-Location C:\GitRepos\convertorio-com\sdk\libs\ruby
bundle exec rake build

# Install gem
gem install .\convertorio-sdk-1.2.0.gem
```

## Next Steps

After successful testing:

1. ✅ All tests passing
2. ✅ Examples working with real API
3. ✅ Gem builds successfully
4. ✅ Ready for publication to RubyGems

See [PUBLISHING.md](PUBLISHING.md) for publication instructions.

## Support

For issues:
- GitHub Issues: [github.com/SedeSoft/convertorio-sdk/issues](https://github.com/SedeSoft/convertorio-sdk/issues)
- Email: [support@convertorio.com](mailto:support@convertorio.com)
- Documentation: [convertorio.com/docs](https://convertorio.com/docs)

## Additional Resources

- RubyInstaller: [https://rubyinstaller.org/](https://rubyinstaller.org/)
- Bundler Documentation: [https://bundler.io/](https://bundler.io/)
- RSpec Documentation: [https://rspec.info/](https://rspec.info/)
- Ruby on Windows: [https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller](https://www.ruby-lang.org/en/documentation/installation/#rubyinstaller)
