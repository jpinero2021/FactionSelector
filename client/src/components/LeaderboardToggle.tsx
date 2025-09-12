import mayflyLogo from "@assets/bg remover_1757655880929.png";
import rossettaLogo from "@assets/asdqwe_1757655899796.png";

interface LeaderboardToggleProps {
  activeCategory: "efemeros" | "rosetta";
  onCategoryChange: (category: "efemeros" | "rosetta") => void;
}

export default function LeaderboardToggle({ activeCategory, onCategoryChange }: LeaderboardToggleProps) {
  return (
    <div 
      className="relative px-8 py-6 border-b-2 transition-all duration-700 ease-in-out overflow-hidden"
      style={{
        background: activeCategory === "efemeros" 
          ? "linear-gradient(90deg, rgba(30, 64, 175, 0.5) 0%, rgba(59, 130, 246, 0.5) 25%, rgba(96, 165, 250, 0.5) 50%, rgba(59, 130, 246, 0.5) 75%, rgba(30, 64, 175, 0.5) 100%)"
          : "linear-gradient(90deg, rgba(220, 38, 38, 0.5) 0%, rgba(239, 68, 68, 0.5) 25%, rgba(248, 113, 113, 0.5) 50%, rgba(239, 68, 68, 0.5) 75%, rgba(220, 38, 38, 0.5) 100%)",
        borderBottomColor: "#2d3748"
      }}
    >
      {/* Wave Effect */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <svg className="w-full h-16 overflow-visible" viewBox="0 0 1200 64" preserveAspectRatio="none">
          <defs>
            <path id="wave-path" d="M0 32 C 80 0, 160 64, 240 32 S 400 0, 480 32 S 640 64, 720 32 S 880 0, 960 32 S 1120 64, 1200 32" />
          </defs>
          <g className="wave-track">
            <use href="#wave-path" x="0" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.35" />
            <use href="#wave-path" x="1200" fill="none" stroke="white" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.35" />
          </g>
          <g className="wave-track wave-track--slow">
            <use href="#wave-path" x="0" fill="none" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.2" />
            <use href="#wave-path" x="1200" fill="none" stroke="white" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.2" />
          </g>
        </svg>
      </div>
      {/* 3-Region Grid Layout */}
      <div className="mx-auto w-full max-w-4xl grid grid-cols-[1fr_auto_1fr] items-center gap-8">
        
        {/* Left Section - Efémeros */}
        <div 
          className={`flex flex-col cursor-pointer transition-all duration-500 ease-in-out justify-self-end text-right ${
            activeCategory === "efemeros" 
              ? "opacity-100 scale-110" 
              : "opacity-90 scale-95"
          }`}
          onClick={() => onCategoryChange("efemeros")}
          data-testid="button-toggle-efemeros"
        >
          <h1 className={`font-bold tracking-wide transition-all duration-500 ${
            activeCategory === "efemeros" 
              ? "text-white text-4xl drop-shadow-lg" 
              : "text-white text-2xl drop-shadow-md"
          }`} style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>
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
                  : "brightness(1.0)"
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
                  : "brightness(1.0)"
              }}
            />
          </div>
        </div>

        {/* Right Section - Rosetta */}
        <div 
          className={`flex items-center cursor-pointer transition-all duration-500 ease-in-out justify-self-start text-left ${
            activeCategory === "rosetta" 
              ? "opacity-100 scale-110" 
              : "opacity-90 scale-95"
          }`}
          onClick={() => onCategoryChange("rosetta")}
          data-testid="button-toggle-rosetta"
        >
          <h1 className={`font-bold tracking-wide transition-all duration-500 ${
            activeCategory === "rosetta" 
              ? "text-white text-4xl drop-shadow-lg" 
              : "text-white text-2xl drop-shadow-md"
          }`} style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}>
            Rosetta
          </h1>
        </div>

      </div>
    </div>
  );
}