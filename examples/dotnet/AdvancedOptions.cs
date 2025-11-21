using System;
using System.Threading.Tasks;
using Convertorio.SDK;

namespace Convertorio.Examples
{
    /// <summary>
    /// Advanced conversion options example
    /// Demonstrates how to use advanced features like aspect ratio, crop strategy, and quality
    /// </summary>
    class AdvancedOptions
    {
        static async Task Main(string[] args)
        {
            const string API_KEY = "your_api_key_here";

            try
            {
                using (var client = new ConvertorioClient(API_KEY))
                {
                    // Example 1: Convert with quality adjustment
                    Console.WriteLine("Example 1: High-quality JPEG conversion\n");

                    var result1 = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "photo.png",
                        TargetFormat = "jpg",
                        OutputPath = "photo-hq.jpg",
                        ConversionMetadata = new ConversionMetadata
                        {
                            Quality = 95  // High quality (1-100)
                        }
                    });

                    Console.WriteLine($"✅ Created: {result1.OutputPath}");
                    Console.WriteLine($"   Size: {result1.FileSize / 1024} KB\n");

                    // Example 2: Crop to square aspect ratio
                    Console.WriteLine("Example 2: Square crop for social media\n");

                    var result2 = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "landscape.jpg",
                        TargetFormat = "png",
                        OutputPath = "square-profile.png",
                        ConversionMetadata = new ConversionMetadata
                        {
                            AspectRatio = "1:1",
                            CropStrategy = "crop-center"
                        }
                    });

                    Console.WriteLine($"✅ Created: {result2.OutputPath}\n");

                    // Example 3: WebP with quality and aspect ratio
                    Console.WriteLine("Example 3: Optimized WebP for web\n");

                    var result3 = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "banner.png",
                        TargetFormat = "webp",
                        OutputPath = "banner-optimized.webp",
                        ConversionMetadata = new ConversionMetadata
                        {
                            AspectRatio = "16:9",
                            CropStrategy = "crop-center",
                            Quality = 85
                        }
                    });

                    Console.WriteLine($"✅ Created: {result3.OutputPath}");
                    Console.WriteLine($"   Size: {result3.FileSize / 1024} KB\n");

                    // Example 4: Create favicon (ICO) with specific size
                    Console.WriteLine("Example 4: Generate 64x64 favicon\n");

                    var result4 = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "logo.png",
                        TargetFormat = "ico",
                        OutputPath = "favicon-64.ico",
                        ConversionMetadata = new ConversionMetadata
                        {
                            IconSize = 64  // 16, 32, 48, 64, 128, 256
                        }
                    });

                    Console.WriteLine($"✅ Created: {result4.OutputPath}\n");

                    // Example 5: Custom dimensions
                    Console.WriteLine("Example 5: Custom 800x600 dimensions\n");

                    var result5 = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "image.jpg",
                        TargetFormat = "png",
                        OutputPath = "custom-size.png",
                        ConversionMetadata = new ConversionMetadata
                        {
                            AspectRatio = "custom",
                            CustomWidth = 800,
                            CustomHeight = 600,
                            CropStrategy = "fit"
                        }
                    });

                    Console.WriteLine($"✅ Created: {result5.OutputPath}\n");

                    Console.WriteLine(new string('=', 60));
                    Console.WriteLine("All advanced conversions completed!");
                    Console.WriteLine(new string('=', 60));
                }
            }
            catch (ConvertorioException ex)
            {
                Console.WriteLine($"❌ Convertorio error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
            }
        }
    }
}
