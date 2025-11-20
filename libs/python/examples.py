"""
Convertorio SDK - Usage Examples

This file demonstrates various ways to use the Convertorio SDK.
"""

from convertorio_sdk import ConvertorioClient

# Initialize client
API_KEY = 'your_api_key_here'  # Get from https://convertorio.com/account
client = ConvertorioClient(api_key=API_KEY)


# Example 1: Basic conversion
def basic_conversion():
    """Convert PNG to JPG"""
    result = client.convert_file(
        input_path='./photo.png',
        target_format='jpg'
    )
    print(f"Converted to: {result['output_path']}")
    return result


# Example 2: Conversion with custom output path
def custom_output_path():
    """Convert with specific output location"""
    result = client.convert_file(
        input_path='./photo.png',
        target_format='webp',
        output_path='./converted/optimized.webp'
    )
    print(f"Saved to: {result['output_path']}")
    return result


# Example 3: Convert with quality control
def quality_control():
    """Convert JPG to WebP with high quality"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='webp',
        conversion_metadata={
            'quality': 95  # High quality (1-100)
        }
    )
    print(f"High quality conversion: {result['file_size']} bytes")
    return result


# Example 4: Convert to square (1:1) for Instagram
def square_for_instagram():
    """Convert to 1:1 aspect ratio for Instagram"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'aspect_ratio': '1:1',
            'crop_strategy': 'crop-center'
        }
    )
    print(f"Square image created: {result['output_path']}")
    return result


# Example 5: Convert to 16:9 widescreen
def widescreen_16_9():
    """Convert to 16:9 for video thumbnails"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'aspect_ratio': '16:9',
            'crop_strategy': 'crop-center',
            'quality': 90
        }
    )
    print(f"Widescreen created: {result['output_path']}")
    return result


# Example 6: Convert to 9:16 vertical for Stories
def vertical_for_stories():
    """Convert to 9:16 for Instagram/TikTok Stories"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'aspect_ratio': '9:16',
            'crop_strategy': 'crop-center'
        }
    )
    print(f"Vertical story created: {result['output_path']}")
    return result


# Example 7: Create favicon (ICO)
def create_favicon():
    """Create 32x32 favicon from logo"""
    result = client.convert_file(
        input_path='./logo.png',
        target_format='ico',
        conversion_metadata={
            'icon_size': 32,
            'crop_strategy': 'crop-center'
        }
    )
    print(f"Favicon created: {result['output_path']}")
    return result


# Example 8: Convert HEIC (iPhone photo) to JPG
def heic_to_jpg():
    """Convert iPhone HEIC photo to JPG"""
    result = client.convert_file(
        input_path='./iphone_photo.heic',
        target_format='jpg',
        conversion_metadata={
            'quality': 90
        }
    )
    print(f"HEIC converted to JPG: {result['output_path']}")
    return result


# Example 9: Convert with fit strategy (add padding)
def fit_with_padding():
    """Convert to 16:9 with padding instead of cropping"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='png',
        conversion_metadata={
            'aspect_ratio': '16:9',
            'crop_strategy': 'fit'  # Adds padding instead of cropping
        }
    )
    print(f"Fitted with padding: {result['output_path']}")
    return result


# Example 10: Get account info
def get_account_info():
    """Get account information and points balance"""
    account = client.get_account()
    print(f"Account: {account['email']}")
    print(f"Plan: {account['plan']}")
    print(f"Points: {account['points']}")
    print(f"Daily conversions remaining: {account['daily_conversions_remaining']}")
    return account


# Example 11: List recent jobs
def list_recent_jobs():
    """List your 10 most recent conversion jobs"""
    jobs = client.list_jobs(limit=10)
    for job in jobs:
        print(f"Job {job['id']}: {job['status']} - {job['original_filename']}")
    return jobs


# Example 12: Resize by width (maintains aspect ratio)
def resize_by_width():
    """Resize image to 800px width, height calculated automatically"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'resize_width': 800  # Height will maintain aspect ratio
        }
    )
    print(f"Resized to 800px width: {result['output_path']}")
    return result


# Example 13: Resize by height (maintains aspect ratio)
def resize_by_height():
    """Resize image to 600px height, width calculated automatically"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'resize_height': 600  # Width will maintain aspect ratio
        }
    )
    print(f"Resized to 600px height: {result['output_path']}")
    return result


# Example 14: Resize to exact dimensions
def resize_exact():
    """Resize to exact dimensions (may distort)"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'resize_width': 800,
            'resize_height': 600  # May distort if aspect ratio differs
        }
    )
    print(f"Resized to 800x600: {result['output_path']}")
    return result


# Example 15: Combine resize with aspect ratio
def resize_with_aspect_ratio():
    """Create 500x500 square thumbnail with center crop"""
    result = client.convert_file(
        input_path='./photo.jpg',
        target_format='jpg',
        conversion_metadata={
            'aspect_ratio': '1:1',
            'crop_strategy': 'crop-center',
            'resize_width': 500,
            'quality': 90
        }
    )
    print(f"Square thumbnail created: {result['output_path']}")
    return result


# Example 16: With event callbacks
def with_progress_tracking():
    """Convert with progress tracking"""

    def on_start(data):
        print(f"Starting conversion: {data['file_name']}")

    def on_progress(data):
        print(f"[{data['step']}] {data['message']}")

    def on_complete(result):
        print(f"✓ Completed in {result['processing_time']}ms")
        print(f"  Output: {result['output_path']}")
        print(f"  Size: {result['file_size']} bytes")

    # Register callbacks
    client.on('start', on_start)
    client.on('progress', on_progress)
    client.on('complete', on_complete)

    result = client.convert_file(
        input_path='./photo.png',
        target_format='webp',
        conversion_metadata={
            'quality': 85
        }
    )
    return result


# Example 17: Batch conversion
def batch_convert_folder():
    """Convert all PNG files in a folder to WebP"""
    from pathlib import Path

    # Get all PNG files
    images_dir = Path('./images')
    png_files = list(images_dir.glob('*.png'))

    results = []
    for i, file_path in enumerate(png_files, 1):
        print(f"Converting {i}/{len(png_files)}: {file_path.name}")

        result = client.convert_file(
            input_path=str(file_path),
            target_format='webp',
            conversion_metadata={
                'quality': 85
            }
        )
        results.append(result)
        print(f"  ✓ Saved to: {result['output_path']}")

    print(f"\nConverted {len(results)} files")
    return results


# Example 18: Error handling
def with_error_handling():
    """Convert with proper error handling"""
    from convertorio_sdk import ConversionError

    try:
        result = client.convert_file(
            input_path='./photo.jpg',
            target_format='png'
        )
        print(f"Success: {result['output_path']}")
        return result

    except FileNotFoundError:
        print("Error: Input file does not exist")

    except ConversionError as e:
        print(f"Conversion error: {e}")

        # Handle specific errors
        if 'Insufficient' in str(e):
            print("Not enough points/credits - please add more")
        elif 'Invalid API key' in str(e):
            print("API key is invalid - check your account settings")

    except Exception as e:
        print(f"Unexpected error: {e}")


# Main function to run examples
def run_examples():
    """Run all examples (comment out the ones you don't want to run)"""

    print("=" * 60)
    print("Convertorio SDK - Python Examples")
    print("=" * 60)
    print()

    # Uncomment the examples you want to run:

    # basic_conversion()
    # custom_output_path()
    # quality_control()
    # square_for_instagram()
    # widescreen_16_9()
    # vertical_for_stories()
    # create_favicon()
    # heic_to_jpg()
    # fit_with_padding()
    # get_account_info()
    # list_recent_jobs()
    # resize_by_width()
    # resize_by_height()
    # resize_exact()
    # resize_with_aspect_ratio()
    # with_progress_tracking()
    # batch_convert_folder()
    # with_error_handling()

    print("\nNote: Uncomment the examples you want to run in the run_examples() function")


if __name__ == '__main__':
    run_examples()
