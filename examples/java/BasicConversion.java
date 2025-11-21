package examples;

import com.sedesoft.convertorio.*;

/**
 * Basic conversion example
 */
public class BasicConversion {
    public static void main(String[] args) {
        try {
            // Initialize client
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

            // Convert PNG to JPG
            ConversionResult result = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("jpg")
                    .build()
            );

            System.out.println("Conversion successful!");
            System.out.println("Job ID: " + result.getJobId());
            System.out.println("Output: " + result.getOutputPath());
            System.out.println("Processing time: " + result.getProcessingTime() + "ms");
            System.out.println("File size: " + (result.getFileSize() / 1024) + " KB");

        } catch (ConvertorioException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
