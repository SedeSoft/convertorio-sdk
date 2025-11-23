require 'httparty'
require 'json'
require 'fileutils'

module Convertorio
  class Error < StandardError; end
  class APIError < Error; end
  class FileNotFoundError < Error; end
  class ConversionTimeoutError < Error; end

  # Main client class for Convertorio API
  class Client
    include HTTParty

    attr_reader :api_key, :base_url

    # Initialize a new Convertorio client
    #
    # @param api_key [String] Your Convertorio API key (required)
    # @param base_url [String] API base URL (optional, defaults to https://api.convertorio.com)
    #
    # @example
    #   client = Convertorio::Client.new(api_key: 'your_api_key_here')
    #
    def initialize(api_key:, base_url: 'https://api.convertorio.com')
      raise Error, 'API key is required. Get yours at https://convertorio.com/account' if api_key.nil? || api_key.empty?

      @api_key = api_key
      @base_url = base_url
      @callbacks = {}

      self.class.base_uri @base_url
      self.class.headers(
        'Authorization' => "Bearer #{@api_key}",
        'Content-Type' => 'application/json'
      )
      self.class.default_timeout 60
    end

    # Register a callback for events
    #
    # @param event [Symbol] Event name (:start, :progress, :status, :complete, :error)
    # @param block [Proc] Block to execute when event occurs
    #
    # @example
    #   client.on(:progress) { |data| puts "Progress: #{data[:message]}" }
    #
    def on(event, &block)
      @callbacks[event] ||= []
      @callbacks[event] << block
    end

    # Convert an image file
    #
    # @param input_path [String] Path to the input file (required)
    # @param target_format [String] Target format (jpg, png, webp, avif, etc.) (required)
    # @param output_path [String] Output path (optional, auto-generated if not provided)
    # @param conversion_metadata [Hash] Advanced conversion options (optional)
    # @option conversion_metadata [String] :aspect_ratio Target aspect ratio (original, 1:1, 4:3, 16:9, 9:16, 21:9, custom)
    # @option conversion_metadata [String] :crop_strategy Crop strategy (fit, crop-center, crop-top, crop-bottom, crop-left, crop-right)
    # @option conversion_metadata [Integer] :quality Compression quality 1-100 (for JPG, WebP, AVIF)
    # @option conversion_metadata [Integer] :icon_size Icon size in pixels (for ICO format: 16, 32, 48, 64, 128, 256)
    # @option conversion_metadata [Integer] :resize_width Target width in pixels (height calculated automatically)
    # @option conversion_metadata [Integer] :resize_height Target height in pixels (width calculated automatically)
    #
    # @return [Hash] Conversion result with download URL and file path
    #
    # @example Basic conversion
    #   result = client.convert_file(
    #     input_path: './image.png',
    #     target_format: 'jpg'
    #   )
    #
    # @example With conversion options
    #   result = client.convert_file(
    #     input_path: './photo.jpg',
    #     target_format: 'webp',
    #     output_path: './output/photo.webp',
    #     conversion_metadata: {
    #       aspect_ratio: '16:9',
    #       crop_strategy: 'crop-center',
    #       quality: 85,
    #       resize_width: 1920
    #     }
    #   )
    #
    def convert_file(input_path: nil, target_format: nil, output_path: nil, conversion_metadata: {})
      raise Error, 'input_path is required' if input_path.nil? || input_path.empty?
      raise Error, 'target_format is required' if target_format.nil? || target_format.empty?
      raise FileNotFoundError, "Input file not found: #{input_path}" unless File.exist?(input_path)

      file_stats = File.stat(input_path)
      file_name = File.basename(input_path)
      source_format = File.extname(input_path).delete('.').downcase

      emit(:start, {
        file_name: file_name,
        source_format: source_format,
        target_format: target_format
      })

      begin
        # Step 1: Request upload URL
        emit(:progress, {
          step: 'requesting-upload-url',
          message: 'Requesting upload URL from server...'
        })

        request_body = {
          filename: file_name,
          source_format: source_format,
          target_format: target_format.downcase,
          file_size: file_stats.size
        }

        # Add conversion metadata if provided
        request_body[:conversion_metadata] = conversion_metadata unless conversion_metadata.empty?

        upload_response = self.class.post('/v1/convert/upload-url', body: request_body.to_json)
        upload_data = parse_response(upload_response)

        raise APIError, upload_data['error'] || 'Failed to get upload URL' unless upload_data['success']

        job_id = upload_data['job_id']
        upload_url = upload_data['upload_url']

        emit(:progress, {
          step: 'uploading',
          message: 'Uploading file to cloud storage...',
          job_id: job_id
        })

        # Step 2: Upload file to S3
        file_content = File.binread(input_path)
        HTTParty.put(upload_url, {
          body: file_content,
          headers: { 'Content-Type' => "image/#{source_format}" }
        })

        emit(:progress, {
          step: 'confirming',
          message: 'Confirming upload and queuing conversion...',
          job_id: job_id
        })

        # Step 3: Confirm upload and queue conversion
        confirm_response = self.class.post('/v1/convert/confirm', body: { job_id: job_id }.to_json)
        confirm_data = parse_response(confirm_response)

        raise APIError, confirm_data['error'] || 'Failed to confirm upload' unless confirm_data['success']

        emit(:progress, {
          step: 'converting',
          message: 'Converting image...',
          job_id: job_id,
          status: confirm_data['status']
        })

        # Step 4: Poll for completion
        job_result = poll_job_status(job_id)

        emit(:progress, {
          step: 'downloading',
          message: 'Downloading converted file...',
          job_id: job_id
        })

        # Step 5: Download converted file
        final_output_path = output_path || generate_output_path(input_path, target_format)
        download_file(job_result['download_url'], final_output_path)

        conversion_result = {
          success: true,
          job_id: job_id,
          input_path: input_path,
          output_path: final_output_path,
          source_format: source_format,
          target_format: target_format.downcase,
          file_size: File.size(final_output_path),
          processing_time: job_result['processing_time_ms'],
          download_url: job_result['download_url'],
          tokens_used: job_result['tokens_used']
        }

        emit(:complete, conversion_result)

        conversion_result

      rescue => error
        error_details = {
          success: false,
          error: error.message,
          input_path: input_path,
          target_format: target_format
        }

        emit(:error, error_details)
        raise error
      end
    end

    # Get account information
    #
    # @return [Hash] Account details including points balance and usage
    #
    # @example
    #   account = client.get_account
    #   puts "Points: #{account['points']}"
    #
    def get_account
      response = self.class.get('/v1/account')
      data = parse_response(response)

      raise APIError, data['error'] || 'Failed to get account info' unless data['success']

      data['account']
    end

    # List conversion jobs
    #
    # @param limit [Integer] Number of jobs to return (default: 50, max: 100)
    # @param offset [Integer] Offset for pagination (default: 0)
    # @param status [String] Filter by status (completed, failed, processing, etc.)
    #
    # @return [Array<Hash>] List of jobs
    #
    # @example
    #   jobs = client.list_jobs(limit: 10, status: 'completed')
    #   jobs.each { |job| puts "Job #{job['id']}: #{job['status']}" }
    #
    def list_jobs(limit: 50, offset: 0, status: nil)
      query = { limit: limit, offset: offset }
      query[:status] = status if status

      response = self.class.get('/v1/jobs', query: query)
      data = parse_response(response)

      raise APIError, data['error'] || 'Failed to list jobs' unless data['success']

      data['jobs']
    end

    # Get job status
    #
    # @param job_id [String] Job ID
    #
    # @return [Hash] Job details
    #
    # @example
    #   job = client.get_job('job-123')
    #   puts "Status: #{job['status']}"
    #
    def get_job(job_id)
      response = self.class.get("/v1/jobs/#{job_id}")
      data = parse_response(response)

      raise APIError, data['error'] || 'Failed to get job' unless data['success']

      data['job']
    end

    private

    # Poll job status until completion
    #
    # @param job_id [String] Job ID to poll
    # @param max_attempts [Integer] Maximum polling attempts (default: 60)
    # @param interval [Integer] Polling interval in seconds (default: 2)
    #
    # @return [Hash] Job result
    #
    def poll_job_status(job_id, max_attempts: 60, interval: 2)
      attempts = 0

      while attempts < max_attempts
        attempts += 1

        # Wait before polling (except first attempt)
        sleep(interval) if attempts > 1

        response = self.class.get("/v1/jobs/#{job_id}")
        data = parse_response(response)

        raise APIError, 'Failed to get job status' unless data['success']

        job = data['job']
        status = job['status']

        emit(:status, {
          job_id: job_id,
          status: status,
          attempt: attempts,
          max_attempts: max_attempts
        })

        return job if status == 'completed'
        raise APIError, job['error_message'] || 'Conversion failed' if status == 'failed'
        raise APIError, 'Job expired' if status == 'expired'
      end

      raise ConversionTimeoutError, 'Conversion timeout - job did not complete in time'
    end

    # Download file from URL
    #
    # @param url [String] Download URL
    # @param output_path [String] Output file path
    #
    def download_file(url, output_path)
      response = HTTParty.get(url)

      # Ensure output directory exists
      output_dir = File.dirname(output_path)
      FileUtils.mkdir_p(output_dir) unless File.directory?(output_dir)

      File.binwrite(output_path, response.body)
    end

    # Generate output path based on input path and target format
    #
    # @param input_path [String] Input file path
    # @param target_format [String] Target format
    #
    # @return [String] Output file path
    #
    def generate_output_path(input_path, target_format)
      dir = File.dirname(input_path)
      base_name = File.basename(input_path, File.extname(input_path))
      File.join(dir, "#{base_name}.#{target_format.downcase}")
    end

    # Parse HTTP response
    #
    # @param response [HTTParty::Response] HTTP response
    #
    # @return [Hash] Parsed JSON response
    #
    def parse_response(response)
      JSON.parse(response.body)
    rescue JSON::ParserError
      raise APIError, "Invalid API response: #{response.body}"
    end

    # Emit event to registered callbacks
    #
    # @param event [Symbol] Event name
    # @param data [Hash] Event data
    #
    def emit(event, data)
      return unless @callbacks[event]

      @callbacks[event].each { |callback| callback.call(data) }
    end
  end
end
