using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Convertorio.SDK;

namespace Convertorio.Examples
{
    /// <summary>
    /// Batch conversion example
    /// Demonstrates how to convert multiple files
    /// </summary>
    class BatchConversion
    {
        static async Task Main(string[] args)
        {
            const string API_KEY = "your_api_key_here";
            const string SOURCE_DIR = "./images";
            const string TARGET_FORMAT = "webp";

            try
            {
                using (var client = new ConvertorioClient(API_KEY))
                {
                    // Get all PNG and JPG files
                    var files = Directory.GetFiles(SOURCE_DIR)
                        .Where(f => f.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                                   f.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase))
                        .ToArray();

                    Console.WriteLine($"Found {files.Length} images to convert to {TARGET_FORMAT.ToUpper()}\n");

                    int successful = 0;
                    int failed = 0;

                    foreach (var file in files)
                    {
                        try
                        {
                            Console.WriteLine($"Converting: {Path.GetFileName(file)}...");

                            var result = await client.ConvertFileAsync(new ConversionOptions
                            {
                                InputPath = file,
                                TargetFormat = TARGET_FORMAT,
                                OutputPath = Path.Combine(SOURCE_DIR, "converted",
                                    Path.GetFileNameWithoutExtension(file) + "." + TARGET_FORMAT)
                            });

                            var originalSize = new FileInfo(file).Length;
                            var newSize = result.FileSize;
                            var savings = ((originalSize - newSize) / (double)originalSize) * 100;

                            Console.WriteLine($"  ✅ Done! Size: {originalSize / 1024} KB → {newSize / 1024} KB " +
                                            $"({savings:F1}% reduction)");
                            Console.WriteLine($"     Time: {result.ProcessingTime}ms\n");

                            successful++;
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"  ❌ Failed: {ex.Message}\n");
                            failed++;
                        }
                    }

                    Console.WriteLine(new string('=', 60));
                    Console.WriteLine($"Batch conversion complete!");
                    Console.WriteLine($"  Successful: {successful}");
                    Console.WriteLine($"  Failed:     {failed}");
                    Console.WriteLine(new string('=', 60));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
            }
        }
    }
}
