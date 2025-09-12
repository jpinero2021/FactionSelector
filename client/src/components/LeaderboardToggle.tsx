import mayflyLogo from "@assets/bg remover_1757650181268.png";
import rossettaLogo from "@assets/asdqwe_1757650181266.png";

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
        {/* Mayfly/Efémeros Logo */}
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={mayflyLogo} 
            alt="Mayfly Logo" 
            className="w-12 h-12 object-contain"
            style={{
              filter: activeCategory === "efemeros" ? "brightness(1.2)" : "brightness(0.8)"
            }}
          />
        </div>
        
        {/* Arrow/Separator */}
        <div className="flex items-center">
          <div className="w-8 h-1 bg-white/70"></div>
          <div className="w-0 h-0 border-l-4 border-l-white/70 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
        </div>
        
        {/* Rossetta Logo */}
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={rossettaLogo} 
            alt="Rossetta Logo" 
            className="w-12 h-12 object-contain"
            style={{
              filter: activeCategory === "rosetta" ? "brightness(1.2)" : "brightness(0.8)"
            }}
          />
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