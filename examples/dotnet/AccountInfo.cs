using System;
using System.Threading.Tasks;
using Convertorio.SDK;

namespace Convertorio.Examples
{
    /// <summary>
    /// Account information example
    /// Demonstrates how to retrieve account details and usage
    /// </summary>
    class AccountInfo
    {
        static async Task Main(string[] args)
        {
            const string API_KEY = "your_api_key_here";

            try
            {
                using (var client = new ConvertorioClient(API_KEY))
                {
                    Console.WriteLine("Fetching account information...\n");

                    // Get account info
                    var account = await client.GetAccountAsync();

                    Console.WriteLine("=" + new string('=', 58));
                    Console.WriteLine("ACCOUNT INFORMATION");
                    Console.WriteLine("=" + new string('=', 58));
                    Console.WriteLine($"Email:                {account.Email}");
                    Console.WriteLine($"Name:                 {account.Name ?? "Not set"}");
                    Console.WriteLine($"User ID:              {account.UserId}");
                    Console.WriteLine($"Member since:         {account.CreatedAt:yyyy-MM-dd}");
                    Console.WriteLine();
                    Console.WriteLine("USAGE & BALANCE");
                    Console.WriteLine(new string('-', 60));
                    Console.WriteLine($"Points balance:       {account.PointsBalance}");
                    Console.WriteLine($"Daily conversions:    {account.DailyConversionsUsed} / {account.DailyConversionsLimit}");
                    Console.WriteLine($"Total conversions:    {account.TotalConversions}");
                    Console.WriteLine("=" + new string('=', 58));

                    // Get recent jobs
                    Console.WriteLine("\nFetching recent jobs...\n");
                    var jobs = await client.ListJobsAsync(new ListJobsOptions
                    {
                        Limit = 5,
                        Offset = 0
                    });

                    Console.WriteLine($"RECENT CONVERSIONS (showing {jobs.Length})");
                    Console.WriteLine(new string('-', 60));

                    foreach (var job in jobs)
                    {
                        var status = job.Status == "completed" ? "✅" :
                                   job.Status == "failed" ? "❌" :
                                   job.Status == "processing" ? "⏳" : "⏸️";

                        Console.WriteLine($"{status} {job.SourceFormat.ToUpper()} → {job.TargetFormat.ToUpper()} " +
                                        $"({job.Status})");
                        Console.WriteLine($"   ID: {job.JobId}");
                        Console.WriteLine($"   Created: {job.CreatedAt:yyyy-MM-dd HH:mm:ss}");

                        if (job.CompletedAt.HasValue)
                        {
                            Console.WriteLine($"   Completed: {job.CompletedAt.Value:yyyy-MM-dd HH:mm:ss}");
                        }

                        Console.WriteLine();
                    }
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
