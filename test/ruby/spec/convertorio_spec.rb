require 'spec_helper'
require 'tempfile'

RSpec.describe Convertorio::Client do
  let(:api_key) { 'test_api_key_12345' }
  let(:base_url) { 'https://api.convertorio.com' }
  let(:client) { described_class.new(api_key: api_key) }

  describe '#initialize' do
    it 'creates a client with valid API key' do
      expect(client).to be_a(Convertorio::Client)
      expect(client.api_key).to eq(api_key)
      expect(client.base_url).to eq(base_url)
    end

    it 'allows custom base URL' do
      custom_client = described_class.new(api_key: api_key, base_url: 'https://custom.api.com')
      expect(custom_client.base_url).to eq('https://custom.api.com')
    end

    it 'raises error when API key is missing' do
      expect {
        described_class.new(api_key: nil)
      }.to raise_error(Convertorio::Error, /API key is required/)
    end

    it 'raises error when API key is empty' do
      expect {
        described_class.new(api_key: '')
      }.to raise_error(Convertorio::Error, /API key is required/)
    end
  end

  describe '#on' do
    it 'registers event callbacks' do
      callback_called = false
      client.on(:start) { callback_called = true }

      # Trigger the event manually
      client.send(:emit, :start, {})

      expect(callback_called).to be true
    end

    it 'allows multiple callbacks for same event' do
      callback_count = 0
      client.on(:progress) { callback_count += 1 }
      client.on(:progress) { callback_count += 1 }

      client.send(:emit, :progress, {})

      expect(callback_count).to eq(2)
    end
  end

  describe '#get_account' do
    let(:account_response) do
      {
        success: true,
        account: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          plan: 'free',
          points: 100,
          daily_conversions_remaining: 5,
          total_conversions: 42
        }
      }.to_json
    end

    it 'retrieves account information' do
      stub_request(:get, "#{base_url}/v1/account")
        .with(headers: { 'Authorization' => "Bearer #{api_key}" })
        .to_return(status: 200, body: account_response)

      account = client.get_account

      expect(account['id']).to eq('user-123')
      expect(account['email']).to eq('test@example.com')
      expect(account['points']).to eq(100)
    end

    it 'raises error on failed request' do
      stub_request(:get, "#{base_url}/v1/account")
        .to_return(status: 200, body: { success: false, error: 'Invalid API key' }.to_json)

      expect {
        client.get_account
      }.to raise_error(Convertorio::APIError, /Invalid API key/)
    end
  end

  describe '#list_jobs' do
    let(:jobs_response) do
      {
        success: true,
        jobs: [
          {
            id: 'job-123',
            status: 'completed',
            original_filename: 'test.png',
            source_format: 'png',
            target_format: 'jpg'
          }
        ]
      }.to_json
    end

    it 'lists jobs with default parameters' do
      stub_request(:get, "#{base_url}/v1/jobs?limit=50&offset=0")
        .to_return(status: 200, body: jobs_response)

      jobs = client.list_jobs

      expect(jobs).to be_an(Array)
      expect(jobs.first['id']).to eq('job-123')
    end

    it 'accepts custom parameters' do
      stub_request(:get, "#{base_url}/v1/jobs?limit=10&offset=5&status=completed")
        .to_return(status: 200, body: jobs_response)

      jobs = client.list_jobs(limit: 10, offset: 5, status: 'completed')

      expect(jobs).to be_an(Array)
    end
  end

  describe '#get_job' do
    let(:job_id) { 'job-123' }
    let(:job_response) do
      {
        success: true,
        job: {
          id: job_id,
          status: 'completed',
          original_filename: 'test.png',
          download_url: 'https://example.com/file.jpg'
        }
      }.to_json
    end

    it 'retrieves job details' do
      stub_request(:get, "#{base_url}/v1/jobs/#{job_id}")
        .to_return(status: 200, body: job_response)

      job = client.get_job(job_id)

      expect(job['id']).to eq(job_id)
      expect(job['status']).to eq('completed')
    end
  end

  describe '#convert_file' do
    let(:temp_file) do
      file = Tempfile.new(['test', '.png'])
      file.write('fake image data')
      file.rewind
      file
    end

    let(:upload_url_response) do
      {
        success: true,
        job_id: 'job-123',
        upload_url: 'https://s3.example.com/upload'
      }.to_json
    end

    let(:confirm_response) do
      {
        success: true,
        status: 'processing'
      }.to_json
    end

    let(:job_completed_response) do
      {
        success: true,
        job: {
          id: 'job-123',
          status: 'completed',
          download_url: 'https://s3.example.com/download',
          processing_time_ms: 1250
        }
      }.to_json
    end

    let(:downloaded_file) { 'converted image data' }

    before do
      # Stub upload URL request
      stub_request(:post, "#{base_url}/v1/convert/upload-url")
        .to_return(status: 200, body: upload_url_response)

      # Stub S3 upload
      stub_request(:put, 'https://s3.example.com/upload')
        .to_return(status: 200)

      # Stub confirm request
      stub_request(:post, "#{base_url}/v1/convert/confirm")
        .to_return(status: 200, body: confirm_response)

      # Stub job status polling
      stub_request(:get, "#{base_url}/v1/jobs/job-123")
        .to_return(status: 200, body: job_completed_response)

      # Stub file download
      stub_request(:get, 'https://s3.example.com/download')
        .to_return(status: 200, body: downloaded_file)
    end

    after do
      temp_file.close
      temp_file.unlink
    end

    it 'converts a file successfully' do
      result = client.convert_file(
        input_path: temp_file.path,
        target_format: 'jpg'
      )

      expect(result[:success]).to be true
      expect(result[:job_id]).to eq('job-123')
      expect(result[:source_format]).to eq('png')
      expect(result[:target_format]).to eq('jpg')
      expect(result[:processing_time]).to eq(1250)
    end

    it 'raises error when input_path is missing' do
      expect {
        client.convert_file(target_format: 'jpg')
      }.to raise_error(Convertorio::Error, /input_path is required/)
    end

    it 'raises error when target_format is missing' do
      expect {
        client.convert_file(input_path: temp_file.path)
      }.to raise_error(Convertorio::Error, /target_format is required/)
    end

    it 'raises error when file does not exist' do
      expect {
        client.convert_file(
          input_path: '/nonexistent/file.png',
          target_format: 'jpg'
        )
      }.to raise_error(Convertorio::FileNotFoundError)
    end

    it 'accepts conversion metadata' do
      request_body = nil

      stub_request(:post, "#{base_url}/v1/convert/upload-url")
        .to_return do |request|
          request_body = JSON.parse(request.body)
          { status: 200, body: upload_url_response }
        end

      client.convert_file(
        input_path: temp_file.path,
        target_format: 'jpg',
        conversion_metadata: {
          quality: 90,
          aspect_ratio: '16:9'
        }
      )

      expect(request_body['conversion_metadata']).to eq({
        'quality' => 90,
        'aspect_ratio' => '16:9'
      })
    end

    it 'emits start event' do
      event_data = nil
      client.on(:start) { |data| event_data = data }

      client.convert_file(
        input_path: temp_file.path,
        target_format: 'jpg'
      )

      expect(event_data).not_to be_nil
      expect(event_data[:source_format]).to eq('png')
      expect(event_data[:target_format]).to eq('jpg')
    end

    it 'emits progress events' do
      progress_steps = []
      client.on(:progress) { |data| progress_steps << data[:step] }

      client.convert_file(
        input_path: temp_file.path,
        target_format: 'jpg'
      )

      expect(progress_steps).to include(
        'requesting-upload-url',
        'uploading',
        'confirming',
        'converting',
        'downloading'
      )
    end

    it 'emits complete event' do
      complete_data = nil
      client.on(:complete) { |data| complete_data = data }

      client.convert_file(
        input_path: temp_file.path,
        target_format: 'jpg'
      )

      expect(complete_data).not_to be_nil
      expect(complete_data[:success]).to be true
      expect(complete_data[:job_id]).to eq('job-123')
    end

    it 'emits error event on failure' do
      error_data = nil
      client.on(:error) { |data| error_data = data }

      stub_request(:post, "#{base_url}/v1/convert/upload-url")
        .to_return(status: 200, body: { success: false, error: 'API error' }.to_json)

      expect {
        client.convert_file(
          input_path: temp_file.path,
          target_format: 'jpg'
        )
      }.to raise_error(Convertorio::APIError)

      expect(error_data).not_to be_nil
      expect(error_data[:success]).to be false
    end
  end

  describe 'error handling' do
    it 'handles conversion timeout' do
      job_processing_response = {
        success: true,
        job: {
          id: 'job-123',
          status: 'processing'
        }
      }.to_json

      stub_request(:get, "#{base_url}/v1/jobs/job-123")
        .to_return(status: 200, body: job_processing_response)

      expect {
        client.send(:poll_job_status, 'job-123', max_attempts: 2, interval: 0)
      }.to raise_error(Convertorio::ConversionTimeoutError, /timeout/)
    end

    it 'handles failed job' do
      job_failed_response = {
        success: true,
        job: {
          id: 'job-123',
          status: 'failed',
          error_message: 'Conversion failed'
        }
      }.to_json

      stub_request(:get, "#{base_url}/v1/jobs/job-123")
        .to_return(status: 200, body: job_failed_response)

      expect {
        client.send(:poll_job_status, 'job-123')
      }.to raise_error(Convertorio::APIError, /Conversion failed/)
    end

    it 'handles expired job' do
      job_expired_response = {
        success: true,
        job: {
          id: 'job-123',
          status: 'expired'
        }
      }.to_json

      stub_request(:get, "#{base_url}/v1/jobs/job-123")
        .to_return(status: 200, body: job_expired_response)

      expect {
        client.send(:poll_job_status, 'job-123')
      }.to raise_error(Convertorio::APIError, /expired/)
    end
  end
end
