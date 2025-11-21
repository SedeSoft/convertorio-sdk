package examples;

import com.sedesoft.convertorio.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Example with advanced conversion options
 */
public class AdvancedOptions {
    public static void main(String[] args) {
        try {
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

            // Example 1: Convert to 16:9 widescreen with quality control
            System.out.println("Example 1: 16:9 Widescreen conversion");
            Map<String, Object> metadata1 = new HashMap<>();
            metadata1.put("aspect_ratio", "16:9");
            metadata1.put("crop_strategy", "crop-center");
            metadata1.put("quality", 90);

            ConversionResult result1 = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("jpg")
                    .outputPath("./output-16-9.jpg")
                    .conversionMetadata(metadata1)
                    .build()
            );
            System.out.println("✓ Created: " + result1.getOutputPath());

            // Example 2: Square image for Instagram
            System.out.println("\nExample 2: Square 1:1 for Instagram");
            Map<String, Object> metadata2 = new HashMap<>();
            metadata2.put("aspect_ratio", "1:1");
            metadata2.put("crop_strategy", "crop-center");
            metadata2.put("resize_width", 1080);
            metadata2.put("quality", 95);

            ConversionResult result2 = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("jpg")
                    .outputPath("./output-instagram.jpg")
                    .conversionMetadata(metadata2)
                    .build()
            );
            System.out.println("✓ Created: " + result2.getOutputPath());

            // Example 3: High quality WebP
            System.out.println("\nExample 3: High quality WebP");
            Map<String, Object> metadata3 = new HashMap<>();
            metadata3.put("quality", 95);
            metadata3.put("resize_width", 2048);

            ConversionResult result3 = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("webp")
                    .outputPath("./output-hq.webp")
                    .conversionMetadata(metadata3)
                    .build()
            );
            System.out.println("✓ Created: " + result3.getOutputPath());

            // Example 4: ICO favicon generation
            System.out.println("\nExample 4: ICO Favicon (32x32)");
            Map<String, Object> metadata4 = new HashMap<>();
            metadata4.put("icon_size", 32);

            ConversionResult result4 = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("ico")
                    .outputPath("./favicon.ico")
                    .conversionMetadata(metadata4)
                    .build()
            );
            System.out.println("✓ Created: " + result4.getOutputPath());

            // Example 5: Vertical 9:16 for Stories
            System.out.println("\nExample 5: Vertical 9:16 for Stories/Reels");
            Map<String, Object> metadata5 = new HashMap<>();
            metadata5.put("aspect_ratio", "9:16");
            metadata5.put("crop_strategy", "crop-center");
            metadata5.put("resize_width", 1080);
            metadata5.put("quality", 90);

            ConversionResult result5 = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("jpg")
                    .outputPath("./output-story.jpg")
                    .conversionMetadata(metadata5)
                    .build()
            );
            System.out.println("✓ Created: " + result5.getOutputPath());

            // Example 6: Thumbnail generation
            System.out.println("\nExample 6: Thumbnail (300px wide)");
            Map<String, Object> metadata6 = new HashMap<>();
            metadata6.put("resize_width", 300);
            metadata6.put("quality", 85);

            ConversionResult result6 = client.convertFile(
                ConversionOptions.builder()
                    .inputPath("./test-image.png")
                    .targetFormat("jpg")
                    .outputPath("./thumbnail.jpg")
                    .conversionMetadata(metadata6)
                    .build()
            );
            System.out.println("✓ Created: " + result6.getOutputPath());

            System.out.println("\n✅ All conversions completed successfully!");

        } catch (ConvertorioException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
