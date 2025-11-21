#!/usr/bin/env ruby

# Test runner for Convertorio Ruby SDK

# Setup load paths
$LOAD_PATH.unshift File.expand_path('../../libs/ruby/lib', __FILE__)
$LOAD_PATH.unshift File.expand_path('spec', __FILE__)

# Load dependencies
require 'bundler/setup'
require 'spec_helper'

# Run RSpec programmatically
require 'rspec/core'

# Configure RSpec
RSpec.configure do |config|
  config.color = true
  config.formatter = :documentation
end

# Run the tests
exit RSpec::Core::Runner.run([File.expand_path('spec/convertorio_spec.rb', __FILE__)])
