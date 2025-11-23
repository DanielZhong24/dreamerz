import Image from 'next/image'

export default function FloatWindow({ mousePos, hovered }: { mousePos: { x: number; y: number }; hovered: { name: string; desc?: string; image: string; image_alt: string; lat: number; lng: number } }) {
  return (
    <div
      className="flex flex-col fixed bg-[#202020] gap-2 p-4 rounded-xl z-50 text-white pointer-events-none"
      style={{ left: mousePos.x + 12, top: mousePos.y + 12, width: '512px' }}
    >
      <div className="font-semibold text-xl">{hovered.name}</div>

      {hovered.image && (
        <div className="w-full h-64 bg-black">
        </div>
      )}

      {hovered.desc && <div className="opacity-80 text-sm">{hovered.desc}</div>}

      <div className="opacity-50 mt-2 text-xs">
        lat {hovered.lat.toFixed(2)}, lng {hovered.lng.toFixed(2)}
      </div>
    </div>
  )
}
