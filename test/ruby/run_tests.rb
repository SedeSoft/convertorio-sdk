#!/usr/bin/env ruby

# Simple test runner that loads and runs the RSpec tests directly

# Require dependencies first
require 'bundler/setup'
require 'rspec'
require 'webmock/rspec'

# Add lib path to load path
lib_path = File.expand_path('../../libs/ruby/lib', __FILE__)
$LOAD_PATH.unshift(lib_path)

# Load our library directly by file path
load File.expand_path('../../libs/ruby/lib/convertorio.rb', __FILE__)

# Disable external HTTP requests during tests
WebMock.disable_net_connect!(allow_localhost: true)

# Load and run the test file
load File.expand_path('spec/convertorio_spec.rb', __FILE__)

# Run RSpec
exit RSpec::Core::Runner.run(['spec/convertorio_spec.rb', '--format', 'documentation'])
