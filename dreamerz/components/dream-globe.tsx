"use client";

import Globe from "react-globe.gl";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PointData } from "@/types/point-data";
import PointHoverWindow from "./point-hover-window";
import PointPopupWindow from "./point-popup-window";

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

export default function DreamGlobe() {
  const [points, setPoints] = useState<PointData[]>([]);
  const [arcs, setArcs] = useState<ArcData[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hovered, setHovered] = useState<PointData | null>(null);
  const [clicked, setClicked] = useState<PointData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [connectedPointIds, setConnectedPointIds] = useState<Set<number>>(
    new Set()
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const onPointClick = (point: PointData) => {
    setClicked(point);
    setHovered(null);
  };

  const onPointHover = (point: PointData | null) => {
    setHovered(point);
  };

  // Fetch points from API
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id;
        setCurrentUserId(userId || null);

        const res = await fetch("/api/backend/dreams");
        if (!res.ok) throw new Error("Failed to fetch points");
        const data: PointData[] = await res.json();
        setPoints(data);

        // Create arcs between points with shared tags
        const arcsData: ArcData[] = [];
        const connectedIds = new Set<number>();

        for (let i = 0; i < data.length; i++) {
          for (let j = i + 1; j < data.length; j++) {
            const p1 = data[i];
            const p2 = data[j];

            const hasSharedTags = p1.tags?.some((tag) =>
              p2.tags?.includes(tag)
            );

            if (hasSharedTags) {
              if (p1.user_id === userId) {
                arcsData.push({
                  startLat: p1.lat,
                  startLng: p1.lng,
                  endLat: p2.lat,
                  endLng: p2.lng,
                  color:
                    p2.user_id === userId
                      ? ["green", "green"]
                      : ["green", "yellow"],
                });
                if (p2.user_id !== userId) connectedIds.add(p2.id);
              }
              if (p2.user_id === userId) {
                arcsData.push({
                  startLat: p2.lat,
                  startLng: p2.lng,
                  endLat: p1.lat,
                  endLng: p1.lng,
                  color:
                    p1.user_id === userId
                      ? ["green", "green"]
                      : ["green", "yellow"],
                });
                if (p1.user_id !== userId) connectedIds.add(p1.id);
              }
            }
          }
        }
        setArcs(arcsData);
        setConnectedPointIds(connectedIds);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPoints();
  }, []);

  return (
    <div className="w-screen h-screen" onMouseMove={handleMouseMove}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="#000000"
        animateIn={true}
        pointsData={points}
        pointLat={(d) => (d as PointData).lat}
        pointLng={(d) => (d as PointData).lng}
        pointColor={(d) => {
          const point = d as PointData;
          if (point.user_id === currentUserId) return "green";
          if (connectedPointIds.has(point.id)) return "yellow";
          return "red";
        }}
        pointRadius={0.5}
        onPointClick={(point) => onPointClick(point as PointData)}
        onPointHover={(point) => onPointHover(point as PointData | null)}
        arcsData={arcs}
        arcStartLat={(d) => (d as ArcData).startLat}
        arcStartLng={(d) => (d as ArcData).startLng}
        arcEndLat={(d) => (d as ArcData).endLat}
        arcEndLng={(d) => (d as ArcData).endLng}
        arcDashLength={() => 0.5}
        arcDashGap={() => 0.5}
        arcDashAnimateTime={() => 2000}
      />
      {hovered && <PointHoverWindow mousePos={mousePos} hovered={hovered} />}
      {clicked && (
        <PointPopupWindow point={clicked} onClose={() => setClicked(null)} />
      )}
    </div>
  );
}
