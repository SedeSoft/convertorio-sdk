"""
Convertorio SDK - Comprehensive Metadata Test Suite

Tests all advanced conversion options including aspect ratio, quality, and ICO formats.
"""

from pathlib import Path
from convertorio_sdk import ConvertorioClient

API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3'


def run_metadata_tests():
    print('=' * 60)
    print('Testing Convertorio SDK - Advanced Conversion Options')
    print('=' * 60)

    try:
        client = ConvertorioClient(
            api_key=API_KEY,
            base_url='https://api.convertorio.com'
        )

        # Setup event listeners
        def on_progress(data):
            print(f"  [{data['step']}] {data['message']}")

        client.on('progress', on_progress)

        current_dir = Path(__file__).parent
        input_path = current_dir / 'test-image.png'

        # Test 1: 16:9 Aspect ratio with crop-center
        print('\n📐 Test 1: Convert to 16:9 widescreen')
        print('  Aspect ratio: 16:9')
        print('  Crop strategy: crop-center')
        print('  Quality: 90%')

        test1 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-16x9.jpg'),
            conversion_metadata={
                'aspect_ratio': '16:9',
                'crop_strategy': 'crop-center',
                'quality': 90
            }
        )

        print(f'✓ Test 1 completed - Job ID: {test1["job_id"]}')
        print(f'  Processing time: {test1["processing_time"]}ms')
        print(f'  File size: {test1["file_size"] / 1024:.2f} KB')

        # Test 2: 1:1 Square for Instagram
        print('\n📷 Test 2: Convert to 1:1 square (Instagram)')
        print('  Aspect ratio: 1:1')
        print('  Format: WebP')
        print('  Quality: 85%')

        test2 = client.convert_file(
            input_path=str(input_path),
            target_format='webp',
            output_path=str(current_dir / 'output-square.webp'),
            conversion_metadata={
                'aspect_ratio': '1:1',
                'crop_strategy': 'crop-center',
                'quality': 85
            }
        )

        print(f'✓ Test 2 completed - Job ID: {test2["job_id"]}')
        print(f'  Processing time: {test2["processing_time"]}ms')
        print(f'  File size: {test2["file_size"] / 1024:.2f} KB')

        # Test 3: ICO Favicon
        print('\n🔷 Test 3: Create ICO favicon')
        print('  Icon size: 32x32')
        print('  Format: ICO')

        test3 = client.convert_file(
            input_path=str(input_path),
            target_format='ico',
            output_path=str(current_dir / 'favicon-32x32.ico'),
            conversion_metadata={
                'icon_size': 32,
                'crop_strategy': 'crop-center'
            }
        )

        print(f'✓ Test 3 completed - Job ID: {test3["job_id"]}')
        print(f'  Processing time: {test3["processing_time"]}ms')
        print(f'  File size: {test3["file_size"] / 1024:.2f} KB')

        # Test 4: High Quality JPG
        print('\n🎨 Test 4: High quality JPG conversion')
        print('  Quality: 95%')
        print('  Format: JPG')

        test4 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-high-quality.jpg'),
            conversion_metadata={
                'quality': 95
            }
        )

        print(f'✓ Test 4 completed - Job ID: {test4["job_id"]}')
        print(f'  Processing time: {test4["processing_time"]}ms')
        print(f'  File size: {test4["file_size"] / 1024:.2f} KB')

        # Test 5: 9:16 Vertical (Stories)
        print('\n📱 Test 5: Convert to 9:16 vertical (Stories)')
        print('  Aspect ratio: 9:16')
        print('  Crop strategy: crop-center')

        test5 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-vertical.jpg'),
            conversion_metadata={
                'aspect_ratio': '9:16',
                'crop_strategy': 'crop-center',
                'quality': 85
            }
        )

        print(f'✓ Test 5 completed - Job ID: {test5["job_id"]}')
        print(f'  Processing time: {test5["processing_time"]}ms')
        print(f'  File size: {test5["file_size"] / 1024:.2f} KB')

        # Test 6: Fit strategy (with padding)
        print('\n🖼️  Test 6: Convert with fit strategy (padding)')
        print('  Aspect ratio: 16:9')
        print('  Crop strategy: fit (adds padding)')

        test6 = client.convert_file(
            input_path=str(input_path),
            target_format='png',
            output_path=str(current_dir / 'output-fit.png'),
            conversion_metadata={
                'aspect_ratio': '16:9',
                'crop_strategy': 'fit'
            }
        )

        print(f'✓ Test 6 completed - Job ID: {test6["job_id"]}')
        print(f'  Processing time: {test6["processing_time"]}ms')
        print(f'  File size: {test6["file_size"] / 1024:.2f} KB')

        # Summary
        print('\n' + '=' * 60)
        print('✅ All metadata tests completed successfully!')
        print('=' * 60)

        total_tests = 6
        avg_processing_time = (
            test1['processing_time'] + test2['processing_time'] + test3['processing_time'] +
            test4['processing_time'] + test5['processing_time'] + test6['processing_time']
        ) / total_tests

        print(f"\nTotal tests: {total_tests}")
        print(f"Average processing time: {round(avg_processing_time)}ms")
        print('\nOutput files:')
        print(f"  1. {test1['output_path']} (16:9 widescreen)")
        print(f"  2. {test2['output_path']} (1:1 square)")
        print(f"  3. {test3['output_path']} (ICO favicon)")
        print(f"  4. {test4['output_path']} (high quality)")
        print(f"  5. {test5['output_path']} (9:16 vertical)")
        print(f"  6. {test6['output_path']} (fit with padding)")

    except Exception as error:
        print(f'\n❌ Error: {error}')
        import traceback
        traceback.print_exc()
        exit(1)


if __name__ == '__main__':
    run_metadata_tests()
