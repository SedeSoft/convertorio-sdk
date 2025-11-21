# Convertorio SDK - Java Tests

Test suite for the Convertorio Java SDK.

## Prerequisites

- Java 11 or higher
- Internet connection
- Valid Convertorio API key

## Setup

1. **Build the SDK first**:
   ```bash
   cd sdk/libs/java
   ./compile.bat    # Windows
   # Or manually compile with javac
   ```

2. **Update API Key**:
   Edit `src/main/java/SimpleTest.java` and replace the API key:
   ```java
   private static final String API_KEY = "your_api_key_here";
   ```

## Running Tests

### Simple Conversion Test

```bash
cd sdk/test/java/simple-convert

# Compile
javac -cp "../../../libs/java/target/convertorio-sdk-1.2.0.jar;../../../libs/java/lib/*" src/main/java/SimpleTest.java -d .

# Run
java -cp ".;../../../libs/java/target/convertorio-sdk-1.2.0.jar;../../../libs/java/lib/*" SimpleTest
```

### On Linux/Mac

Replace semicolons (`;`) with colons (`:`) in the classpath:

```bash
javac -cp "../../../libs/java/target/convertorio-sdk-1.2.0.jar:../../../libs/java/lib/*" src/main/java/SimpleTest.java -d .

java -cp ".:../../../libs/java/target/convertorio-sdk-1.2.0.jar:../../../libs/java/lib/*" SimpleTest
```

## Test Image

The test uses `test-image.png` in the same directory. Make sure this file exists before running tests.

## Expected Output

```
============================================================
Testing Convertorio SDK for Java (v1.2.0)
============================================================

🔄 Converting test-image.png to JPG...
✓ Conversion successful!
  Job ID: xxx-xxx-xxx
  Source format: png
  Target format: jpg
  Processing time: 450ms
  File size: 40.60 KB
  Output: ./output-test.jpg

============================================================
✅ Test completed successfully!
============================================================
```

## Output Files

- `output-test.jpg` - Converted image file
- `SimpleTest.class` - Compiled test class

## Troubleshooting

**Error: "class file has wrong version"**
- Make sure you're using Java 11 or higher
- Check: `java -version`

**Error: "ClassNotFoundException"**
- Verify the classpath includes all JARs
- Make sure the SDK JAR was built correctly

**Error: "Input file not found"**
- Ensure `test-image.png` exists in the test directory
- Copy from: `sdk/test/php/simple-convert/test-image.png`

**Error: "API key is required"**
- Update the API_KEY constant in SimpleTest.java
- Get your API key from [https://convertorio.com/account](https://convertorio.com/account)

**Error: "HTTP request failed"**
- Check internet connectivity
- Verify API key is valid
- Check API status at [https://status.convertorio.com](https://status.convertorio.com)

## Support

- Documentation: [https://convertorio.com/docs](https://convertorio.com/docs)
- API Reference: [https://convertorio.com/api-docs](https://convertorio.com/api-docs)
- Support: [support@convertorio.com](mailto:support@convertorio.com)
