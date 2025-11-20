"""
Simple Convertorio SDK Test

Basic conversion test without advanced metadata options.
"""

from pathlib import Path
from convertorio_sdk import ConvertorioClient

API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3'


def run_test():
    print('Iniciando conversión...')

    try:
        client = ConvertorioClient(
            api_key=API_KEY,
            base_url='https://api.convertorio.com'
        )

        current_dir = Path(__file__).parent
        result = client.convert_file(
            input_path=str(current_dir / 'test-image.png'),
            target_format='jpg',
            output_path=str(current_dir / 'output.jpg')
        )

        print('Conversión finalizada')
        print(f"Job ID: {result['job_id']}")
        print(f"Tiempo: {result['processing_time']}ms")

    except Exception as error:
        print(f'Error: {error}')
        exit(1)


if __name__ == '__main__':
    run_test()
