import Together from 'together-ai';

if (!process.env.TOGETHER_API_KEY) {
  throw new Error('TOGETHER_API_KEY is required');
}

export const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY
}); 