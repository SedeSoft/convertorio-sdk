#!/usr/bin/env ruby

# Conversion with Event Listeners
#
# This example shows how to use event listeners to track conversion progress

require_relative '../../libs/ruby/lib/convertorio'

client = Convertorio::Client.new(
  api_key: 'your_api_key_here'
)

# Listen to conversion events
client.on(:start) do |data|
  puts "🚀 Starting conversion: #{data[:file_name]}"
  puts "   #{data[:source_format].upcase} → #{data[:target_format].upcase}\n\n"
end

client.on(:progress) do |data|
  puts "⏳ #{data[:message]}"
  puts "   Job ID: #{data[:job_id]}" if data[:job_id]
end

client.on(:status) do |data|
  puts "📊 Status: #{data[:status]} (attempt #{data[:attempt]}/#{data[:max_attempts]})"
end

client.on(:complete) do |data|
  puts "\n✅ Conversion completed!"
  puts "📁 Output file: #{data[:output_path]}"
  puts "⚡ Processing time: #{data[:processing_time]} ms"
  puts "💾 File size: #{'%.2f' % (data[:file_size] / 1024.0)} KB"
end

client.on(:error) do |data|
  puts "\n❌ Error: #{data[:error]}"
end

begin
  client.convert_file(
    input_path: './input.png',
    target_format: 'webp',
    output_path: './output.webp'
  )
rescue Convertorio::Error => e
  puts "Conversion failed: #{e.message}"
  exit(1)
end
