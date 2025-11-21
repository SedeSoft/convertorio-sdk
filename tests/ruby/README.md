# Convertorio Ruby SDK - Tests

This directory contains the test suite for the Convertorio Ruby SDK.

## Test Framework

The tests use:
- **RSpec** - Testing framework
- **WebMock** - HTTP request stubbing and mocking

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   cd sdk/tests/ruby
   bundle install
   ```

### Run All Tests

```bash
bundle exec rspec
```

Or using rake:

```bash
bundle exec rake spec
```

### Run Specific Test File

```bash
bundle exec rspec spec/convertorio_spec.rb
```

### Run Tests with Verbose Output

```bash
bundle exec rspec --format documentation
```

### Run Tests with Coverage

```bash
bundle exec rake coverage
```

## Test Structure

```
tests/ruby/
├── spec/
│   ├── spec_helper.rb          # Test configuration
│   └── convertorio_spec.rb     # Main test suite
├── Gemfile                      # Test dependencies
├── Rakefile                     # Rake tasks
└── .rspec                       # RSpec configuration
```

## Test Coverage

The test suite covers:

### Client Initialization
- ✅ Valid API key
- ✅ Custom base URL
- ✅ Missing API key error
- ✅ Empty API key error

### Event System
- ✅ Registering event callbacks
- ✅ Multiple callbacks per event
- ✅ Event emission

### Account Operations
- ✅ Getting account information
- ✅ Error handling for failed requests

### Job Operations
- ✅ Listing jobs with default parameters
- ✅ Listing jobs with custom parameters
- ✅ Getting job details by ID

### File Conversion
- ✅ Successful conversion
- ✅ Missing input_path error
- ✅ Missing target_format error
- ✅ File not found error
- ✅ Conversion metadata support
- ✅ Event emissions (start, progress, complete, error)

### Error Handling
- ✅ Conversion timeout
- ✅ Failed jobs
- ✅ Expired jobs
- ✅ API errors

## Writing New Tests

When adding new features, follow this pattern:

```ruby
RSpec.describe Convertorio::Client do
  let(:client) { described_class.new(api_key: 'test_key') }

  describe '#new_feature' do
    it 'does something expected' do
      # Stub HTTP requests
      stub_request(:get, /api\.convertorio\.com/)
        .to_return(status: 200, body: { success: true }.to_json)

      # Execute
      result = client.new_feature

      # Assert
      expect(result).to be_truthy
    end

    it 'handles errors appropriately' do
      stub_request(:get, /api\.convertorio\.com/)
        .to_return(status: 500)

      expect {
        client.new_feature
      }.to raise_error(Convertorio::Error)
    end
  end
end
```

## Mocking HTTP Requests

Use WebMock to stub API calls:

```ruby
# Stub a successful request
stub_request(:post, "https://api.convertorio.com/v1/endpoint")
  .with(
    headers: { 'Authorization' => 'Bearer test_key' },
    body: { param: 'value' }.to_json
  )
  .to_return(
    status: 200,
    body: { success: true, data: 'result' }.to_json
  )

# Stub an error response
stub_request(:get, "https://api.convertorio.com/v1/endpoint")
  .to_return(
    status: 200,
    body: { success: false, error: 'Error message' }.to_json
  )
```

## Continuous Integration

The test suite is designed to run in CI environments. Example GitHub Actions workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        ruby-version: ['2.7', '3.0', '3.1', '3.2']

    steps:
    - uses: actions/checkout@v3
    - uses: ruby/setup-ruby@v1
      with:
        ruby-version: ${{ matrix.ruby-version }}
        bundler-cache: true

    - name: Run tests
      run: |
        cd sdk/tests/ruby
        bundle install
        bundle exec rspec
```

## Troubleshooting

**Bundler can't find gemspec:**
Make sure you're running tests from the `sdk/tests/ruby` directory.

**WebMock not allowing real HTTP:**
This is intentional. All HTTP requests should be stubbed in tests. If you need to make real requests, add:
```ruby
WebMock.allow_net_connect!
```

**Tests failing with 'uninitialized constant':**
Make sure `spec_helper.rb` is being required and all dependencies are installed.

## Contributing

When contributing new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain test coverage above 90%
4. Follow existing test patterns
5. Document any special test setup needed

## Support

For issues with tests or contributing:
- Open an issue: [https://github.com/convertorio/sdk/issues](https://github.com/convertorio/sdk/issues)
- Email: [support@convertorio.com](mailto:support@convertorio.com)
