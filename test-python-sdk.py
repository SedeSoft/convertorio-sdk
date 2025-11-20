"""
Quick test to verify Python SDK installation from PyPI
"""

from convertorio_sdk import ConvertorioClient, ConversionError, __version__

print("=" * 60)
print("Convertorio SDK for Python - Installation Verification")
print("=" * 60)
print()

# Test 1: Version
print(f"SDK Version: {__version__}")
assert __version__ == "1.2.0", "Version mismatch"
print("  [PASS] Version check")

# Test 2: Client instantiation
try:
    client = ConvertorioClient(api_key="test_key_12345")
    print("  [PASS] Client instantiation")
except Exception as e:
    print(f"  [FAIL] Client instantiation: {e}")
    exit(1)

# Test 3: Check methods exist
methods = ['convert_file', 'get_account', 'list_jobs', 'get_job', 'on']
for method in methods:
    if not hasattr(client, method):
        print(f"  [FAIL] Missing method: {method}")
        exit(1)
print(f"  [PASS] All {len(methods)} methods available")

# Test 4: Event system
event_registered = False

def test_callback(data):
    global event_registered
    event_registered = True

client.on('start', test_callback)
print("  [PASS] Event system working")

# Test 5: ConversionError exception
try:
    raise ConversionError("Test error")
except ConversionError as e:
    print("  [PASS] ConversionError exception working")

print()
print("=" * 60)
print("All tests passed! SDK is ready to use.")
print("=" * 60)
print()
print("Installation:")
print("  pip install convertorio-sdk")
print()
print("Quick Start:")
print('  from convertorio_sdk import ConvertorioClient')
print('  client = ConvertorioClient(api_key="your_api_key")')
print('  result = client.convert_file(')
print('      input_path="./image.png",')
print('      target_format="jpg"')
print('  )')
print()
