"use client"

const segments = [
  { color: 'bg-orange-500', label: 'Timer' },
  { color: 'bg-orange-300', label: 'Animatable' },
  { color: 'bg-green-400', label: 'Scope' },
  { color: 'bg-cyan-400', label: 'Spring' },
  { color: 'bg-orange-400', label: 'Animation' },
  { color: 'bg-lime-400', label: 'Draggable' },
  { color: 'bg-green-300', label: 'Stagger' },
  { color: 'bg-cyan-300', label: 'WAAPI' },
  { color: 'bg-yellow-400', label: 'Timeline' },
  { color: 'bg-teal-300', label: 'Scroll' },
  { color: 'bg-cyan-200', label: 'SVG' }
]

export default function BundleSizeCard() {
  return (
    <div className="bg-[#1c1c1c] p-4 rounded-xl text-white max-w-sm mx-auto absolute top-0 right-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Bundle size</span>
        <span className="text-lg font-bold">16.99 KB</span>
      </div>
      <div className="flex h-2 w-full rounded-full overflow-hidden mb-3 bg-gray-700">
        {segments.map((seg, i) => (
          <div key={i} className={`${seg.color}`} style={{ flex: '1 0 auto', width: '8%' }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 text-xs">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center space-x-1">
            <span className={`w-2 h-2 inline-block rounded-full ${seg.color}`} />
            <span>{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
