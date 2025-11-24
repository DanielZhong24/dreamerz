import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_KEY;

async function test() {
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_KEY not set");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  try {
    console.log("Testing gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, are you working?",
    });
    console.log("Response:", response.text);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
