@echo off
echo ============================================
echo Publishing Convertorio Python SDK to PyPI
echo ============================================
echo.

cd /d "%~dp0"

echo Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
for /d %%i in (*.egg-info) do rmdir /s /q "%%i"

echo.
echo Installing/upgrading build tools...
python -m pip install --upgrade build twine

echo.
echo Building package...
python -m build

echo.
echo Checking package...
python -m twine check dist/*

echo.
echo Package is ready to upload!
echo.
echo To upload to PyPI, run:
echo   python -m twine upload dist/*
echo.
echo Press any key to upload now, or Ctrl+C to cancel...
pause

echo.
echo Uploading to PyPI...
python -m twine upload dist/*

echo.
echo Done!
pause
