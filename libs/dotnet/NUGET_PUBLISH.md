# Publishing Convertorio.SDK to NuGet

This guide explains how to publish the Convertorio SDK for .NET to NuGet.org.

## Prerequisites

1. **NuGet Account**
   - Create an account at [nuget.org](https://www.nuget.org/)
   - Verify your email address

2. **API Key**
   - Go to [nuget.org/account/apikeys](https://www.nuget.org/account/apikeys)
   - Click "Create"
   - Set a key name (e.g., "Convertorio SDK")
   - Set expiration (recommended: 365 days)
   - Select scopes: "Push" and "Push new packages and package versions"
   - Click "Create"
   - **Copy and save the API key** (you won't see it again!)

3. **.NET SDK**
   - Install .NET SDK 6.0 or later
   - Verify: `dotnet --version`

## Pre-Publication Checklist

Before publishing, ensure:

- [ ] Version number is updated in `Convertorio.SDK.csproj`
- [ ] `CHANGELOG.md` is updated with changes
- [ ] README.md is up to date
- [ ] All tests pass: `dotnet test`
- [ ] Code builds without warnings: `dotnet build`
- [ ] License file exists
- [ ] Package metadata is correct in `.csproj`:
  - Package ID
  - Version
  - Authors
  - Description
  - Tags
  - License
  - Project URL
  - Repository URL

## Building the Package

### Step 1: Clean Previous Builds

```bash
cd sdk/libs/dotnet/Convertorio.SDK
dotnet clean
```

### Step 2: Restore Dependencies

```bash
dotnet restore
```

### Step 3: Build in Release Mode

```bash
dotnet build --configuration Release
```

Expected output:
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

### Step 4: Run Tests

```bash
cd ../../../tests/dotnet/Convertorio.SDK.Tests
dotnet test --configuration Release
```

Expected output:
```
Passed!  - Failed:     0, Passed:    24, Skipped:     0, Total:    24
```

### Step 5: Create NuGet Package

```bash
cd ../../../libs/dotnet/Convertorio.SDK
dotnet pack --configuration Release
```

Expected output:
```
Successfully created package 'bin\Release\Convertorio.SDK.1.2.0.nupkg'.
Successfully created package 'bin\Release\Convertorio.SDK.1.2.0.snupkg'.
```

The package will be created at:
```
bin/Release/Convertorio.SDK.1.2.0.nupkg
bin/Release/Convertorio.SDK.1.2.0.snupkg (symbols)
```

### Step 6: Inspect Package (Optional)

You can inspect the package contents:

```bash
# On Windows
explorer bin\Release

# On Linux/Mac
ls -lh bin/Release
```

Or use NuGet Package Explorer:
- Download from [github.com/NuGetPackageExplorer/NuGetPackageExplorer](https://github.com/NuGetPackageExplorer/NuGetPackageExplorer)
- Open the `.nupkg` file to verify contents

## Publishing to NuGet

### Method 1: Using .NET CLI (Recommended)

```bash
dotnet nuget push bin/Release/Convertorio.SDK.1.2.0.nupkg \
  --api-key YOUR_API_KEY \
  --source https://api.nuget.org/v3/index.json
```

Replace `YOUR_API_KEY` with your actual API key from NuGet.org.

Expected output:
```
Pushing Convertorio.SDK.1.2.0.nupkg to 'https://www.nuget.org/api/v2/package'...
  PUT https://www.nuget.org/api/v2/package/
  Created https://www.nuget.org/api/v2/package/ 2034ms
Your package was pushed.
```

### Method 2: Using nuget.exe

```bash
nuget push bin/Release/Convertorio.SDK.1.2.0.nupkg YOUR_API_KEY -Source https://api.nuget.org/v3/index.json
```

### Method 3: Manual Upload

1. Go to [nuget.org/packages/manage/upload](https://www.nuget.org/packages/manage/upload)
2. Click "Browse" and select `Convertorio.SDK.1.2.0.nupkg`
3. Click "Upload"
4. Review the package information
5. Click "Submit"

## Verification

### 1. Check NuGet.org

Visit: [nuget.org/packages/Convertorio.SDK](https://www.nuget.org/packages/Convertorio.SDK)

It may take a few minutes for the package to appear and be indexed.

### 2. Test Installation

Create a test project and install:

```bash
mkdir test-convertorio
cd test-convertorio
dotnet new console
dotnet add package Convertorio.SDK
```

Verify it's installed:

```bash
dotnet list package
```

Expected output:
```
Project 'test-convertorio' has the following package references
   [netX.X]
   Top-level Package      Requested   Resolved
   > Convertorio.SDK      *           1.2.0
```

### 3. Test the SDK

Create a simple test file `Program.cs`:

```csharp
using Convertorio.SDK;
using System;

var client = new ConvertorioClient("test_key");
Console.WriteLine("✅ Convertorio SDK v1.2.0 loaded successfully!");
```

Run:

```bash
dotnet run
```

## Post-Publication

### 1. Create a Git Tag

```bash
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

### 2. Create GitHub Release

1. Go to [github.com/SedeSoft/convertorio-sdk/releases](https://github.com/SedeSoft/convertorio-sdk/releases)
2. Click "Draft a new release"
3. Select tag: `v1.2.0`
4. Title: `Convertorio SDK for .NET v1.2.0`
5. Description: Copy from CHANGELOG.md
6. Attach the `.nupkg` file (optional)
7. Click "Publish release"

### 3. Update Documentation

- Update main README.md to include .NET SDK
- Update website documentation
- Announce on social media (optional)

## Troubleshooting

### "Package already exists"

You cannot republish the same version. Increment the version number in `.csproj` and rebuild.

### "Invalid API key"

- Check that you copied the API key correctly
- Verify the key hasn't expired
- Ensure the key has "Push" permissions

### "Package validation failed"

- Ensure all required metadata is present in `.csproj`
- Check that License expression is valid
- Verify README.md is included

### "The package already exists in the feed"

The version is already published. You must:
1. Increment version in `.csproj` (e.g., 1.2.0 → 1.2.1)
2. Rebuild: `dotnet pack --configuration Release`
3. Push again

### "Package size too large"

NuGet has a 250 MB limit. If your package exceeds this:
- Remove unnecessary files from the package
- Use `.nuspec` to exclude large files
- Consider splitting into multiple packages

## Version Naming

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (1.x.x): Breaking changes
- **MINOR** version (x.2.x): New features, backwards compatible
- **PATCH** version (x.x.1): Bug fixes, backwards compatible

Examples:
- `1.2.0` - Initial release
- `1.2.1` - Bug fix
- `1.3.0` - New feature
- `2.0.0` - Breaking change

## Unlisting a Package

If you need to unlist a version (not delete, but hide from search):

1. Go to [nuget.org/packages/Convertorio.SDK](https://www.nuget.org/packages/Convertorio.SDK)
2. Sign in
3. Click "Manage package"
4. Select the version
5. Click "Unlist"

**Note:** Unlisting doesn't delete the package. Projects that reference it can still use it.

## Support

For issues:
- NuGet Support: [nuget.org/policies/Contact](https://www.nuget.org/policies/Contact)
- Convertorio Support: [support@convertorio.com](mailto:support@convertorio.com)

---

**Ready to publish?** Just run:

```bash
cd sdk/libs/dotnet/Convertorio.SDK
dotnet pack --configuration Release
dotnet nuget push bin/Release/Convertorio.SDK.1.2.0.nupkg --api-key YOUR_API_KEY --source https://api.nuget.org/v3/index.json
```

Good luck! 🚀
