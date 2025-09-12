interface LeaderboardToggleProps {
  activeCategory: "efemeros" | "rosetta";
  onCategoryChange: (category: "efemeros" | "rosetta") => void;
}

export default function LeaderboardToggle({ activeCategory, onCategoryChange }: LeaderboardToggleProps) {
  return (
    <div 
      className="relative px-8 py-6 flex items-center justify-between border-b-2"
      style={{
        background: "linear-gradient(90deg, #4a90a4 0%, #5fb3cc 25%, #7dd3f0 50%, #5fb3cc 75%, #4a90a4 100%)",
        borderBottomColor: "#2d3748"
      }}
    >
      {/* Left Section - Efémeros */}
      <div 
        className={`flex flex-col cursor-pointer transition-all ${
          activeCategory === "efemeros" ? "opacity-100" : "opacity-80"
        }`}
        onClick={() => onCategoryChange("efemeros")}
        data-testid="button-toggle-efemeros"
      >
        <h1 className="text-white text-3xl font-bold tracking-wide">Efémeros</h1>
        <div className="flex items-center gap-2 text-sm mt-1">
          <span className="text-white/90">Energía de prisma de facción</span>
          <span className="text-cyan-300 font-bold">💎 5590</span>
        </div>
      </div>

      {/* Center Icons */}
      <div className="flex items-center gap-6">
        {/* Crystal Wing Icon */}
        <div className="w-16 h-16 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none" className="text-cyan-200">
            <path d="M50 10 L30 25 L35 50 L50 85 L65 50 L70 25 Z" fill="currentColor" opacity="0.8"/>
            <path d="M50 10 L25 30 L30 55 L50 90 L70 55 L75 30 Z" fill="currentColor" opacity="0.6"/>
            <path d="M50 15 L35 30 L40 50 L50 80 L60 50 L65 30 Z" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>
        
        {/* Arrow/Separator */}
        <div className="flex items-center">
          <div className="w-8 h-1 bg-white/70"></div>
          <div className="w-0 h-0 border-l-4 border-l-white/70 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
        </div>
        
        {/* Rosetta Icon */}
        <div className="w-16 h-16 flex items-center justify-center">
          <div 
            className="w-12 h-12 flex items-center justify-center text-2xl font-bold"
            style={{
              background: "linear-gradient(45deg, #a0aec0, #e2e8f0, #a0aec0)",
              color: "#2d3748",
              clipPath: "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)"
            }}
          >
            R
          </div>
        </div>
      </div>

      {/* Right Section - Rosetta */}
      <div 
        className={`flex items-center cursor-pointer transition-all ${
          activeCategory === "rosetta" ? "opacity-100" : "opacity-80"
        }`}
        onClick={() => onCategoryChange("rosetta")}
        data-testid="button-toggle-rosetta"
      >
        <h1 className="text-white text-3xl font-bold tracking-wide">Rosetta</h1>
      </div>

    </div>
  );
}