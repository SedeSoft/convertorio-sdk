#!/usr/bin/env ruby

# Batch Conversion Example
#
# This example shows how to convert multiple files in a directory

require_relative '../../libs/ruby/lib/convertorio'

client = Convertorio::Client.new(
  api_key: 'your_api_key_here'
)

# Get all PNG files from a directory
input_dir = './images'
files = Dir.glob("#{input_dir}/*.png")

if files.empty?
  puts "No PNG files found in #{input_dir}"
  exit(0)
end

puts "Found #{files.size} PNG files to convert\n\n"

# Convert all files to WebP
converted = 0
failed = 0

files.each_with_index do |file, index|
  begin
    puts "[#{index + 1}/#{files.size}] Converting: #{File.basename(file)}"

    result = client.convert_file(
      input_path: file,
      target_format: 'webp'
    )

    size_kb = (result[:file_size] / 1024.0).round(2)
    puts "✓ Converted: #{File.basename(result[:output_path])} (#{size_kb} KB)\n\n"
    converted += 1

  rescue Convertorio::Error => e
    puts "✗ Failed: #{e.message}\n\n"
    failed += 1
  end
end

puts "\n" + "="*50
puts "Batch conversion completed!"
puts "Successful: #{converted}"
puts "Failed: #{failed}"
puts "Total: #{files.size}"
