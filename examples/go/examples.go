package main

import (
	"fmt"
	"log"
	"path/filepath"

	convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

const APIKey = "your_api_key_here" // Get from https://convertorio.com/account

func main() {
	// Initialize client
	client := convertorio.NewClient(convertorio.ClientConfig{
		APIKey: APIKey,
	})

	fmt.Println("========================================")
	fmt.Println("Convertorio SDK - Go Examples")
	fmt.Println("========================================\n")

	// Uncomment the examples you want to run:

	// basicConversion(client)
	// customOutputPath(client)
	// qualityControl(client)
	// squareForInstagram(client)
	// widescreen16_9(client)
	// verticalForStories(client)
	// createFavicon(client)
	// fitWithPadding(client)
	// getAccountInfo(client)
	// listRecentJobs(client)
	// resizeByWidth(client)
	// resizeByHeight(client)
	// resizeExact(client)
	// resizeWithAspectRatio(client)
	// withProgressTracking(client)
	// batchConvert(client)
	// withErrorHandling(client)

	fmt.Println("Note: Uncomment the examples you want to run in the main() function")
}

// Example 1: Basic conversion
func basicConversion(client *convertorio.Client) {
	fmt.Println("Example 1: Basic conversion")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.png",
		TargetFormat: "jpg",
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Converted to: %s\n\n", result.OutputPath)
}

// Example 2: Conversion with custom output path
func customOutputPath(client *convertorio.Client) {
	fmt.Println("Example 2: Conversion with custom output path")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.png",
		TargetFormat: "webp",
		OutputPath:   "./converted/optimized.webp",
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Saved to: %s\n\n", result.OutputPath)
}

// Example 3: Convert with quality control
func qualityControl(client *convertorio.Client) {
	fmt.Println("Example 3: Convert with quality control")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "webp",
		ConversionMetadata: map[string]interface{}{
			"quality": 95, // High quality (1-100)
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("High quality conversion: %d bytes\n\n", result.FileSize)
}

// Example 4: Convert to square (1:1) for Instagram
func squareForInstagram(client *convertorio.Client) {
	fmt.Println("Example 4: Convert to square (1:1) for Instagram")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"aspect_ratio":  "1:1",
			"crop_strategy": "crop-center",
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Square image created: %s\n\n", result.OutputPath)
}

// Example 5: Convert to 16:9 widescreen
func widescreen16_9(client *convertorio.Client) {
	fmt.Println("Example 5: Convert to 16:9 widescreen")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"aspect_ratio":  "16:9",
			"crop_strategy": "crop-center",
			"quality":       90,
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Widescreen created: %s\n\n", result.OutputPath)
}

// Example 6: Convert to 9:16 vertical for Stories
func verticalForStories(client *convertorio.Client) {
	fmt.Println("Example 6: Convert to 9:16 vertical for Stories")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"aspect_ratio":  "9:16",
			"crop_strategy": "crop-center",
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Vertical story created: %s\n\n", result.OutputPath)
}

// Example 7: Create favicon (ICO)
func createFavicon(client *convertorio.Client) {
	fmt.Println("Example 7: Create favicon (ICO)")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./logo.png",
		TargetFormat: "ico",
		ConversionMetadata: map[string]interface{}{
			"icon_size":     32,
			"crop_strategy": "crop-center",
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Favicon created: %s\n\n", result.OutputPath)
}

// Example 8: Convert with fit strategy (add padding)
func fitWithPadding(client *convertorio.Client) {
	fmt.Println("Example 8: Convert with fit strategy (add padding)")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "png",
		ConversionMetadata: map[string]interface{}{
			"aspect_ratio":  "16:9",
			"crop_strategy": "fit", // Adds padding instead of cropping
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Fitted with padding: %s\n\n", result.OutputPath)
}

// Example 9: Get account info
func getAccountInfo(client *convertorio.Client) {
	fmt.Println("Example 9: Get account info")

	account, err := client.GetAccount()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Account: %s\n", account.Email)
	fmt.Printf("Plan: %s\n", account.Plan)
	fmt.Printf("Points: %d\n", account.Points)
	fmt.Printf("Daily conversions remaining: %d\n\n", account.DailyConversionsRemaining)
}

// Example 10: List recent jobs
func listRecentJobs(client *convertorio.Client) {
	fmt.Println("Example 10: List recent jobs")

	jobs, err := client.ListJobs(10, 0, "")
	if err != nil {
		log.Fatal(err)
	}

	for _, job := range jobs {
		fmt.Printf("Job %s: %s - %s\n", job.ID, job.Status, job.OriginalFilename)
	}
	fmt.Println()
}

// Example 11: Resize by width (maintains aspect ratio)
func resizeByWidth(client *convertorio.Client) {
	fmt.Println("Example 11: Resize by width (maintains aspect ratio)")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"resize_width": 800, // Height will maintain aspect ratio
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Resized to 800px width: %s\n\n", result.OutputPath)
}

// Example 12: Resize by height (maintains aspect ratio)
func resizeByHeight(client *convertorio.Client) {
	fmt.Println("Example 12: Resize by height (maintains aspect ratio)")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"resize_height": 600, // Width will maintain aspect ratio
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Resized to 600px height: %s\n\n", result.OutputPath)
}

// Example 13: Resize to exact dimensions
func resizeExact(client *convertorio.Client) {
	fmt.Println("Example 13: Resize to exact dimensions")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"resize_width":  800,
			"resize_height": 600, // May distort if aspect ratio differs
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Resized to 800x600: %s\n\n", result.OutputPath)
}

// Example 14: Combine resize with aspect ratio
func resizeWithAspectRatio(client *convertorio.Client) {
	fmt.Println("Example 14: Combine resize with aspect ratio")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "jpg",
		ConversionMetadata: map[string]interface{}{
			"aspect_ratio":  "1:1",
			"crop_strategy": "crop-center",
			"resize_width":  500,
			"quality":       90,
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Square thumbnail created: %s\n\n", result.OutputPath)
}

// Example 15: With progress tracking
func withProgressTracking(client *convertorio.Client) {
	fmt.Println("Example 15: With progress tracking")

	client.On("start", func(data map[string]interface{}) {
		fmt.Printf("Starting conversion: %v\n", data["file_name"])
	})

	client.On("progress", func(data map[string]interface{}) {
		fmt.Printf("[%v] %v\n", data["step"], data["message"])
	})

	client.On("complete", func(data map[string]interface{}) {
		fmt.Printf("✓ Completed in %vms\n", data["processing_time"])
		fmt.Printf("  Output: %v\n", data["output_path"])
		fmt.Printf("  Size: %v bytes\n", data["file_size"])
	})

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.png",
		TargetFormat: "webp",
		ConversionMetadata: map[string]interface{}{
			"quality": 85,
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println()
}

// Example 16: Batch conversion
func batchConvert(client *convertorio.Client) {
	fmt.Println("Example 16: Batch conversion")

	// Get all PNG files
	files, err := filepath.Glob("./images/*.png")
	if err != nil {
		log.Fatal(err)
	}

	for i, file := range files {
		fmt.Printf("Converting %d/%d: %s\n", i+1, len(files), filepath.Base(file))

		result, err := client.ConvertFile(convertorio.ConvertFileOptions{
			InputPath:    file,
			TargetFormat: "webp",
			ConversionMetadata: map[string]interface{}{
				"quality": 85,
			},
		})

		if err != nil {
			log.Printf("Error: %v\n", err)
			continue
		}

		fmt.Printf("  ✓ Saved to: %s\n", result.OutputPath)
	}

	fmt.Printf("\nConverted %d files\n\n", len(files))
}

// Example 17: Error handling
func withErrorHandling(client *convertorio.Client) {
	fmt.Println("Example 17: Error handling")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./photo.jpg",
		TargetFormat: "png",
	})

	if err != nil {
		fmt.Printf("Conversion error: %v\n", err)

		// Handle specific errors
		errorMsg := err.Error()
		if contains(errorMsg, "Insufficient") {
			fmt.Println("Not enough points/credits - please add more")
		} else if contains(errorMsg, "not found") {
			fmt.Println("Input file does not exist")
		}

		return
	}

	fmt.Printf("Success: %s\n\n", result.OutputPath)
}

// Helper function to check if string contains substring
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && (s[:len(substr)] == substr || s[len(s)-len(substr):] == substr || findSubstring(s, substr)))
}

func findSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
