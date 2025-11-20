# Convertorio SDK

Official SDKs for the Convertorio API - Convert images between 20+ formats with ease.

## 🌟 Features

- ✅ Simple, intuitive APIs
- ✅ Support for 20+ image formats
- ✅ Automatic file upload and download
- ✅ Event-driven progress tracking
- ✅ Comprehensive error handling
- ✅ TypeScript support
- ✅ Well documented with examples

## 📦 Supported Languages

| Language | Status | Documentation | Package |
|----------|--------|---------------|---------|
| **Node.js** | ✅ Available | [docs/nodejs](./docs/nodejs/README.md) | `convertorio-sdk` |
| **Python** | ✅ Available | [docs/python](./docs/python/README.md) | `convertorio-sdk` |
| **PHP** | ✅ Available | [README-PHP.md](./README-PHP.md) | `convertorio/sdk` |
| Go | 🚧 Coming Soon | - | - |
| Ruby | 🚧 Coming Soon | - | - |
| Java | 🚧 Coming Soon | - | - |
| .NET/C# | 🚧 Coming Soon | - | - |

## 🚀 Quick Start

### Node.js

```bash
npm install convertorio-sdk
```

```javascript
const ConvertorioClient = require('convertorio-sdk');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

const result = await client.convertFile({
    inputPath: './image.png',
    targetFormat: 'jpg'
});

console.log('Converted!', result.outputPath);
```

[**→ Full Node.js Documentation**](./docs/nodejs/README.md)

### Python

```bash
pip install convertorio-sdk
```

```python
from convertorio_sdk import ConvertorioClient

client = ConvertorioClient(api_key='your_api_key_here')

result = client.convert_file(
    input_path='./image.png',
    target_format='jpg'
)

print(f"Converted! {result['output_path']}")
```

[**→ Full Python Documentation**](./docs/python/README.md)

### PHP

```bash
composer require convertorio/sdk
```

```php
<?php

require 'vendor/autoload.php';

use Convertorio\SDK\ConvertorioClient;

$client = new ConvertorioClient('your_api_key_here');

$result = $client->convertFile(
    './image.png',
    'jpg'
);

echo "Converted! {$result['output_path']}";
```

[**→ Full PHP Documentation**](./README-PHP.md)

## 📖 Language-Specific Documentation

### Node.js (JavaScript/TypeScript)

The Node.js SDK provides a simple, promise-based API with event support for tracking conversion progress.

**Installation:**
```bash
npm install convertorio-sdk
```

**Features:**
- Promise-based async/await API
- Event emitters for progress tracking
- TypeScript definitions included
- Automatic file handling

**[→ View Node.js Documentation](./docs/nodejs/README.md)**

**[→ View Node.js Examples](./examples/nodejs/)**

---

### Python

The Python SDK provides an intuitive API with event callbacks for tracking conversion progress.

**Installation:**
```bash
pip install convertorio-sdk
```

**Features:**
- Simple, synchronous API
- Event callbacks for progress tracking
- Type hints for IDE support
- Automatic file handling

**[→ View Python Documentation](./docs/python/README.md)**

**[→ View Python Examples](./examples/python/)**

---

### PHP

The PHP SDK provides a clean, PSR-4 compliant API with event callbacks for tracking conversion progress.

**Installation:**
```bash
composer require convertorio/sdk
```

**Features:**
- PSR-4 autoloading
- Event callbacks for progress tracking
- Compatible with modern PHP frameworks
- Automatic file handling
- Supports PHP 7.4+

**[→ View PHP Documentation](./README-PHP.md)**

**[→ View PHP Examples](./examples.php)**

---

### Other Languages

We're working on SDKs for Go, Ruby, Java, and .NET.

Want to see support for another language? [Open an issue](https://github.com/convertorio/sdk/issues) or contribute!

## 🔑 Getting Started

### 1. Get Your API Key

1. Sign up at [convertorio.com](https://convertorio.com)
2. Go to your [Account Settings](https://convertorio.com/account)
3. Generate an API key

### 2. Install the SDK

Choose your preferred language and follow the installation instructions in the language-specific documentation.

### 3. Start Converting

Check out the examples in the `examples/` directory for your chosen language.

## 🎯 Supported Formats

Convert between 20+ image formats:

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

## 📊 API Limits

| Plan | Daily Free Conversions | Rate Limit | Concurrent Jobs | Max File Size |
|------|----------------------|------------|----------------|---------------|
| Free | 2 per day | 1 req/sec | 5 | 20 MB |
| Paid | Unlimited* | 1 req/sec | 5 | 20 MB |

*With purchased points

## 📁 Repository Structure

```
sdk/
├── src/               # PHP SDK source (root level for Packagist)
│   └── ConvertorioClient.php
├── libs/              # SDK implementations
│   ├── nodejs/        # Node.js SDK
│   ├── python/        # Python SDK
│   └── php/           # PHP SDK
├── examples/          # Usage examples
│   ├── nodejs/        # Node.js examples
│   ├── python/        # Python examples
│   └── php/           # PHP examples
├── test/              # Test suites
│   ├── nodejs/        # Node.js tests
│   ├── python/        # Python tests
│   └── php/           # PHP tests
├── docs/              # Documentation
│   ├── nodejs/        # Node.js documentation
│   ├── python/        # Python documentation
│   └── php/           # PHP documentation
├── composer.json      # PHP package config (root level)
├── examples.php       # PHP examples (root level)
├── README.md          # This file
└── README-PHP.md      # PHP documentation
```

## 🛠️ Development

### Building from Source

Each language SDK can be built independently. See the language-specific README for build instructions.

### Running Examples

Navigate to the examples directory for your language:

```bash
# Node.js examples
cd examples/nodejs
node basic-conversion.js

# Python examples
cd examples/python
python basic_conversion.py

# PHP examples
php examples.php
```

### Testing

```bash
# Node.js
cd libs/nodejs
npm test

# Python
cd test/python/simple-convert
python simple-test.py
python test-resize.py
python test-with-metadata.py

# PHP
cd test/php/simple-convert
php simple-test.php
php test-resize.php
php test-with-metadata.php
```

## 📚 Resources

- **Main Website:** [convertorio.com](https://convertorio.com)
- **API Documentation:** [convertorio.com/api-docs](https://convertorio.com/api-docs)
- **Support:** [support@convertorio.com](mailto:support@convertorio.com)
- **GitHub Repository:** [github.com/convertorio/sdk](https://github.com/convertorio/sdk)

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** - Open an issue describing the problem
2. **Suggest features** - Open an issue with your feature request
3. **Submit pull requests** - Fork, make changes, and submit a PR
4. **Improve documentation** - Help make the docs better
5. **Add SDK for new language** - Implement SDK for a language we don't support yet

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

All SDKs are released under the MIT License. See [LICENSE](./LICENSE) for details.

## 🔔 Stay Updated

- Star this repository to get notifications about new releases
- Follow us on [Twitter](https://twitter.com/convertorio)
- Subscribe to our [newsletter](https://convertorio.com/newsletter)

## ❓ Support

Need help? Here are your options:

1. **Documentation** - Check the language-specific docs
2. **Examples** - Browse the examples directory
3. **GitHub Issues** - [Open an issue](https://github.com/convertorio/sdk/issues)
4. **Email Support** - [support@convertorio.com](mailto:support@convertorio.com)
5. **Community** - Join our [Discord server](https://discord.gg/convertorio)

---

Made with ❤️ by the Convertorio team
