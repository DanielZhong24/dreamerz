'use client';

import Globe from 'react-globe.gl';
import { smallGlobeData } from '@/app/_mock/pointsData';
import { useEffect, useState } from 'react';

import FloatWindow from './float-window';

interface PointData {
  id: number
  name: string
  desc: string
  image: string
  image_alt: string
  video: string
  lat: number
  lng: number
}

export default function DreamGlobe() {
  const [points, setPoints] = useState<PointData[]>([]);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<PointData | null>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  function onPointClick(point: PointData) {
    console.log(point.name);
  }

  function onPointHover(point: PointData | null) {
    setHovered(point);
  }

  useEffect(() => {
    const fetchData = async () => { };

    fetchData();

    setPoints(smallGlobeData);
  }, []);

  return (
    <div className="w-screen h-screen" onMouseMove={handleMouseMove}>
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="#202020"
        animateIn={true}
        pointsData={points}
        pointLabel={""}
        onPointClick={(point) => onPointClick(point as PointData)}
        onPointHover={(point) => onPointHover(point as PointData | null)}
      />
      {hovered && (
        <FloatWindow mousePos={mousePos} hovered={hovered} />
      )}
    </div>
  );
}
