#!/usr/bin/env ruby

# Simple Convertorio SDK Test
#
# Basic conversion test without advanced metadata options.

# Load dependencies
require 'httparty'
require 'json'
require 'fileutils'

# Load the SDK (assuming -I flag is used)
require 'convertorio'

API_KEY = 'cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3'

def run_test
  puts "Iniciando conversión..."

  begin
    # Create client
    client = Convertorio::Client.new(
      api_key: API_KEY,
      base_url: 'https://api.convertorio.com'
    )

    # Add event listeners for progress tracking
    client.on(:start) do |data|
      puts "🚀 Iniciando: #{data[:file_name]}"
      puts "   #{data[:source_format].upcase} → #{data[:target_format].upcase}"
    end

    client.on(:progress) do |data|
      puts "⏳ #{data[:message]}"
    end

    client.on(:status) do |data|
      puts "📊 Estado: #{data[:status]}"
    end

    # Convert the file
    result = client.convert_file(
      input_path: File.join(__dir__, 'test-image.png'),
      target_format: 'jpg',
      output_path: File.join(__dir__, 'output.jpg')
    )

    puts "\n✅ Conversión finalizada"
    puts "Job ID: #{result[:job_id]}"
    puts "Tiempo: #{result[:processing_time]}ms"
    puts "Tamaño: #{result[:file_size]} bytes"
    puts "Archivo: #{result[:output_path]}"

  rescue Convertorio::Error => e
    puts "❌ Error: #{e.message}"
    exit(1)
  rescue => e
    puts "❌ Error inesperado: #{e.message}"
    puts e.backtrace.first(5)
    exit(1)
  end
end

run_test
