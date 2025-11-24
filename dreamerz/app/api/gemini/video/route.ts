import { NextRequest, NextResponse } from "next/server";
import { generateDreamVideo } from "./videoservice";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing 'prompt' in request body" },
        { status: 400 }
      );
    }

    const result = await generateDreamVideo(prompt);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
