/**
 * Account Information Example
 *
 * This example shows how to get account information and list conversion jobs
 */

const ConvertorioClient = require('../../libs/nodejs');

const client = new ConvertorioClient({
    apiKey: 'your_api_key_here'
});

async function main() {
    try {
        // Get account information
        console.log('Fetching account information...\n');
        const account = await client.getAccount();

        console.log('========================================');
        console.log('Account Information');
        console.log('========================================');
        console.log('Email:', account.email);
        console.log('Name:', account.name);
        console.log('Plan:', account.plan);
        console.log('Points:', account.points);
        console.log('Daily conversions remaining:', account.daily_conversions_remaining);
        console.log('Total conversions:', account.total_conversions);
        console.log('========================================\n');

        // List recent jobs
        console.log('Fetching recent conversion jobs...\n');
        const jobs = await client.listJobs({ limit: 10 });

        console.log('========================================');
        console.log('Recent Conversions');
        console.log('========================================');

        if (jobs.length === 0) {
            console.log('No conversions yet');
        } else {
            jobs.forEach((job, index) => {
                console.log(`\n[${index + 1}] Job ID: ${job.id}`);
                console.log(`    File: ${job.original_filename}`);
                console.log(`    Conversion: ${job.source_format} → ${job.target_format}`);
                console.log(`    Status: ${job.status}`);
                console.log(`    Created: ${new Date(job.created_at).toLocaleString()}`);
                if (job.processing_time_ms) {
                    console.log(`    Processing time: ${job.processing_time_ms} ms`);
                }
            });
        }

        console.log('\n========================================\n');

        // Get specific job details
        if (jobs.length > 0) {
            const firstJob = jobs[0];
            console.log(`Fetching details for job ${firstJob.id}...\n`);
            const jobDetails = await client.getJob(firstJob.id);

            console.log('========================================');
            console.log('Job Details');
            console.log('========================================');
            console.log(JSON.stringify(jobDetails, null, 2));
            console.log('========================================\n');
        }

    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
