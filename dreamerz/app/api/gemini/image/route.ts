import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";

const GEMINI_API_KEY = process.env.GEMINI_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateDreamImage(prompt: string) {
  if (!GEMINI_API_KEY) {
    throw new Error("Server configuration error: GEMINI_KEY not set.");
  }

  const finalPrompt = `A surreal, high-detail digital painting of a dreamscape based on: ${prompt}. Cinematic, ethereal, artistic style.`;

  // 1️⃣ Generate Image via Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: finalPrompt,
    config: { responseModalities: ["IMAGE"] },
  });

  const candidate = response.candidates?.[0];
  const base64Part = candidate?.content?.parts?.find(p => p.inlineData?.data);
  const base64Data = base64Part?.inlineData?.data;
  const mimeType = base64Part?.inlineData?.mimeType || "image/png";

  if (!base64Data) {
    throw new Error("AI did not return image data");
  }

  // 2️⃣ Upload to Cloudinary
  const dataUri = `data:${mimeType};base64,${base64Data}`;
  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: "dreamscapes",
    resource_type: "image",
  });

  // 3️⃣ Return structured result
  return {
    imageUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
}
