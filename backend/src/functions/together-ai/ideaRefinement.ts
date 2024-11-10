import Together from 'together-ai';
import { togetherClient } from './utils/client';

export async function ideaRefinement(params: Together.Chat.CompletionCreateParamsNonStreaming) {
    const response = await togetherClient.chat.completions.create({
        ...params,
        max_tokens: 1000, // Increased for more detailed responses
    });
    return response;
} 