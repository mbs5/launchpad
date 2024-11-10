import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";


export async function llamaindexTogetherSimple({ query }: { query: string }) {
    // Step 1: Query a model with the llamaIndex and Together integration
    const response = await step<typeof functions>({
        taskQueue: 'together',
    }).llamaIndexQueryTogether({
        query,
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
    });

    return response;
}