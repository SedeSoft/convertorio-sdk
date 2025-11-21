#!/usr/bin/env ruby

# Advanced Conversion Options Example
#
# This example demonstrates using advanced conversion options like
# aspect ratio, quality, resizing, and crop strategies

require_relative '../../libs/ruby/lib/convertorio'

client = Convertorio::Client.new(
  api_key: 'your_api_key_here'
)

puts "Advanced Conversion Options Examples\n\n"

begin
  # Example 1: Convert with aspect ratio change and crop strategy
  puts "1. Converting with 16:9 aspect ratio and center crop..."
  result1 = client.convert_file(
    input_path: './photo.jpg',
    target_format: 'webp',
    output_path: './output/photo-16x9.webp',
    conversion_metadata: {
      aspect_ratio: '16:9',
      crop_strategy: 'crop-center'
    }
  )
  puts "✓ Saved to: #{result1[:output_path]}\n\n"

  # Example 2: Convert with quality control
  puts "2. Converting to JPG with high quality (90)..."
  result2 = client.convert_file(
    input_path: './photo.png',
    target_format: 'jpg',
    output_path: './output/photo-high-quality.jpg',
    conversion_metadata: {
      quality: 90
    }
  )
  puts "✓ Saved to: #{result2[:output_path]}\n\n"

  # Example 3: Convert to ICO with specific size
  puts "3. Converting to ICO format (32x32 pixels)..."
  result3 = client.convert_file(
    input_path: './logo.png',
    target_format: 'ico',
    output_path: './output/favicon.ico',
    conversion_metadata: {
      icon_size: 32,
      crop_strategy: 'crop-center'
    }
  )
  puts "✓ Saved to: #{result3[:output_path]}\n\n"

  # Example 4: Convert with resize by width
  puts "4. Resizing to 800px width (height auto)..."
  result4 = client.convert_file(
    input_path: './photo.jpg',
    target_format: 'jpg',
    output_path: './output/photo-800w.jpg',
    conversion_metadata: {
      resize_width: 800
    }
  )
  puts "✓ Saved to: #{result4[:output_path]}\n\n"

  # Example 5: Convert with multiple options combined
  puts "5. Converting with multiple options (aspect ratio + quality + resize)..."
  result5 = client.convert_file(
    input_path: './photo.jpg',
    target_format: 'webp',
    output_path: './output/photo-optimized.webp',
    conversion_metadata: {
      aspect_ratio: '16:9',
      crop_strategy: 'crop-center',
      quality: 85,
      resize_width: 1920
    }
  )
  puts "✓ Saved to: #{result5[:output_path]}\n\n"

  # Example 6: Square image for social media (1:1 aspect ratio)
  puts "6. Creating square image for Instagram (1:1)..."
  result6 = client.convert_file(
    input_path: './photo.jpg',
    target_format: 'jpg',
    output_path: './output/photo-square.jpg',
    conversion_metadata: {
      aspect_ratio: '1:1',
      crop_strategy: 'crop-center',
      resize_width: 1080
    }
  )
  puts "✓ Saved to: #{result6[:output_path]}\n\n"

  # Example 7: Vertical image for Stories (9:16)
  puts "7. Creating vertical image for Stories (9:16)..."
  result7 = client.convert_file(
    input_path: './photo.jpg',
    target_format: 'jpg',
    output_path: './output/photo-story.jpg',
    conversion_metadata: {
      aspect_ratio: '9:16',
      crop_strategy: 'crop-center',
      resize_width: 1080
    }
  )
  puts "✓ Saved to: #{result7[:output_path]}\n\n"

  puts "="*50
  puts "All conversions completed successfully!"
  puts "Check the ./output/ directory for results"

rescue Convertorio::Error => e
  puts "✗ Conversion failed: #{e.message}"
  exit(1)
end
