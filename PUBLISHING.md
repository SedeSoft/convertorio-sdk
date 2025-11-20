# Publishing Guide - Convertorio SDK

This guide explains how to publish the Convertorio SDK packages to npm and other package managers.

## Publishing to npm (Node.js SDK)

### Prerequisites

1. **npm account**: Create one at [npmjs.com/signup](https://npmjs.com/signup)
2. **Organization scope**: Request access to the `@convertorio` organization or use a different scope
3. **2FA enabled**: Recommended for security

### Step-by-Step Publishing Process

#### 1. Login to npm

```bash
npm login
```

Enter your credentials:
- Username
- Password
- Email
- OTP (if 2FA is enabled)

Verify you're logged in:
```bash
npm whoami
```

#### 2. Navigate to the package directory

```bash
cd sdk/libs/nodejs
```

#### 3. Verify package contents

Check what will be published:
```bash
npm pack --dry-run
```

This shows which files will be included in the package.

#### 4. Test the package locally

Install dependencies:
```bash
npm install
```

Run tests (if available):
```bash
npm test
```

#### 5. Check for issues

Validate the package:
```bash
npm publish --dry-run
```

This simulates publishing without actually doing it.

#### 6. Publish to npm

**For scoped packages (convertorio-sdk):**

First time publishing:
```bash
npm publish --access public
```

Subsequent updates:
```bash
npm publish
```

**For unscoped packages (convertorio-sdk):**
```bash
npm publish
```

#### 7. Verify publication

Check that the package is available:
```bash
npm view convertorio-sdk
```

Or visit: https://www.npmjs.com/package/convertorio-sdk

### Version Updates

When publishing updates, follow semantic versioning:

#### Patch version (1.0.0 → 1.0.1)
Bug fixes and minor changes:
```bash
npm version patch
npm publish
```

#### Minor version (1.0.0 → 1.1.0)
New features (backward compatible):
```bash
npm version minor
npm publish
```

#### Major version (1.0.0 → 2.0.0)
Breaking changes:
```bash
npm version major
npm publish
```

### Troubleshooting

#### Error: "You do not have permission to publish"

**Solution 1**: Change package name
```json
{
  "name": "convertorio-sdk"  // Instead of convertorio-sdk
}
```

**Solution 2**: Create npm organization
1. Go to [npmjs.com/org/create](https://www.npmjs.com/org/create)
2. Create `convertorio` organization
3. Add team members if needed

**Solution 3**: Use your username as scope
```json
{
  "name": "@yourusername/convertorio-sdk"
}
```

#### Error: "package name already exists"

The name is taken. Options:
1. Check if you own it: `npm owner ls convertorio-sdk`
2. Use a different name: `convertorio-api-sdk`, `convertorio-js`, etc.
3. Contact the owner to transfer or deprecate

#### Error: "402 Payment Required"

You need to be logged in:
```bash
npm logout
npm login
```

### Publishing Checklist

Before publishing, verify:

- [ ] Version number updated in package.json
- [ ] README.md is complete and accurate
- [ ] LICENSE file is included
- [ ] All dependencies are in package.json
- [ ] No sensitive data in code
- [ ] Tests pass (if available)
- [ ] Documentation is up to date
- [ ] CHANGELOG updated (if exists)
- [ ] Git tag created for version

### Post-Publication

After publishing:

1. **Test installation**:
   ```bash
   npm install convertorio-sdk
   ```

2. **Update documentation** with installation instructions

3. **Announce** the release:
   - GitHub release notes
   - Twitter/social media
   - Email newsletter
   - Blog post

4. **Monitor** for issues:
   - Check npm download stats
   - Review GitHub issues
   - Monitor error reports

## Alternative: Publishing without Organization Scope

If you can't use `convertorio-sdk`, publish as:

### Option 1: Unscoped package
```json
{
  "name": "convertorio-sdk"
}
```

Install with:
```bash
npm install convertorio-sdk
```

Use in code:
```javascript
const ConvertorioClient = require('convertorio-sdk');
```

### Option 2: Personal scope
```json
{
  "name": "@yourusername/convertorio-sdk"
}
```

Install with:
```bash
npm install @yourusername/convertorio-sdk
```

## Publishing Python Package (PyPI) - Coming Soon

Steps for publishing to PyPI:

```bash
cd sdk/libs/python
python setup.py sdist bdist_wheel
twine upload dist/*
```

## Publishing PHP Package (Packagist) - Coming Soon

Steps for publishing to Packagist:

1. Create `composer.json`
2. Push to GitHub
3. Submit to packagist.org
4. Set up auto-update webhook

## Automation with GitHub Actions

You can automate publishing with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: cd sdk/libs/nodejs && npm ci
      - run: cd sdk/libs/nodejs && npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Best Practices

1. **Always test before publishing** - Install locally and run examples
2. **Use semantic versioning** - Follow semver.org guidelines
3. **Maintain CHANGELOG** - Document all changes
4. **Tag releases in Git** - Match package versions
5. **Deprecate old versions** - Use `npm deprecate` for broken versions
6. **Monitor downloads** - Track usage and popularity
7. **Respond to issues** - Help users and fix bugs promptly

## Support

If you have issues publishing:
- npm support: support@npmjs.com
- GitHub issues: https://github.com/convertorio/sdk/issues
- Email: support@convertorio.com
