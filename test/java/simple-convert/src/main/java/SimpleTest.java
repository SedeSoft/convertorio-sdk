import com.sedesoft.convertorio.*;

/**
 * Simple Convertorio SDK Test
 *
 * Basic conversion test without advanced metadata options.
 */
public class SimpleTest {
    private static final String API_KEY = "cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3";

    public static void main(String[] args) {
        System.out.println("============================================================");
        System.out.println("Testing Convertorio SDK for Java (v1.2.0)");
        System.out.println("============================================================\n");

        try {
            // Initialize client
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey(API_KEY)
                    .baseUrl("https://api.convertorio.com")
                    .build()
            );

            // Convert image
            System.out.println("🔄 Converting test-image.png to JPG...");
            ConversionResult result = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("jpg")
                    .outputPath("./output-test.jpg")
                    .build()
            );

            // Print results
            System.out.println("✓ Conversion successful!");
            System.out.println("  Job ID: " + result.getJobId());
            System.out.println("  Source format: " + result.getSourceFormat());
            System.out.println("  Target format: " + result.getTargetFormat());
            System.out.println("  Processing time: " + result.getProcessingTime() + "ms");
            System.out.println("  File size: " + String.format("%.2f", result.getFileSize() / 1024.0) + " KB");
            System.out.println("  Output: " + result.getOutputPath());

            System.out.println("\n============================================================");
            System.out.println("✅ Test completed successfully!");
            System.out.println("============================================================");

        } catch (ConvertorioException e) {
            System.err.println("❌ Conversion failed: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }
}
