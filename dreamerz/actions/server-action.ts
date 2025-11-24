"use server";
import { actionClient } from "./safe-action";
import { formSchema } from "../lib/form-schema";
import { generateDreamName } from "@/app/api/gemini/name/nameservice";
import { analyzeDream } from "@/app/api/gemini/analyze/analyzeservice";
import { generateDreamImage } from "@/app/api/gemini/image/route";
import { generateDreamVideo } from "@/app/api/gemini/video/route";
import { createClient } from "@/lib/supabase/server";

// ✅ Define types for media
type MediaResult = { imageUrl: string | null; publicId: string | null };
type VideoResult = { videoUrl: string | null; publicId: string | null };

export const serverAction = actionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // 1️⃣ Generate a name if missing
    let name = parsedInput.name;
    if (!name && parsedInput.description) {
      try {
        name = await generateDreamName(parsedInput.description);
      } catch (error) {
        console.error("Failed to generate dream name:", error);
        name = "Untitled Dream";
      }
    }

    // 2️⃣ Initialize default results
    let keywordsRes: number[] = [];
    let imageRes: MediaResult = { imageUrl: null, publicId: null };
    let videoRes: VideoResult = { videoUrl: null, publicId: null };

    try {
      // 3️⃣ Run all services in parallel
      const [kw, img, vid] = await Promise.all([
        analyzeDream(parsedInput.description),
        generateDreamImage(parsedInput.description),
        generateDreamVideo(parsedInput.description),
      ]);

      keywordsRes = kw ?? [];
      imageRes = img ?? imageRes;
      videoRes = vid ?? videoRes;
    } catch (error) {
      console.error("Error generating AI content:", error);
      // Continue even if one of the services fails
    }

    // 4️⃣ Compose final output
    const finalOutput = {
      user_id: user.id,
      date_time: parsedInput.dateTime,
      description: parsedInput.description,
      longitude: parsedInput.longitude,
      latitude: parsedInput.latitude,
      name,
      keywords: keywordsRes,
      imageUrl: imageRes.imageUrl,
      videoUrl: videoRes.videoUrl,
    };

    console.log("🔥 FINAL OUTPUT", finalOutput);

    return {
      success: true,
      message: "Form submitted successfully",
      data: finalOutput,
    };
  });
