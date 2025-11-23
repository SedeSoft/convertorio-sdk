"""
Convertorio Client

Main client class for interacting with the Convertorio API
"""

import os
import time
from pathlib import Path
from typing import Optional, Dict, Any, List, Callable
from urllib.parse import urlencode

import requests


class ConversionError(Exception):
    """Custom exception for conversion errors"""
    pass


class ConvertorioClient:
    """
    Convertorio SDK Client

    Simple and powerful SDK to convert images using the Convertorio API.

    Args:
        api_key: Your Convertorio API key (get it from https://convertorio.com/account)
        base_url: API base URL (default: https://api.convertorio.com)

    Example:
        >>> client = ConvertorioClient(api_key='your_api_key_here')
        >>> result = client.convert_file(
        ...     input_path='./image.png',
        ...     target_format='jpg'
        ... )
        >>> print(result['output_path'])
    """

    def __init__(self, api_key: str, base_url: str = 'https://api.convertorio.com'):
        """Initialize Convertorio client"""
        if not api_key:
            raise ValueError('API key is required. Get yours at https://convertorio.com/account')

        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

        # Event callbacks
        self._on_start: Optional[Callable] = None
        self._on_progress: Optional[Callable] = None
        self._on_status: Optional[Callable] = None
        self._on_complete: Optional[Callable] = None
        self._on_error: Optional[Callable] = None

    def on(self, event: str, callback: Callable):
        """
        Register event callback

        Args:
            event: Event name ('start', 'progress', 'status', 'complete', 'error')
            callback: Callback function

        Example:
            >>> def on_progress(data):
            ...     print(f"Step: {data['step']}")
            >>> client.on('progress', on_progress)
        """
        if event == 'start':
            self._on_start = callback
        elif event == 'progress':
            self._on_progress = callback
        elif event == 'status':
            self._on_status = callback
        elif event == 'complete':
            self._on_complete = callback
        elif event == 'error':
            self._on_error = callback
        else:
            raise ValueError(f'Unknown event: {event}')
        return self

    def _emit(self, event: str, data: Dict[str, Any]):
        """Emit an event to registered callback"""
        if event == 'start' and self._on_start:
            self._on_start(data)
        elif event == 'progress' and self._on_progress:
            self._on_progress(data)
        elif event == 'status' and self._on_status:
            self._on_status(data)
        elif event == 'complete' and self._on_complete:
            self._on_complete(data)
        elif event == 'error' and self._on_error:
            self._on_error(data)

    def convert_file(
        self,
        input_path: str,
        target_format: str,
        output_path: Optional[str] = None,
        conversion_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Convert an image file

        Args:
            input_path: Path to the input file
            target_format: Target format (jpg, png, webp, avif, etc.)
            output_path: Optional output path (auto-generated if not provided)
            conversion_metadata: Advanced conversion options
                - aspect_ratio: Target aspect ratio (original, 1:1, 4:3, 16:9, 9:16, 21:9, custom)
                - crop_strategy: Crop strategy (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
                - quality: Compression quality 1-100 (for JPG, WebP, AVIF, HEIC)
                - icon_size: Icon size in pixels (for ICO format: 16, 32, 48, 64, 128, 256)
                - resize_width: Target width in pixels (1-10000)
                - resize_height: Target height in pixels (1-10000)

        Returns:
            Dictionary with conversion result:
                - success: bool
                - job_id: str
                - input_path: str
                - output_path: str
                - source_format: str
                - target_format: str
                - file_size: int
                - processing_time: int (milliseconds)
                - download_url: str

        Raises:
            ConversionError: If conversion fails
            FileNotFoundError: If input file doesn't exist

        Example:
            >>> result = client.convert_file(
            ...     input_path='./photo.jpg',
            ...     target_format='webp',
            ...     conversion_metadata={
            ...         'aspect_ratio': '16:9',
            ...         'crop_strategy': 'crop-center',
            ...         'quality': 90
            ...     }
            ... )
        """
        # Validate input file exists
        if not os.path.exists(input_path):
            raise FileNotFoundError(f'Input file not found: {input_path}')

        input_path_obj = Path(input_path)
        file_stats = input_path_obj.stat()
        file_name = input_path_obj.name
        source_format = input_path_obj.suffix[1:].lower() if input_path_obj.suffix else ''

        self._emit('start', {
            'file_name': file_name,
            'source_format': source_format,
            'target_format': target_format
        })

        try:
            # Step 1: Request upload URL
            self._emit('progress', {
                'step': 'requesting-upload-url',
                'message': 'Requesting upload URL from server...'
            })

            request_body = {
                'filename': file_name,
                'source_format': source_format,
                'target_format': target_format.lower(),
                'file_size': file_stats.st_size
            }

            # Add conversion metadata if provided
            if conversion_metadata:
                request_body['conversion_metadata'] = conversion_metadata

            upload_request = self.session.post(
                f'{self.base_url}/v1/convert/upload-url',
                json=request_body
            )
            upload_request.raise_for_status()
            upload_data = upload_request.json()

            if not upload_data.get('success'):
                raise ConversionError(upload_data.get('error', 'Failed to get upload URL'))

            job_id = upload_data['job_id']
            upload_url = upload_data['upload_url']

            # Step 2: Upload file to S3
            self._emit('progress', {
                'step': 'uploading',
                'message': 'Uploading file to cloud storage...',
                'job_id': job_id
            })

            with open(input_path, 'rb') as f:
                file_data = f.read()

            upload_response = requests.put(
                upload_url,
                data=file_data,
                headers={'Content-Type': f'image/{source_format}'}
            )
            upload_response.raise_for_status()

            # Step 3: Confirm upload and queue conversion
            self._emit('progress', {
                'step': 'confirming',
                'message': 'Confirming upload and queuing conversion...',
                'job_id': job_id
            })

            confirm_request = self.session.post(
                f'{self.base_url}/v1/convert/confirm',
                json={'job_id': job_id}
            )
            confirm_request.raise_for_status()
            confirm_data = confirm_request.json()

            if not confirm_data.get('success'):
                raise ConversionError(confirm_data.get('error', 'Failed to confirm upload'))

            # Step 4: Poll for completion
            self._emit('progress', {
                'step': 'converting',
                'message': 'Converting image...',
                'job_id': job_id,
                'status': confirm_data.get('status')
            })

            result = self._poll_job_status(job_id)

            # Step 5: Download converted file
            self._emit('progress', {
                'step': 'downloading',
                'message': 'Downloading converted file...',
                'job_id': job_id
            })

            final_output_path = output_path or self._generate_output_path(input_path, target_format)
            self._download_file(result['download_url'], final_output_path)

            # Build conversion result
            output_stats = Path(final_output_path).stat()
            conversion_result = {
                'success': True,
                'job_id': job_id,
                'input_path': input_path,
                'output_path': final_output_path,
                'source_format': source_format,
                'target_format': target_format.lower(),
                'file_size': output_stats.st_size,
                'processing_time': result.get('processing_time_ms', 0),
                'download_url': result['download_url'],
                'tokens_used': result.get('tokens_used')
            }

            self._emit('complete', conversion_result)
            return conversion_result

        except Exception as error:
            error_details = {
                'success': False,
                'error': str(error),
                'input_path': input_path,
                'target_format': target_format
            }
            self._emit('error', error_details)
            raise ConversionError(str(error)) from error

    def _poll_job_status(
        self,
        job_id: str,
        max_attempts: int = 60,
        interval: float = 2.0
    ) -> Dict[str, Any]:
        """
        Poll job status until completion

        Args:
            job_id: Job ID to poll
            max_attempts: Maximum polling attempts
            interval: Polling interval in seconds

        Returns:
            Job result dictionary

        Raises:
            ConversionError: If job fails or times out
        """
        attempts = 0

        while attempts < max_attempts:
            attempts += 1

            # Wait before polling (except first attempt)
            if attempts > 1:
                time.sleep(interval)

            status_request = self.session.get(f'{self.base_url}/v1/jobs/{job_id}')
            status_request.raise_for_status()
            status_data = status_request.json()

            if not status_data.get('success'):
                raise ConversionError('Failed to get job status')

            job = status_data['job']
            status = job['status']

            self._emit('status', {
                'job_id': job_id,
                'status': status,
                'attempt': attempts,
                'max_attempts': max_attempts
            })

            if status == 'completed':
                return job

            if status == 'failed':
                raise ConversionError(job.get('error_message', 'Conversion failed'))

            if status == 'expired':
                raise ConversionError('Job expired')

        raise ConversionError('Conversion timeout - job did not complete in time')

    def _download_file(self, url: str, output_path: str):
        """
        Download file from URL

        Args:
            url: Download URL
            output_path: Output file path
        """
        response = requests.get(url)
        response.raise_for_status()

        # Ensure output directory exists
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'wb') as f:
            f.write(response.content)

    def _generate_output_path(self, input_path: str, target_format: str) -> str:
        """
        Generate output path based on input path and target format

        Args:
            input_path: Input file path
            target_format: Target format

        Returns:
            Output file path
        """
        input_path_obj = Path(input_path)
        return str(input_path_obj.with_suffix(f'.{target_format.lower()}'))

    def get_account(self) -> Dict[str, Any]:
        """
        Get account information

        Returns:
            Dictionary with account details:
                - id: str
                - email: str
                - name: str
                - plan: str
                - points: int
                - daily_conversions_remaining: int
                - total_conversions: int

        Example:
            >>> account = client.get_account()
            >>> print(f"Points: {account['points']}")
        """
        response = self.session.get(f'{self.base_url}/v1/account')
        response.raise_for_status()
        data = response.json()

        if not data.get('success'):
            raise ConversionError(data.get('error', 'Failed to get account info'))

        return data['account']

    def list_jobs(
        self,
        limit: int = 50,
        offset: int = 0,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        List conversion jobs

        Args:
            limit: Number of jobs to return (max: 100)
            offset: Offset for pagination
            status: Filter by status (completed, failed, processing, etc.)

        Returns:
            List of job dictionaries

        Example:
            >>> jobs = client.list_jobs(limit=10, status='completed')
            >>> for job in jobs:
            ...     print(f"Job {job['id']}: {job['status']}")
        """
        params = {'limit': limit, 'offset': offset}
        if status:
            params['status'] = status

        query_string = urlencode(params)
        response = self.session.get(f'{self.base_url}/v1/jobs?{query_string}')
        response.raise_for_status()
        data = response.json()

        if not data.get('success'):
            raise ConversionError(data.get('error', 'Failed to list jobs'))

        return data['jobs']

    def get_job(self, job_id: str) -> Dict[str, Any]:
        """
        Get job status

        Args:
            job_id: Job ID

        Returns:
            Job details dictionary

        Example:
            >>> job = client.get_job('job-123')
            >>> print(f"Status: {job['status']}")
        """
        response = self.session.get(f'{self.base_url}/v1/jobs/{job_id}')
        response.raise_for_status()
        data = response.json()

        if not data.get('success'):
            raise ConversionError(data.get('error', 'Failed to get job'))

        return data['job']
