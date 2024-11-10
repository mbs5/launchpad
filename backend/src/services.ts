// Simple example to start two services in the same file
import { config } from 'dotenv';
import { togetherChatCompletionBasic } from "./functions";
import { client } from "./client";

config();

// Add this line to debug
console.log('TOGETHER_API_KEY:', process.env.TOGETHER_API_KEY ? 'Present' : 'Missing');

export async function services() {
    const workflowsPath = require.resolve("./workflows");
    try {
        await Promise.all([
            client.startService({
                workflowsPath,
                functions: {
                    togetherChatCompletionBasic,
                },
            }),
            client.startService({
                taskQueue: 'together',
                functions: { togetherChatCompletionBasic },
                options: {
                    rateLimit: (60 / 60),
                },
            }),
        ]);

        console.log("Services running successfully.");
    } catch (e) {
        console.error("Failed to run services", e);
    }
}

services().catch((err) => {
    console.error("Error running services:", err);
});
