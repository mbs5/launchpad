import { scheduleWorkflow } from "@/app/actions/schedule";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await scheduleWorkflow(body.workflowName, body.input);
    
    // Extract the actual message content from the AI response
    const content = result.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
} 