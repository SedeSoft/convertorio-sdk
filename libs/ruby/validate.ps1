# Simple validation script for Convertorio Ruby SDK

Write-Host "Validating Convertorio Ruby SDK Structure..." -ForegroundColor Cyan
Write-Host ""

$errors = 0

# Check main files
$mainFiles = @(
    "convertorio-sdk.gemspec",
    "lib/convertorio.rb",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
    "Gemfile",
    "Rakefile"
)

Write-Host "Checking main SDK files..." -ForegroundColor Yellow
foreach ($file in $mainFiles) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $file" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "Checking example files..." -ForegroundColor Yellow

$examplePath = "../../examples/ruby"
if (Test-Path $examplePath) {
    $exampleFiles = Get-ChildItem $examplePath -File
    Write-Host "  Found $($exampleFiles.Count) example files" -ForegroundColor Green
    foreach ($file in $exampleFiles) {
        Write-Host "    - $($file.Name)" -ForegroundColor Gray
    }
} else {
    Write-Host "  [MISSING] examples directory" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "Checking test files..." -ForegroundColor Yellow

$testPath = "../../tests/ruby"
if (Test-Path $testPath) {
    if (Test-Path "$testPath/spec/convertorio_spec.rb") {
        Write-Host "  [OK] Test suite found" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] Test suite" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host "  [MISSING] tests directory" -ForegroundColor Red
    $errors++
}

Write-Host ""
Write-Host "Checking documentation..." -ForegroundColor Yellow

$docs = @("README.md", "CHANGELOG.md", "CONTRIBUTING.md", "PUBLISHING.md", "TESTING_GUIDE.md", "WINDOWS_SETUP.md")
foreach ($doc in $docs) {
    if (Test-Path $doc) {
        $size = (Get-Item $doc).Length
        Write-Host "  [OK] $doc ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $doc" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=" * 50
if ($errors -eq 0) {
    Write-Host "SUCCESS: All required files are present!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Install Ruby (see WINDOWS_SETUP.md)" -ForegroundColor White
    Write-Host "2. Run: cd ../../tests/ruby" -ForegroundColor White
    Write-Host "3. Run: bundle install" -ForegroundColor White
    Write-Host "4. Run: bundle exec rspec" -ForegroundColor White
} else {
    Write-Host "ERRORS: $errors file(s) missing" -ForegroundColor Red
}

exit $errors
