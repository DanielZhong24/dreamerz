import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import os from "os";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const GEMINI_API_KEY = process.env.GEMINI_KEY || "";
if (!GEMINI_API_KEY) throw new Error("GEMINI_KEY env variable not set");

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateDreamVideo(prompt: string) {
  // 1️⃣ Start video generation
  let operation = await ai.models.generateVideos({
    model: "veo-3.1-generate-preview", // VEO 3
    prompt,
  });

  // 2️⃣ Poll until done or timeout (max 5 minutes)
  const startTime = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutes

  while (!operation.done) {
    if (Date.now() - startTime > timeout) {
      throw new Error("Video generation timed out.");
    }
    console.log("⏳ Waiting for video generation...");
    await new Promise((r) => setTimeout(r, 10000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  // 3️⃣ Verify generatedVideos array
  const videoRef = operation.response?.generatedVideos?.[0]?.video;
  if (!videoRef) {
    console.error(
      "Full operation response:",
      JSON.stringify(operation, null, 2)
    );
    throw new Error("Video reference missing.");
  }

  // 4️⃣ Download video temporarily
  const tempPath = path.join(os.tmpdir(), `dream_video_${Date.now()}.mp4`);
  await ai.files.download({ file: videoRef, downloadPath: tempPath });

  // 5️⃣ Upload video to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(tempPath, {
    folder: "dream_videos",
    resource_type: "video",
  });

  // Cleanup temp file
  fs.unlinkSync(tempPath);

  return {
    videoUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
}
