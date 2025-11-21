# Contributing to Convertorio Ruby SDK

Thank you for your interest in contributing to the Convertorio Ruby SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [GitHub Issues](https://github.com/SedeSoft/convertorio-sdk/issues)
2. If not, create a new issue with:
   - Clear, descriptive title
   - Detailed description of the bug
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Ruby version and OS
   - SDK version
   - Code samples (if applicable)

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create a new issue with:
   - Clear, descriptive title
   - Detailed description of the enhancement
   - Use cases and benefits
   - Proposed implementation (if you have ideas)

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/SedeSoft/convertorio-sdk.git
   cd convertorio-sdk/libs/ruby
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow Ruby style conventions
   - Add/update tests for your changes
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   bundle install
   bundle exec rspec
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add descriptive commit message"
   ```

   Follow these commit message guidelines:
   - Use present tense ("Add feature" not "Added feature")
   - Use imperative mood ("Move cursor to..." not "Moves cursor to...")
   - Limit first line to 72 characters
   - Reference issues and pull requests when relevant

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link related issues

## Development Setup

1. **Install Ruby**
   - Ruby 2.7.0 or higher
   - Use rbenv or rvm for version management

2. **Install Dependencies**
   ```bash
   cd sdk/libs/ruby
   bundle install
   ```

3. **Run Tests**
   ```bash
   bundle exec rspec
   ```

4. **Run Tests with Coverage**
   ```bash
   bundle exec rake coverage
   ```

5. **Build the Gem Locally**
   ```bash
   bundle exec rake build
   ```

6. **Install Locally for Testing**
   ```bash
   bundle exec rake install
   ```

## Coding Standards

### Ruby Style Guide

Follow the [Ruby Style Guide](https://rubystyle.guide/):

- Use 2 spaces for indentation (no tabs)
- Use snake_case for methods and variables
- Use CamelCase for classes and modules
- Maximum line length of 120 characters
- Use meaningful variable names

### Code Organization

```ruby
# Good
class ConvertorioClient
  def initialize(api_key:, base_url: DEFAULT_URL)
    @api_key = api_key
    @base_url = base_url
  end

  def convert_file(input_path:, target_format:, **options)
    # Implementation
  end

  private

  def validate_input(input_path)
    # Implementation
  end
end
```

### Documentation

Use YARD for documentation:

```ruby
# Convert an image file
#
# @param input_path [String] Path to the input file (required)
# @param target_format [String] Target format (required)
# @param output_path [String] Output path (optional)
#
# @return [Hash] Conversion result
#
# @example
#   client.convert_file(
#     input_path: './image.png',
#     target_format: 'jpg'
#   )
#
def convert_file(input_path:, target_format:, output_path: nil)
  # Implementation
end
```

## Testing

### Writing Tests

- Use RSpec for testing
- Follow the existing test structure
- Aim for >90% code coverage
- Test both success and failure cases
- Use WebMock for HTTP stubbing

```ruby
RSpec.describe Convertorio::Client do
  describe '#convert_file' do
    it 'converts a file successfully' do
      # Arrange
      stub_request(:post, /api\.convertorio\.com/)
        .to_return(status: 200, body: { success: true }.to_json)

      # Act
      result = client.convert_file(
        input_path: 'test.png',
        target_format: 'jpg'
      )

      # Assert
      expect(result[:success]).to be true
    end

    it 'raises error on invalid input' do
      expect {
        client.convert_file(input_path: nil, target_format: 'jpg')
      }.to raise_error(Convertorio::Error)
    end
  end
end
```

### Running Specific Tests

```bash
# Run all tests
bundle exec rspec

# Run specific file
bundle exec rspec spec/convertorio_spec.rb

# Run specific test
bundle exec rspec spec/convertorio_spec.rb:42

# Run with verbose output
bundle exec rspec --format documentation
```

## Documentation

### Updating README

- Keep examples up to date
- Document all public methods
- Include code examples
- Update table of contents if needed

### YARD Documentation

Generate documentation:

```bash
yard doc
yard server
```

View at http://localhost:8808

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

Update version in:
1. `convertorio-sdk.gemspec`
2. `CHANGELOG.md`

## Release Process

See [PUBLISHING.md](PUBLISHING.md) for detailed release instructions.

Quick checklist:
1. Update version number
2. Update CHANGELOG.md
3. Run all tests
4. Commit changes
5. Create git tag
6. Build gem
7. Publish to RubyGems

## Questions?

- Open an issue for general questions
- Email: support@convertorio.com
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions help make Convertorio better for everyone. We appreciate your time and effort!
