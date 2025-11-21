#!/usr/bin/env ruby

# Basic Image Conversion Example
#
# This example shows how to convert a single image file

require_relative '../../libs/ruby/lib/convertorio'

# Initialize the client with your API key
client = Convertorio::Client.new(
  api_key: 'your_api_key_here' # Get your API key from https://convertorio.com/account
)

begin
  puts "Starting image conversion...\n\n"

  # Convert an image
  result = client.convert_file(
    input_path: './input.png',
    target_format: 'jpg'
    # output_path is optional - will auto-generate if not provided
  )

  puts "\n✓ Conversion completed successfully!"
  puts "Result:"
  puts "  Input file: #{result[:input_path]}"
  puts "  Output file: #{result[:output_path]}"
  puts "  Format: #{result[:source_format]} → #{result[:target_format]}"
  puts "  File size: #{'%.2f' % (result[:file_size] / 1024.0)} KB"
  puts "  Processing time: #{result[:processing_time]} ms"

rescue Convertorio::Error => e
  puts "✗ Conversion failed: #{e.message}"
  exit(1)
end
