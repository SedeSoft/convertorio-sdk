"""
Setup script for convertorio-sdk
"""

from setuptools import setup, find_packages
from pathlib import Path

# Read README for long description
this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text(encoding='utf-8')

setup(
    name='convertorio-sdk',
    version='1.2.0',
    description='Official Convertorio SDK for Python - Convert images easily with a simple API',
    long_description=long_description,
    long_description_content_type='text/markdown',
    author='Convertorio',
    author_email='support@convertorio.com',
    url='https://github.com/SedeSoft/convertorio-sdk',
    project_urls={
        'Documentation': 'https://github.com/SedeSoft/convertorio-sdk/tree/main/docs/python',
        'Source': 'https://github.com/SedeSoft/convertorio-sdk',
        'Tracker': 'https://github.com/SedeSoft/convertorio-sdk/issues',
    },
    packages=find_packages(),
    python_requires='>=3.7',
    install_requires=[
        'requests>=2.25.0',
    ],
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: Python :: 3.12',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Multimedia :: Graphics :: Graphics Conversion',
    ],
    keywords='convertorio image conversion converter api sdk jpg png webp avif heic image-converter file-conversion',
    license='MIT',
    include_package_data=True,
    zip_safe=False,
)
