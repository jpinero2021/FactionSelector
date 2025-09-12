import { Button } from "@/components/ui/button";

interface LeaderboardToggleProps {
  activeCategory: "efemeros" | "rosetta";
  onCategoryChange: (category: "efemeros" | "rosetta") => void;
}

export default function LeaderboardToggle({ activeCategory, onCategoryChange }: LeaderboardToggleProps) {
  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-cyan-500/20 to-blue-500/20 py-6 px-8 border-b border-border/50">
      <div className="flex items-center gap-4">
        {/* Efémeros Section */}
        <div className="flex items-center gap-3">
          <div className="text-cyan-400 text-lg font-medium">Efémeros</div>
          <div className="text-muted-foreground text-sm">Energía de prisma de facción</div>
          <div className="text-cyan-400 font-bold">5590</div>
        </div>

        {/* Center Icons */}
        <div className="flex items-center gap-2 mx-8">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <div className="text-cyan-400 text-xl">⚡</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 transform rotate-45 mx-2"></div>
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <div className="text-blue-400 text-xl">💎</div>
          </div>
        </div>

        {/* Rosetta Section */}
        <div className="flex items-center gap-3">
          <div className="text-blue-400 text-lg font-medium">Rosetta</div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="absolute right-8 flex gap-2">
        <Button
          variant={activeCategory === "efemeros" ? "default" : "ghost"}
          onClick={() => onCategoryChange("efemeros")}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
            activeCategory === "efemeros"
              ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="button-toggle-efemeros"
        >
          Efémeros
        </Button>
        <Button
          variant={activeCategory === "rosetta" ? "default" : "ghost"}
          onClick={() => onCategoryChange("rosetta")}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
            activeCategory === "rosetta"
              ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-testid="button-toggle-rosetta"
        >
          Rosetta
        </Button>
      </div>
    </div>
  );
}