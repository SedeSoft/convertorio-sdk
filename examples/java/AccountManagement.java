package examples;

import com.sedesoft.convertorio.*;

/**
 * Example of account and job management
 */
public class AccountManagement {
    public static void main(String[] args) {
        try {
            ConvertorioClient client = new ConvertorioClient(
                ClientConfig.builder()
                    .apiKey("your_api_key_here")
                    .build()
            );

            // Get account information
            System.out.println("=== Account Information ===");
            Account account = client.getAccount();
            System.out.println("Email: " + account.getEmail());
            System.out.println("Points Balance: " + account.getPointsBalance());
            System.out.println("Total Conversions: " + account.getTotalConversions());
            System.out.println("Account Created: " + account.getCreatedAt());

            // List recent jobs
            System.out.println("\n=== Recent Jobs ===");
            Job[] jobs = client.listJobs(10, 0, null);
            System.out.println("Total jobs retrieved: " + jobs.length);

            for (Job job : jobs) {
                System.out.println("\nJob ID: " + job.getId());
                System.out.println("  Status: " + job.getStatus());
                System.out.println("  Source: " + job.getSourceFormat());
                System.out.println("  Target: " + job.getTargetFormat());
                System.out.println("  Created: " + job.getCreatedAt());

                if (job.getProcessingTimeMs() != null) {
                    System.out.println("  Processing Time: " + job.getProcessingTimeMs() + "ms");
                }

                if (job.getFileSize() != null) {
                    System.out.println("  File Size: " + (job.getFileSize() / 1024) + " KB");
                }
            }

            // List only completed jobs
            System.out.println("\n=== Completed Jobs ===");
            Job[] completedJobs = client.listJobs(5, 0, "completed");
            System.out.println("Completed jobs: " + completedJobs.length);

            for (Job job : completedJobs) {
                System.out.println("\nJob " + job.getId());
                System.out.println("  " + job.getSourceFormat() + " → " + job.getTargetFormat());
                System.out.println("  Completed: " + job.getCompletedAt());
                System.out.println("  Download URL: " + job.getDownloadUrl());
            }

            // Get specific job details
            if (jobs.length > 0) {
                String jobId = jobs[0].getId();
                System.out.println("\n=== Job Details ===");
                Job specificJob = client.getJob(jobId);
                System.out.println("Job ID: " + specificJob.getId());
                System.out.println("Status: " + specificJob.getStatus());
                System.out.println("Source Format: " + specificJob.getSourceFormat());
                System.out.println("Target Format: " + specificJob.getTargetFormat());
                System.out.println("Created: " + specificJob.getCreatedAt());
                System.out.println("Expires: " + specificJob.getExpiresAt());

                if (specificJob.getDownloadUrl() != null) {
                    System.out.println("Download URL: " + specificJob.getDownloadUrl());
                }
            }

        } catch (ConvertorioException e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
