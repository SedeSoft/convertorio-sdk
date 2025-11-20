# Convertorio SDK - Go Tests

Test suite for the Convertorio Go SDK.

## Prerequisites

- Go >= 1.18
- Valid Convertorio API key

## Installation

### Option 1: Using from GitHub (after tag is pushed)

Once the repository has been tagged with `libs/go/v1.2.0`, you can install it with:

```bash
go get github.com/SedeSoft/convertorio-sdk/libs/go@v1.2.0
```

### Option 2: Local Development (Current Setup)

The test uses a local replace directive in `go.mod`:

```go
require github.com/SedeSoft/convertorio-sdk/libs/go v0.0.0

replace github.com/SedeSoft/convertorio-sdk/libs/go => ../../../libs/go
```

This allows testing the SDK without publishing it first.

## Running Tests

### Basic Conversion Test

```bash
cd sdk/test/go/simple-convert
go run main.go
```

## Configuration

Update the API key in `main.go`:

```go
const APIKey = "your_api_key_here"
```

Get your API key from [https://convertorio.com/account](https://convertorio.com/account).

## Test Image

Make sure `test-image.png` exists in the same directory before running tests.

## Output Files

Test output files are created in the same directory:
- `output-test.jpg` - Test result

## Troubleshooting

**Error: "Input file not found"**
- Ensure `test-image.png` exists in `sdk/test/go/simple-convert/`

**Error: "HTTP request failed"**
- Verify your API key is correct
- Check internet connectivity

**Error: "Insufficient credits"**
- Add more points at [https://convertorio.com/billing](https://convertorio.com/billing)
- Free tier: 5 conversions per day

## Publishing to Go Modules

To make this SDK available via `go get`, you need to:

1. **Push the code to GitHub** (already done)

2. **Create a git tag for the submodule**:
   ```bash
   cd sdk
   git tag libs/go/v1.2.0
   git push origin libs/go/v1.2.0
   ```

3. **Users can then install with**:
   ```bash
   go get github.com/SedeSoft/convertorio-sdk/libs/go@v1.2.0
   ```

## Support

- **Documentation:** [https://convertorio.com/docs](https://convertorio.com/docs)
- **Support:** [support@convertorio.com](mailto:support@convertorio.com)
