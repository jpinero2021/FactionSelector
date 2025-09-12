import mayflyLogo from "@assets/bg remover_1757655880929.png";
import rossettaLogo from "@assets/asdqwe_1757655899796.png";

interface LeaderboardToggleProps {
  activeCategory: "efemeros" | "rosetta";
  onCategoryChange: (category: "efemeros" | "rosetta") => void;
}

export default function LeaderboardToggle({ activeCategory, onCategoryChange }: LeaderboardToggleProps) {
  return (
    <div 
      className="relative px-8 py-6 border-b-2 transition-all duration-700 ease-in-out"
      style={{
        background: activeCategory === "efemeros" 
          ? "linear-gradient(90deg, #1e40af 0%, #3b82f6 25%, #60a5fa 50%, #3b82f6 75%, #1e40af 100%)"
          : "linear-gradient(90deg, #dc2626 0%, #ef4444 25%, #f87171 50%, #ef4444 75%, #dc2626 100%)",
        borderBottomColor: "#2d3748"
      }}
    >
      {/* 3-Region Grid Layout */}
      <div className="mx-auto w-full max-w-4xl grid grid-cols-[1fr_auto_1fr] items-center gap-8">
        
        {/* Left Section - Efémeros */}
        <div 
          className={`flex flex-col cursor-pointer transition-all duration-500 ease-in-out justify-self-end text-right ${
            activeCategory === "efemeros" 
              ? "opacity-100 scale-110" 
              : "opacity-70 scale-95"
          }`}
          onClick={() => onCategoryChange("efemeros")}
          data-testid="button-toggle-efemeros"
        >
          <h1 className={`font-bold tracking-wide transition-all duration-500 ${
            activeCategory === "efemeros" 
              ? "text-white text-4xl" 
              : "text-white/80 text-2xl"
          }`}>
            Efémeros
          </h1>
        </div>

        {/* Center Icons - Fixed Width */}
        <div className="flex items-center gap-6 transition-all duration-500 ease-in-out min-w-[140px] justify-center">
          {/* Mayfly/Efémeros Logo */}
          <div className={`w-20 h-20 flex items-center justify-center transition-all duration-500 ${
            activeCategory === "efemeros" ? "scale-110" : "scale-90"
          }`}>
            <img 
              src={mayflyLogo} 
              alt="Mayfly Logo" 
              className="w-16 h-16 object-contain transition-all duration-500"
              style={{
                filter: activeCategory === "efemeros" 
                  ? "brightness(1.3) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))" 
                  : "brightness(0.7)"
              }}
            />
          </div>
          
          {/* Arrow/Separator */}
          <div className="flex items-center">
            <div className="w-10 h-1 bg-white/70 transition-all duration-300"></div>
            <div className="w-0 h-0 border-l-4 border-l-white/70 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
          </div>
          
          {/* Rossetta Logo */}
          <div className={`w-20 h-20 flex items-center justify-center transition-all duration-500 ${
            activeCategory === "rosetta" ? "scale-110" : "scale-90"
          }`}>
            <img 
              src={rossettaLogo} 
              alt="Rossetta Logo" 
              className="w-16 h-16 object-contain transition-all duration-500"
              style={{
                filter: activeCategory === "rosetta" 
                  ? "brightness(1.3) drop-shadow(0 0 10px rgba(220, 38, 38, 0.5))" 
                  : "brightness(0.7)"
              }}
            />
          </div>
        </div>

        {/* Right Section - Rosetta */}
        <div 
          className={`flex items-center cursor-pointer transition-all duration-500 ease-in-out justify-self-start text-left ${
            activeCategory === "rosetta" 
              ? "opacity-100 scale-110" 
              : "opacity-70 scale-95"
          }`}
          onClick={() => onCategoryChange("rosetta")}
          data-testid="button-toggle-rosetta"
        >
          <h1 className={`font-bold tracking-wide transition-all duration-500 ${
            activeCategory === "rosetta" 
              ? "text-white text-4xl" 
              : "text-white/80 text-2xl"
          }`}>
            Rosetta
          </h1>
        </div>

      </div>
    </div>
  );
}