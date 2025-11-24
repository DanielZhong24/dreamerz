// app/api/backend/dreams/getdream.ts
import { createClient } from "@/lib/supabase/server";
import type { PointData } from "@/types/point-data";
interface DreamKeyword {
  keyword_id: number;
  keywords: { name: string } | null;
}

// app/api/backend/dreams/getdream.ts
export async function getSimilarDreams(userId: string): Promise<PointData[]> {
  const supabase = await createClient();

  // Fetch ALL dreams with their keywords
  const { data: allDreams, error } = await supabase.from("dreams").select(
    `
      id,
      title,
      description,
      image_url,
      video_url,
      longitude,
      latitude,
      dream_keywords(
        keyword_id,
        keywords(name)
      ),
      user_id
    `
  );

  if (error) {
    console.error("Error fetching all dreams:", error);
    throw new Error(error.message);
  }

  const points: PointData[] = (allDreams || []).map((dream: any) => ({
    id: dream.id,
    name: dream.title,
    desc: dream.description,
    image: dream.image_url,
    image_alt: dream.title,
    video: dream.video_url,
    lat: Number(dream.latitude) || 0,
    lng: Number(dream.longitude) || 0,
    user_id: dream.user_id,
    tags:
      dream.dream_keywords
        ?.filter((dk: any) => dk.keywords)
        .map((dk: any) => dk.keywords!.name) || [],
  }));

  return points;
}
