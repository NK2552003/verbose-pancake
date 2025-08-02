"use client"

export default function FundingGoalCard() {
  return (
    <div className="bg-[#1c1c1c] p-4 rounded-xl text-white max-w-sm mx-auto absolute top-0 right-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Funding goal</span>
        <span className="text-red-400 font-bold">23%</span>
      </div>
      <div className="w-full h-3 bg-gray-700 rounded-full mb-3">
        <div className="h-full bg-red-500 rounded-full" style={{ width: '23%' }} />
      </div>
      <div className="flex overflow-hidden space-x-[-10px] mb-3">
        {[...Array(25)].map((_, i) => (
          <img
            key={i}
            src={`https://i.pravatar.cc/40?img=${i + 1}`}
            className="w-6 h-6 rounded-full border-2 border-black"
          />
        ))}
      </div>
      <p className="text-sm">
        Help the project survive, <a href="#" className="text-red-400 underline">become a sponsor</a>.
      </p>
    </div>
  )
}
