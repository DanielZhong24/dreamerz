import { createClient } from "@/lib/supabase/server";

export interface PointData {
  id: number;
  name: string;
  desc: string;
  image: string;
  tags: string[];
  image_alt: string;
  video: string;
  lat: number;
  lng: number;
}

export async function getPointData(): Promise<PointData[]> {
  const supabase = await createClient();

  // Fetch dreams with their keywords
  const { data, error } = await supabase
    .from("dreams")
    .select(`
      id,
      title,
      description,
      image_url,
      video_url,
      latitude,
      longitude,
      dream_keywords (
        keyword_id,
        keywords (name)
      )
    `);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to fetch dreams");
  }

  const points: PointData[] = (data ?? []).map((dream: any) => ({
    id: dream.id,
    name: dream.title,
    desc: dream.description,
    image: dream.image_url,
    tags: dream.dream_keywords?.map((dk: any) => dk.keywords?.name).filter(Boolean) ?? [],
    image_alt: dream.title,
    video: dream.video_url,
    lat: dream.latitude ?? 0,
    lng: dream.longitude ?? 0,
  }));

  return points;
}
