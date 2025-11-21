package examples;

import com.sedesoft.convertorio.*;

/**
 * Example with event listeners for tracking progress
 */
public class WithEventListeners {
    public static void main(String[] args) {
        try {
            // Initialize client
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

            // Register event listeners
            client.on("start", data -> {
                System.out.println("🚀 Starting conversion...");
                System.out.println("   Source: " + data.getString("sourceFormat"));
                System.out.println("   Target: " + data.getString("targetFormat"));
            });

            client.on("progress", data -> {
                System.out.println("📊 Progress: " + data.getString("step"));
                System.out.println("   " + data.getString("message"));
                if (data.get("jobId") != null) {
                    System.out.println("   Job ID: " + data.getString("jobId"));
                }
            });

            client.on("status", data -> {
                System.out.println("🔄 Job Status: " + data.getString("status"));
                System.out.println("   Attempt: " + data.getInt("attempt") +
                                 "/" + data.getInt("maxAttempts"));
            });

            client.on("complete", data -> {
                System.out.println("✅ Conversion completed!");
                System.out.println("   Output: " + data.getString("outputPath"));
                System.out.println("   Processing time: " + data.getLong("processingTime") + "ms");
                System.out.println("   File size: " + (data.getLong("fileSize") / 1024) + " KB");
            });

            client.on("error", data -> {
                System.err.println("❌ Conversion failed: " + data.getString("error"));
            });

            // Convert with progress tracking
            ConversionResult result = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("webp")
                    .build()
            );

            System.out.println("\nDownload URL (valid for 7 days):");
            System.out.println(result.getDownloadUrl());

        } catch (ConvertorioException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
