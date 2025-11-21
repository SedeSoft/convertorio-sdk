#!/usr/bin/env ruby

# Account Information Example
#
# This example shows how to retrieve account information and list recent jobs

require_relative '../../libs/ruby/lib/convertorio'

client = Convertorio::Client.new(
  api_key: 'your_api_key_here'
)

begin
  # Get account information
  puts "="*50
  puts "Account Information"
  puts "="*50

  account = client.get_account

  puts "ID: #{account['id']}"
  puts "Email: #{account['email']}"
  puts "Name: #{account['name']}"
  puts "Plan: #{account['plan'].upcase}"
  puts "Points: #{account['points']}"
  puts "Daily conversions remaining: #{account['daily_conversions_remaining']}"
  puts "Total conversions: #{account['total_conversions']}"

  # List recent jobs
  puts "\n" + "="*50
  puts "Recent Conversion Jobs"
  puts "="*50

  jobs = client.list_jobs(limit: 10)

  if jobs.empty?
    puts "No jobs found"
  else
    jobs.each_with_index do |job, index|
      puts "\n#{index + 1}. Job ID: #{job['id']}"
      puts "   Status: #{job['status']}"
      puts "   File: #{job['original_filename']}"
      puts "   Format: #{job['source_format']} → #{job['target_format']}"
      puts "   Processing time: #{job['processing_time_ms']} ms" if job['processing_time_ms']
      puts "   Created: #{job['created_at']}"
    end
  end

  # Get statistics
  puts "\n" + "="*50
  puts "Job Statistics"
  puts "="*50

  completed_jobs = client.list_jobs(status: 'completed')
  failed_jobs = client.list_jobs(status: 'failed')

  puts "Completed jobs: #{completed_jobs.size}"
  puts "Failed jobs: #{failed_jobs.size}"

  if completed_jobs.any?
    total_time = completed_jobs.sum { |job| job['processing_time_ms'] || 0 }
    avg_time = total_time / completed_jobs.size
    puts "Average processing time: #{avg_time.round(2)} ms"
  end

rescue Convertorio::APIError => e
  puts "API Error: #{e.message}"
  exit(1)
rescue Convertorio::Error => e
  puts "Error: #{e.message}"
  exit(1)
end
