import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getTitle(dreamDescription: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("Server configuration error: GEMINI_KEY environment variable is not set.");
  }



  // Build AI prompt
  const finalPrompt = `
   create a short title that best describe the dream.
**Dream:** "${dreamDescription}"
**Instructions:**Response should be a string with no extra text or formatting.
`;

  // Call Gemini AI
  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: finalPrompt,
  });

  const rawText = aiResponse.text;
  if (!rawText) {
    throw new Error("AI response was empty");
  }


  return rawText;
}
