interface LeaderboardToggleProps {
  activeCategory: "efemeros" | "rosetta";
  onCategoryChange: (category: "efemeros" | "rosetta") => void;
}

export default function LeaderboardToggle({ activeCategory, onCategoryChange }: LeaderboardToggleProps) {
  return (
    <div 
      className="relative bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 px-8 py-6 flex items-center justify-between"
      style={{
        background: "linear-gradient(90deg, #4a5568 0%, #5a6c7d 25%, #6b8094 50%, #5a6c7d 75%, #4a5568 100%)"
      }}
    >
      {/* Left Section - Efémeros */}
      <div 
        className={`flex items-center gap-4 cursor-pointer hover-elevate p-2 rounded transition-all ${
          activeCategory === "efemeros" ? "bg-cyan-500/20" : ""
        }`}
        onClick={() => onCategoryChange("efemeros")}
      >
        <h1 className="text-white text-2xl font-bold">Efémeros</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-300">Energía de prisma de facción</span>
          <span className="text-cyan-400 font-bold">💎 5590</span>
        </div>
      </div>

      {/* Center Icons */}
      <div className="flex items-center gap-4">
        {/* Crystal/Diamond Icon */}
        <div className="w-12 h-12 bg-cyan-500/30 rounded-full flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
            <path d="M6 3h12l4 6-10 12L2 9l4-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Arrow/Separator */}
        <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
        
        {/* Right Icon */}
        <div className="w-12 h-12 bg-slate-500/50 rounded flex items-center justify-center">
          <div className="text-slate-300 text-xl font-bold">R</div>
        </div>
      </div>

      {/* Right Section - Rosetta */}
      <div 
        className={`flex items-center cursor-pointer hover-elevate p-2 rounded transition-all ${
          activeCategory === "rosetta" ? "bg-blue-500/20" : ""
        }`}
        onClick={() => onCategoryChange("rosetta")}
      >
        <h1 className="text-white text-2xl font-bold">Rosetta</h1>
      </div>

      {/* Hidden toggle controls - will be used for functionality */}
      <div className="absolute top-full left-0 opacity-0 pointer-events-none">
        <button onClick={() => onCategoryChange("efemeros")} data-testid="button-toggle-efemeros">
          Efémeros
        </button>
        <button onClick={() => onCategoryChange("rosetta")} data-testid="button-toggle-rosetta">
          Rosetta
        </button>
      </div>
    </div>
  );
}