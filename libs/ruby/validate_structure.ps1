# Convertorio Ruby SDK - Structure Validation Script
# This script validates that all required files are present and properly structured

Write-Host "🔍 Validating Convertorio Ruby SDK Structure..." -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Define required files
$requiredFiles = @(
    "convertorio-sdk.gemspec",
    "lib/convertorio.rb",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
    "Gemfile",
    "Rakefile",
    ".gitignore",
    "CONTRIBUTING.md",
    "PUBLISHING.md",
    "TESTING_GUIDE.md",
    "WINDOWS_SETUP.md"
)

# Define required example files
$exampleFiles = @(
    "../../examples/ruby/basic_conversion.rb",
    "../../examples/ruby/with_events.rb",
    "../../examples/ruby/batch_conversion.rb",
    "../../examples/ruby/account_info.rb",
    "../../examples/ruby/advanced_options.rb",
    "../../examples/ruby/README.md",
    "../../examples/ruby/Gemfile"
)

# Define required test files
$testFiles = @(
    "../../tests/ruby/spec/spec_helper.rb",
    "../../tests/ruby/spec/convertorio_spec.rb",
    "../../tests/ruby/Gemfile",
    "../../tests/ruby/Rakefile",
    "../../tests/ruby/.rspec",
    "../../tests/ruby/README.md"
)

function Test-FileExists {
    param (
        [string]$FilePath,
        [string]$Description
    )

    if (Test-Path $FilePath) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ MISSING: $Description" -ForegroundColor Red
        Write-Host "   Expected at: $FilePath" -ForegroundColor Yellow
        $script:errors++
        return $false
    }
}

function Test-FileContent {
    param (
        [string]$FilePath,
        [string]$Pattern,
        [string]$Description
    )

    if (Test-Path $FilePath) {
        $content = Get-Content $FilePath -Raw
        if ($content -match $Pattern) {
            Write-Host "  ✓ Contains: $Description" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "  ⚠ WARNING: Missing expected content: $Description" -ForegroundColor Yellow
            $script:warnings++
            return $false
        }
    }
    return $false
}

# Check main SDK files
Write-Host "📦 Main SDK Files" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

foreach ($file in $requiredFiles) {
    Test-FileExists -FilePath $file -Description $file
}

Write-Host ""

# Validate gemspec
Write-Host "📋 Validating Gemspec" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if (Test-Path "convertorio-sdk.gemspec") {
    Test-FileContent -FilePath "convertorio-sdk.gemspec" -Pattern "spec.name\s*=\s*['\"]convertorio-sdk['\"]" -Description "gem name"
    Test-FileContent -FilePath "convertorio-sdk.gemspec" -Pattern "spec.version\s*=\s*['\"]1\.2\.0['\"]" -Description "version 1.2.0"
    Test-FileContent -FilePath "convertorio-sdk.gemspec" -Pattern "spec.authors" -Description "authors"
    Test-FileContent -FilePath "convertorio-sdk.gemspec" -Pattern "httparty" -Description "httparty dependency"
    Test-FileContent -FilePath "convertorio-sdk.gemspec" -Pattern "rspec" -Description "rspec dev dependency"
}

Write-Host ""

# Validate main library
Write-Host "📚 Validating Main Library" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if (Test-Path "lib/convertorio.rb") {
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "module Convertorio" -Description "Convertorio module"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "class Client" -Description "Client class"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "def convert_file" -Description "convert_file method"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "def get_account" -Description "get_account method"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "def list_jobs" -Description "list_jobs method"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "def get_job" -Description "get_job method"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "class Error" -Description "Error class"
    Test-FileContent -FilePath "lib/convertorio.rb" -Pattern "class APIError" -Description "APIError class"
}

Write-Host ""

# Check example files
Write-Host "📝 Example Files" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

foreach ($file in $exampleFiles) {
    Test-FileExists -FilePath $file -Description $file
}

Write-Host ""

# Check test files
Write-Host "🧪 Test Files" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

foreach ($file in $testFiles) {
    Test-FileExists -FilePath $file -Description $file
}

Write-Host ""

# Validate test suite
Write-Host "🔬 Validating Test Suite" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if (Test-Path "../../tests/ruby/spec/convertorio_spec.rb") {
    Test-FileContent -FilePath "../../tests/ruby/spec/convertorio_spec.rb" -Pattern "RSpec.describe" -Description "RSpec tests"
    Test-FileContent -FilePath "../../tests/ruby/spec/convertorio_spec.rb" -Pattern "#initialize" -Description "initialization tests"
    Test-FileContent -FilePath "../../tests/ruby/spec/convertorio_spec.rb" -Pattern "#convert_file" -Description "conversion tests"
    Test-FileContent -FilePath "../../tests/ruby/spec/convertorio_spec.rb" -Pattern "WebMock" -Description "WebMock usage"
}

Write-Host ""

# Check README content
Write-Host "📖 Validating Documentation" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if (Test-Path "README.md") {
    Test-FileContent -FilePath "README.md" -Pattern "# Convertorio SDK for Ruby" -Description "title"
    Test-FileContent -FilePath "README.md" -Pattern "## Installation" -Description "installation section"
    Test-FileContent -FilePath "README.md" -Pattern "## Quick Start" -Description "quick start section"
    Test-FileContent -FilePath "README.md" -Pattern "## API Reference" -Description "API reference section"
    Test-FileContent -FilePath "README.md" -Pattern "## Examples" -Description "examples section"
    Test-FileContent -FilePath "README.md" -Pattern "gem install convertorio-sdk" -Description "installation command"
}

Write-Host ""

# File size checks
Write-Host "📏 File Size Checks" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

function Check-FileSize {
    param (
        [string]$FilePath,
        [string]$Description,
        [int]$MinSize
    )

    if (Test-Path $FilePath) {
        $size = (Get-Item $FilePath).Length
        if ($size -gt $MinSize) {
            Write-Host "✅ $Description ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "⚠ WARNING: $Description is too small ($size bytes)" -ForegroundColor Yellow
            $script:warnings++
        }
    }
}

Check-FileSize -FilePath "lib/convertorio.rb" -Description "Main library" -MinSize 5000
Check-FileSize -FilePath "README.md" -Description "README" -MinSize 5000
Check-FileSize -FilePath "../../tests/ruby/spec/convertorio_spec.rb" -Description "Test suite" -MinSize 3000

Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Validation Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "✅ All checks passed! SDK structure is valid." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Install Ruby: See WINDOWS_SETUP.md" -ForegroundColor White
    Write-Host "2. Run tests: cd sdk/tests/ruby; bundle install; bundle exec rspec" -ForegroundColor White
    Write-Host "3. Build gem: cd sdk/libs/ruby; bundle exec rake build" -ForegroundColor White
    Write-Host "4. Publish: See PUBLISHING.md" -ForegroundColor White
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "⚠ Validation completed with $warnings warning(s)" -ForegroundColor Yellow
    Write-Host "The SDK structure is valid but some content may need review." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ Validation failed with $errors error(s) and $warnings warning(s)" -ForegroundColor Red
    Write-Host "Please fix the missing files before proceeding." -ForegroundColor Red
    exit 1
}
