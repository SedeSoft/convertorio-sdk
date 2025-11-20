"""
Convertorio SDK - Resize Feature Test Suite

Tests various resize scenarios with the Convertorio SDK.
"""

from pathlib import Path
from convertorio_sdk import ConvertorioClient

API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3'


def run_resize_tests():
    print('=' * 60)
    print('Testing Convertorio SDK - Resize Feature (v1.2.0)')
    print('=' * 60)

    try:
        client = ConvertorioClient(
            api_key=API_KEY,
            base_url='https://api.convertorio.com'
        )

        current_dir = Path(__file__).parent
        input_path = current_dir / 'test-image.png'

        # Test 1: Resize by width (maintains aspect ratio)
        print('\n📐 Test 1: Resize by width (800px)')
        test1 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-resize-width-800.jpg'),
            conversion_metadata={
                'resize_width': 800
            }
        )

        print('✓ Test 1 completed')
        print(f"  Job ID: {test1['job_id']}")
        print(f"  Processing time: {test1['processing_time']}ms")
        print(f"  File size: {test1['file_size'] / 1024:.2f} KB")
        print(f"  Output: {test1['output_path']}")

        # Test 2: Resize by height (maintains aspect ratio)
        print('\n📏 Test 2: Resize by height (600px)')
        test2 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-resize-height-600.jpg'),
            conversion_metadata={
                'resize_height': 600
            }
        )

        print('✓ Test 2 completed')
        print(f"  Job ID: {test2['job_id']}")
        print(f"  Processing time: {test2['processing_time']}ms")
        print(f"  File size: {test2['file_size'] / 1024:.2f} KB")
        print(f"  Output: {test2['output_path']}")

        # Test 3: Resize to exact dimensions (may distort)
        print('\n⚙️  Test 3: Resize to exact 1920x1080 (16:9)')
        test3 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-resize-1920x1080.jpg'),
            conversion_metadata={
                'resize_width': 1920,
                'resize_height': 1080
            }
        )

        print('✓ Test 3 completed')
        print(f"  Job ID: {test3['job_id']}")
        print(f"  Processing time: {test3['processing_time']}ms")
        print(f"  File size: {test3['file_size'] / 1024:.2f} KB")
        print(f"  Output: {test3['output_path']}")

        # Test 4: Combine resize with aspect ratio change
        print('\n🎨 Test 4: Aspect ratio 1:1 + resize width 500px')
        test4 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-square-500.jpg'),
            conversion_metadata={
                'aspect_ratio': '1:1',
                'crop_strategy': 'crop-center',
                'resize_width': 500,
                'quality': 90
            }
        )

        print('✓ Test 4 completed')
        print(f"  Job ID: {test4['job_id']}")
        print(f"  Processing time: {test4['processing_time']}ms")
        print(f"  File size: {test4['file_size'] / 1024:.2f} KB")
        print(f"  Output: {test4['output_path']}")

        # Test 5: Create thumbnail (small size)
        print('\n🖼️  Test 5: Create thumbnail (150x150)')
        test5 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-thumbnail-150.jpg'),
            conversion_metadata={
                'resize_width': 150,
                'resize_height': 150,
                'quality': 85
            }
        )

        print('✓ Test 5 completed')
        print(f"  Job ID: {test5['job_id']}")
        print(f"  Processing time: {test5['processing_time']}ms")
        print(f"  File size: {test5['file_size'] / 1024:.2f} KB")
        print(f"  Output: {test5['output_path']}")

        # Test 6: HD resolution with quality control
        print('\n📺 Test 6: HD resize (1280px width) with quality 95%')
        test6 = client.convert_file(
            input_path=str(input_path),
            target_format='jpg',
            output_path=str(current_dir / 'output-hd-1280.jpg'),
            conversion_metadata={
                'resize_width': 1280,
                'quality': 95
            }
        )

        print('✓ Test 6 completed')
        print(f"  Job ID: {test6['job_id']}")
        print(f"  Processing time: {test6['processing_time']}ms")
        print(f"  File size: {test6['file_size'] / 1024:.2f} KB")
        print(f"  Output: {test6['output_path']}")

        # Summary
        print('\n' + '=' * 60)
        print('✅ All resize tests completed successfully!')
        print('=' * 60)

        total_tests = 6
        avg_processing_time = (
            test1['processing_time'] + test2['processing_time'] + test3['processing_time'] +
            test4['processing_time'] + test5['processing_time'] + test6['processing_time']
        ) / total_tests

        print(f"\nTotal tests: {total_tests}")
        print(f"Average processing time: {round(avg_processing_time)}ms")
        print('\nOutput files:')
        print(f"  1. {test1['output_path']} (width: 800px)")
        print(f"  2. {test2['output_path']} (height: 600px)")
        print(f"  3. {test3['output_path']} (1920x1080)")
        print(f"  4. {test4['output_path']} (square 500x500)")
        print(f"  5. {test5['output_path']} (thumbnail 150x150)")
        print(f"  6. {test6['output_path']} (HD 1280px)")

    except Exception as error:
        print(f'\n❌ Error: {error}')
        import traceback
        traceback.print_exc()
        exit(1)


if __name__ == '__main__':
    run_resize_tests()
