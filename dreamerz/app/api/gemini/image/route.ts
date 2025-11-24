import { NextRequest, NextResponse } from "next/server";
import { generateDreamImage } from "./imageservice";

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

    const result = await generateDreamImage(prompt);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
