Gem::Specification.new do |spec|
  spec.name          = "convertorio-sdk"
  spec.version       = "1.2.1"
  spec.authors       = ["Convertorio"]
  spec.email         = ["support@convertorio.com"]

  spec.summary       = %q{Official Convertorio SDK for Ruby - Convert images easily with a simple API}
  spec.description   = %q{Ruby SDK for the Convertorio API. Convert files between 20+ formats with AI-powered OCR for text extraction. Supports JPG, PNG, WebP, AVIF, HEIC, GIF, BMP, TIFF, ICO, PDF, and more.}
  spec.homepage      = "https://github.com/SedeSoft/convertorio-sdk"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 2.7.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/SedeSoft/convertorio-sdk/tree/main/libs/ruby"
  spec.metadata["changelog_uri"] = "https://github.com/SedeSoft/convertorio-sdk/blob/main/libs/ruby/CHANGELOG.md"
  spec.metadata["documentation_uri"] = "https://github.com/SedeSoft/convertorio-sdk/tree/main/docs/ruby"
  spec.metadata["bug_tracker_uri"] = "https://github.com/SedeSoft/convertorio-sdk/issues"

  spec.files = Dir["lib/**/*", "README.md", "LICENSE", "CHANGELOG.md"]
  spec.require_paths = ["lib"]

  # Runtime dependencies
  spec.add_dependency "httparty", "~> 0.21"
  spec.add_dependency "json", "~> 2.6"

  # Development dependencies
  spec.add_development_dependency "bundler", "~> 2.0"
  spec.add_development_dependency "rake", "~> 13.0"
  spec.add_development_dependency "rspec", "~> 3.12"
  spec.add_development_dependency "webmock", "~> 3.18"
end
