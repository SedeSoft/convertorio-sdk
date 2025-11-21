using System;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Convertorio.SDK;

namespace Convertorio.SDK.Tests
{
    /// <summary>
    /// Unit tests for ConvertorioClient
    /// </summary>
    public class ConvertorioClientTests
    {
        private const string TEST_API_KEY = "test_api_key_12345";

        [Fact]
        public void Constructor_WithValidApiKey_ShouldSucceed()
        {
            // Arrange & Act
            using (var client = new ConvertorioClient(TEST_API_KEY))
            {
                // Assert
                Assert.NotNull(client);
            }
        }

        [Fact]
        public void Constructor_WithNullApiKey_ShouldThrow()
        {
            // Arrange, Act & Assert
            Assert.Throws<ArgumentException>(() => new ConvertorioClient(null));
        }

        [Fact]
        public void Constructor_WithEmptyApiKey_ShouldThrow()
        {
            // Arrange, Act & Assert
            Assert.Throws<ArgumentException>(() => new ConvertorioClient(""));
        }

        [Fact]
        public void Constructor_WithWhitespaceApiKey_ShouldThrow()
        {
            // Arrange, Act & Assert
            Assert.Throws<ArgumentException>(() => new ConvertorioClient("   "));
        }

        [Fact]
        public void Constructor_WithCustomBaseUrl_ShouldSucceed()
        {
            // Arrange & Act
            using (var client = new ConvertorioClient(TEST_API_KEY, "https://custom-api.example.com"))
            {
                // Assert
                Assert.NotNull(client);
            }
        }

        [Fact]
        public async Task ConvertFileAsync_WithNullOptions_ShouldThrow()
        {
            // Arrange
            using (var client = new ConvertorioClient(TEST_API_KEY))
            {
                // Act & Assert
                await Assert.ThrowsAsync<ArgumentNullException>(() =>
                    client.ConvertFileAsync(null));
            }
        }

        [Fact]
        public async Task ConvertFileAsync_WithMissingInputPath_ShouldThrow()
        {
            // Arrange
            using (var client = new ConvertorioClient(TEST_API_KEY))
            {
                var options = new ConversionOptions
                {
                    TargetFormat = "jpg"
                };

                // Act & Assert
                await Assert.ThrowsAsync<ArgumentException>(() =>
                    client.ConvertFileAsync(options));
            }
        }

        [Fact]
        public async Task ConvertFileAsync_WithMissingTargetFormat_ShouldThrow()
        {
            // Arrange
            using (var client = new ConvertorioClient(TEST_API_KEY))
            {
                var options = new ConversionOptions
                {
                    InputPath = "test.png"
                };

                // Act & Assert
                await Assert.ThrowsAsync<ArgumentException>(() =>
                    client.ConvertFileAsync(options));
            }
        }

        [Fact]
        public async Task ConvertFileAsync_WithNonExistentFile_ShouldThrow()
        {
            // Arrange
            using (var client = new ConvertorioClient(TEST_API_KEY))
            {
                var options = new ConversionOptions
                {
                    InputPath = "non-existent-file.png",
                    TargetFormat = "jpg"
                };

                // Act & Assert
                await Assert.ThrowsAsync<FileNotFoundException>(() =>
                    client.ConvertFileAsync(options));
            }
        }

        [Fact]
        public void Events_ShouldBeSubscribable()
        {
            // Arrange
            using (var client = new ConvertorioClient(TEST_API_KEY))
            {
                bool handlerCalled = false;

                // Act - Subscribe to events (should not throw)
                client.ConversionStart += (sender, e) => handlerCalled = true;
                client.ConversionProgress += (sender, e) => handlerCalled = true;
                client.ConversionStatus += (sender, e) => handlerCalled = true;
                client.ConversionComplete += (sender, e) => handlerCalled = true;
                client.ConversionError += (sender, e) => handlerCalled = true;

                // Assert - Events are subscribed successfully if we get here without exception
                Assert.NotNull(client);
            }
        }

        [Fact]
        public void ConversionMetadata_AspectRatio_ShouldAcceptValidValues()
        {
            // Arrange & Act
            var metadata = new ConversionMetadata
            {
                AspectRatio = "16:9"
            };

            // Assert
            Assert.Equal("16:9", metadata.AspectRatio);
        }

        [Fact]
        public void ConversionMetadata_Quality_ShouldAcceptValidRange()
        {
            // Arrange & Act
            var metadata = new ConversionMetadata
            {
                Quality = 85
            };

            // Assert
            Assert.Equal(85, metadata.Quality);
        }

        [Fact]
        public void ConversionMetadata_CropStrategy_ShouldAcceptValidValues()
        {
            // Arrange & Act
            var metadata = new ConversionMetadata
            {
                CropStrategy = "crop-center"
            };

            // Assert
            Assert.Equal("crop-center", metadata.CropStrategy);
        }

        [Fact]
        public void ConversionMetadata_IconSize_ShouldAcceptValidValues()
        {
            // Arrange & Act
            var metadata = new ConversionMetadata
            {
                IconSize = 64
            };

            // Assert
            Assert.Equal(64, metadata.IconSize);
        }

        [Fact]
        public void ConversionMetadata_CustomDimensions_ShouldBeSettable()
        {
            // Arrange & Act
            var metadata = new ConversionMetadata
            {
                AspectRatio = "custom",
                CustomWidth = 1920,
                CustomHeight = 1080
            };

            // Assert
            Assert.Equal("custom", metadata.AspectRatio);
            Assert.Equal(1920, metadata.CustomWidth);
            Assert.Equal(1080, metadata.CustomHeight);
        }

        [Fact]
        public void ListJobsOptions_DefaultValues_ShouldBeSet()
        {
            // Arrange & Act
            var options = new ListJobsOptions();

            // Assert
            Assert.Equal(50, options.Limit);
            Assert.Equal(0, options.Offset);
            Assert.Null(options.Status);
        }

        [Fact]
        public void ListJobsOptions_CustomValues_ShouldBeSettable()
        {
            // Arrange & Act
            var options = new ListJobsOptions
            {
                Limit = 100,
                Offset = 50,
                Status = "completed"
            };

            // Assert
            Assert.Equal(100, options.Limit);
            Assert.Equal(50, options.Offset);
            Assert.Equal("completed", options.Status);
        }

        [Fact]
        public void ConvertorioException_WithMessage_ShouldStoreMessage()
        {
            // Arrange & Act
            var ex = new ConvertorioException("Test error");

            // Assert
            Assert.Equal("Test error", ex.Message);
        }

        [Fact]
        public void ConvertorioException_WithInnerException_ShouldStoreInnerException()
        {
            // Arrange
            var innerEx = new Exception("Inner error");

            // Act
            var ex = new ConvertorioException("Outer error", innerEx);

            // Assert
            Assert.Equal("Outer error", ex.Message);
            Assert.Equal(innerEx, ex.InnerException);
        }

        [Fact]
        public void Dispose_ShouldNotThrow()
        {
            // Arrange
            var client = new ConvertorioClient(TEST_API_KEY);

            // Act & Assert
            client.Dispose(); // Should not throw
            client.Dispose(); // Double dispose should also not throw
        }

        [Fact]
        public void ConversionResult_Properties_ShouldBeSettable()
        {
            // Arrange & Act
            var result = new ConversionResult
            {
                Success = true,
                JobId = "job123",
                InputPath = "input.png",
                OutputPath = "output.jpg",
                SourceFormat = "png",
                TargetFormat = "jpg",
                FileSize = 12345,
                ProcessingTime = 500,
                DownloadUrl = "https://example.com/download"
            };

            // Assert
            Assert.True(result.Success);
            Assert.Equal("job123", result.JobId);
            Assert.Equal("input.png", result.InputPath);
            Assert.Equal("output.jpg", result.OutputPath);
            Assert.Equal("png", result.SourceFormat);
            Assert.Equal("jpg", result.TargetFormat);
            Assert.Equal(12345, result.FileSize);
            Assert.Equal(500, result.ProcessingTime);
            Assert.Equal("https://example.com/download", result.DownloadUrl);
        }
    }
}
