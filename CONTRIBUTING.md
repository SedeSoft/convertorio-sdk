# Contributing to Convertorio SDK

Thank you for your interest in contributing to the Convertorio SDK! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Your environment (OS, language version, SDK version)
- Code samples if applicable

### Suggesting Features

We're always looking for ways to improve the SDK. To suggest a feature:
- Open an issue with the "feature request" label
- Describe the feature and its use case
- Explain why it would be valuable
- Provide examples of how it would be used

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Write/update tests** if applicable
5. **Update documentation** if needed
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to your branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Pull Request Guidelines

- Write clear, descriptive commit messages
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep PRs focused on a single feature/fix
- Reference any related issues

## Development Setup

### Node.js SDK

```bash
cd libs/nodejs
npm install
npm test
```

### Python SDK (Coming Soon)

```bash
cd libs/python
pip install -e .
pytest
```

### PHP SDK (Coming Soon)

```bash
cd libs/php
composer install
composer test
```

## Code Style

### Node.js
- Use ES6+ features
- Follow StandardJS style
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Python
- Follow PEP 8
- Use type hints
- Add docstrings for all public functions

### PHP
- Follow PSR-12
- Use type declarations
- Add PHPDoc blocks

## Testing

All new features should include tests:

```bash
# Node.js
npm test

# Python
pytest

# PHP
composer test
```

## Documentation

When adding new features:
1. Update the README
2. Add examples to the examples directory
3. Update API documentation
4. Add inline code comments

## Adding Support for a New Language

To add a new language SDK:

1. Create directory structure:
   ```
   libs/[language]/
   examples/[language]/
   docs/[language]/
   ```

2. Implement core functionality:
   - Client initialization
   - File conversion
   - Event handling (if applicable)
   - Error handling

3. Add examples demonstrating:
   - Basic usage
   - Event listeners
   - Batch conversion
   - Error handling

4. Write comprehensive documentation

5. Update main README.md

## Questions?

Feel free to open an issue for any questions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
