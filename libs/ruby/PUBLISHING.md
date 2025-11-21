# Publishing the Convertorio Ruby SDK to RubyGems

This guide explains how to publish the Convertorio Ruby SDK to [RubyGems.org](https://rubygems.org).

## Prerequisites

1. **RubyGems Account**
   - Create an account at [rubygems.org](https://rubygems.org/sign_up)
   - Verify your email address

2. **RubyGems API Key**
   - Go to your [profile settings](https://rubygems.org/profile/edit)
   - Generate an API key if you haven't already
   - Your credentials will be stored in `~/.gem/credentials`

3. **Repository Access**
   - Ensure you have write access to the repository
   - Ensure you're authorized to publish the gem

## Pre-Publishing Checklist

Before publishing, make sure:

- [ ] All tests pass: `bundle exec rspec`
- [ ] Version number is updated in `convertorio-sdk.gemspec`
- [ ] CHANGELOG.md is updated with new version details
- [ ] README.md is up to date
- [ ] All changes are committed to git
- [ ] Code is reviewed and approved

## Publishing Steps

### 1. Update Version Number

Edit `convertorio-sdk.gemspec` and update the version:

```ruby
spec.version = "1.2.0"  # Update this
```

### 2. Update CHANGELOG

Add a new section to `CHANGELOG.md`:

```markdown
## [1.2.0] - 2025-01-21

### Added
- New feature description

### Changed
- Changed feature description

### Fixed
- Bug fix description
```

### 3. Commit Changes

```bash
git add convertorio-sdk.gemspec CHANGELOG.md
git commit -m "Bump version to 1.2.0"
```

### 4. Create Git Tag

```bash
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin main
git push origin v1.2.0
```

### 5. Build the Gem

```bash
bundle exec rake build
```

This creates a `.gem` file in the current directory: `convertorio-sdk-1.2.0.gem`

### 6. Test the Gem Locally (Optional but Recommended)

```bash
gem install ./convertorio-sdk-1.2.0.gem
```

Test it in a Ruby console:

```ruby
require 'convertorio'
client = Convertorio::Client.new(api_key: 'test')
```

Uninstall after testing:

```bash
gem uninstall convertorio-sdk
```

### 7. Publish to RubyGems

**Option A: Using Rake Task**

```bash
bundle exec rake publish
```

**Option B: Manual Publishing**

```bash
gem push convertorio-sdk-1.2.0.gem
```

### 8. Verify Publication

1. Visit [https://rubygems.org/gems/convertorio-sdk](https://rubygems.org/gems/convertorio-sdk)
2. Verify the new version appears
3. Check that documentation is correct

### 9. Test Installation

In a new directory:

```bash
gem install convertorio-sdk
```

Or with Bundler:

```ruby
# Gemfile
gem 'convertorio-sdk', '~> 1.2'
```

```bash
bundle install
```

## Publishing Script

The repository includes a Rake task for publishing:

```bash
bundle exec rake publish
```

This task will:
1. Verify all prerequisites
2. Build the gem
3. Push to RubyGems
4. Display confirmation

## Troubleshooting

### Authentication Issues

If you get authentication errors:

```bash
# View your credentials
cat ~/.gem/credentials

# Re-authenticate
gem signin
```

### Version Already Exists

Once a version is published, it cannot be republished. You must increment the version number and publish again.

### Invalid Gemspec

If the gemspec is invalid:

```bash
gem build convertorio-sdk.gemspec
```

This will show validation errors.

### Yank a Version (Emergency Only)

If you need to remove a version:

```bash
gem yank convertorio-sdk -v 1.2.0
```

**Warning:** This should only be done in emergency situations (security issues, broken builds). It's better to publish a patch version.

## Versioning Guidelines

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.x.x): Breaking API changes
  - Example: Removing methods, changing method signatures

- **MINOR** (x.1.x): New features, backward compatible
  - Example: Adding new conversion options, new methods

- **PATCH** (x.x.1): Bug fixes, backward compatible
  - Example: Fixing error handling, improving documentation

## Best Practices

1. **Test Thoroughly**
   - Run full test suite before publishing
   - Test installation in a clean environment
   - Test examples work with new version

2. **Document Changes**
   - Update CHANGELOG.md with all changes
   - Update README.md if API changes
   - Add migration guides for breaking changes

3. **Version Increments**
   - Don't skip versions
   - Follow semantic versioning strictly
   - Tag releases in git

4. **Communication**
   - Announce major releases
   - Notify users of breaking changes
   - Provide upgrade paths

5. **Security**
   - Keep API keys secure
   - Use 2FA on RubyGems account
   - Review code for vulnerabilities

## Post-Publishing

After publishing:

1. **Announcement**
   - Update website/blog with release notes
   - Post to social media if major release
   - Update documentation site

2. **Monitor**
   - Watch for issues on GitHub
   - Check download statistics
   - Respond to user feedback

3. **Support**
   - Answer questions
   - Fix critical bugs quickly
   - Plan next version based on feedback

## Continuous Integration

Consider setting up CI/CD to automate publishing:

```yaml
# .github/workflows/publish.yml
name: Publish Gem

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.2
      - run: bundle install
      - run: bundle exec rake build
      - run: |
          mkdir -p ~/.gem
          echo ":rubygems_api_key: ${{ secrets.RUBYGEMS_API_KEY }}" > ~/.gem/credentials
          chmod 0600 ~/.gem/credentials
      - run: gem push *.gem
```

## Support

For help with publishing:
- RubyGems Guides: [https://guides.rubygems.org/publishing/](https://guides.rubygems.org/publishing/)
- RubyGems Support: [https://help.rubygems.org/](https://help.rubygems.org/)
- Convertorio Support: [support@convertorio.com](mailto:support@convertorio.com)
