# Simple Conversion Test

This test validates that the `convertorio-sdk` package works correctly when installed from npm.

## What This Test Does

1. Installs `convertorio-sdk` from npm registry
2. Loads a test image (PNG)
3. Converts it to JPG format
4. Validates the output
5. Shows detailed progress and results

## Running the Test

```bash
# Install dependencies (installs convertorio-sdk from npm)
npm install

# Run the test
npm test
```

Or directly:
```bash
node test.js
```

## Test Files

- `test-image.png` - Input image (25 KB PNG)
- `test.js` - Test script with event listeners
- `converted-image.jpg` - Output file (created after test runs)

## Expected Output

The test should:
- ✓ Initialize the SDK
- ✓ Upload the image
- ✓ Convert PNG to JPG
- ✓ Download the result
- ✓ Verify it's a valid JPEG
- ✓ Display processing time and file sizes

## Troubleshooting

If the test fails:
1. Check your API key in `test.js`
2. Verify you have internet connection
3. Ensure the API is reachable at `https://api.convertorio.com`
4. Check you have sufficient credits/points
