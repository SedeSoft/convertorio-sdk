package main

import (
	"fmt"
	"log"
	"strings"

	convertorio "github.com/SedeSoft/convertorio-sdk/libs/go"
)

const APIKey = "cv_b13aff4fa6e8b71234e370105d8faf1b4150e7ddfc109df349dc6db4eae3"

func main() {
	fmt.Println(strings.Repeat("=", 60))
	fmt.Println("Testing Convertorio SDK for Go (v1.2.0)")
	fmt.Println(strings.Repeat("=", 60))
	fmt.Println()

	// Initialize client
	client := convertorio.NewClient(convertorio.ClientConfig{
		APIKey:  APIKey,
		BaseURL: "https://api.convertorio.com",
	})

	// Test basic conversion
	fmt.Println("🔄 Converting test-image.png to JPG...")

	result, err := client.ConvertFile(convertorio.ConvertFileOptions{
		InputPath:    "./test-image.png",
		TargetFormat: "jpg",
		OutputPath:   "./output-test.jpg",
	})

	if err != nil {
		log.Fatalf("❌ Conversion failed: %v\n", err)
	}

	fmt.Println("✓ Conversion successful!")
	fmt.Printf("  Job ID: %s\n", result.JobID)
	fmt.Printf("  Source format: %s\n", result.SourceFormat)
	fmt.Printf("  Target format: %s\n", result.TargetFormat)
	fmt.Printf("  Processing time: %dms\n", result.ProcessingTime)
	fmt.Printf("  File size: %.2f KB\n", float64(result.FileSize)/1024)
	fmt.Printf("  Output: %s\n", result.OutputPath)

	fmt.Println()
	fmt.Println(strings.Repeat("=", 60))
	fmt.Println("✅ Test completed successfully!")
	fmt.Println(strings.Repeat("=", 60))
}
