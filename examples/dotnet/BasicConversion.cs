using System;
using System.Threading.Tasks;
using Convertorio.SDK;

namespace Convertorio.Examples
{
    /// <summary>
    /// Basic image conversion example
    /// Demonstrates the simplest way to convert an image
    /// </summary>
    class BasicConversion
    {
        static async Task Main(string[] args)
        {
            // Replace with your actual API key from https://convertorio.com/account
            const string API_KEY = "your_api_key_here";

            try
            {
                // Create the Convertorio client
                using (var client = new ConvertorioClient(API_KEY))
                {
                    Console.WriteLine("Converting image.png to JPG...\n");

                    // Convert the file
                    var result = await client.ConvertFileAsync(new ConversionOptions
                    {
                        InputPath = "image.png",
                        TargetFormat = "jpg"
                    });

                    // Print result
                    Console.WriteLine($"✅ Conversion successful!");
                    Console.WriteLine($"   Input:  {result.InputPath}");
                    Console.WriteLine($"   Output: {result.OutputPath}");
                    Console.WriteLine($"   Size:   {result.FileSize / 1024} KB");
                    Console.WriteLine($"   Time:   {result.ProcessingTime}ms");
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
