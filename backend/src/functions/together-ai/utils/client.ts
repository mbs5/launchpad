import Together from "together-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.TOGETHER_API_KEY) {
  throw new Error("TOGETHER_API_KEY is required in environment variables");
}

export const togetherClient = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});
