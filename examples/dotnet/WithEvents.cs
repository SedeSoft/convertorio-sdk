using System;
using System.Threading.Tasks;
using Convertorio.SDK;

namespace Convertorio.Examples
{
    /// <summary>
    /// Conversion with event handlers
    /// Demonstrates how to track conversion progress using events
    /// </summary>
    class WithEvents
    {
        static async Task Main(string[] args)
        {
            const string API_KEY = "your_api_key_here";

            try
            {
                using (var client = new ConvertorioClient(API_KEY))
                {
                    // Subscribe to events
                    client.ConversionStart += (sender, e) =>
                    {
                        Console.WriteLine($"🚀 Starting conversion");
                        Console.WriteLine($"   File: {e.FileName}");
                        Console.WriteLine($"   From: {e.SourceFormat.ToUpper()}");
                        Console.WriteLine($"   To:   {e.TargetFormat.ToUpper()}");
                        Console.WriteLine();
                    };

                    client.ConversionProgress += (sender, e) =>
                    {
                        Console.WriteLine($"⏳ [{e.Step}] {e.Message}");
                    };

                    client.ConversionStatus += (sender, e) =>
                    {
                        Console.WriteLine($"📊 Status: {e.Status} (attempt {e.Attempt}/{e.MaxAttempts})");
                    };

                    client.ConversionComplete += (sender, e) =>
                    {
                        Console.WriteLine();
                        Console.WriteLine("=" + new string('=', 58));
                        Console.WriteLine("✅ CONVERSION COMPLETE!");
                        Console.WriteLine("=" + new string('=', 58));
                        Console.WriteLine($"Output file: {e.Result.OutputPath}");
                        Console.WriteLine($"File size:   {e.Result.FileSize / 1024.0:F2} KB");
                        Console.WriteLine($"Time taken:  {e.Result.ProcessingTime}ms");
                        Console.WriteLine("=" + new string('=', 58));
                    };

                    client.ConversionError += (sender, e) =>
                    {
                        Console.WriteLine();
                        Console.WriteLine($"❌ Error: {e.Error}");
                    };

                    // Perform conversion
                    var result = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "photo.heic",
                        TargetFormat = "png"
                    });

                    Console.WriteLine($"\n✅ File saved to: {result.OutputPath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error: {ex.Message}");
            }
        }
    }
}
