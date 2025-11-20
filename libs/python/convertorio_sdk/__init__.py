"""
Convertorio SDK for Python

Official Python SDK for the Convertorio API.
Convert images between 20+ formats with just a few lines of code.
"""

from .client import ConvertorioClient, ConversionError

__version__ = "1.2.0"
__all__ = ["ConvertorioClient", "ConversionError"]
