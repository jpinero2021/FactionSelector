import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeaderboardToggle from "@/components/LeaderboardToggle";
import LeaderboardTable, { LeaderboardEntry } from "@/components/LeaderboardTable";
import RegistrationForm from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FactionRegistration } from "@shared/schema";
import efemerosLogo from "@assets/bg remover_1757655880929.png";
import rosettaLogo from "@assets/asdqwe_1757655899796.png";

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<"efemeros" | "rosetta">("efemeros");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  // Fetch all registrations from API
  const { data: registrations = [], isLoading, refetch } = useQuery<FactionRegistration[]>({
    queryKey: ["/api/registrations"],
  });

  // Convert faction registrations to leaderboard entries
  const convertToLeaderboardEntry = (registration: FactionRegistration, rank: number): LeaderboardEntry => ({
    id: registration.id || "",
    playerName: registration.playerName,
    characterUuid: registration.characterUuid || "-", // Show "-" if no UUID
    teamName: registration.teamName || "-", // Show "-" if no team name
    rank: rank,
    registrationId: registration.id || "",
    faction: registration.faction,
  });

  // Filter and rank registrations by faction
  const efemeriosRegistrations = registrations.filter(r => r.faction === "efemeros");
  const rosettaRegistrations = registrations.filter(r => r.faction === "rosetta");

  const efemeriosData: LeaderboardEntry[] = efemeriosRegistrations.map((reg, index) => 
    convertToLeaderboardEntry(reg, index + 1)
  );

  const rosettaData: LeaderboardEntry[] = rosettaRegistrations.map((reg, index) => 
    convertToLeaderboardEntry(reg, index + 1)
  );

  const currentData = activeCategory === "efemeros" ? efemeriosData : rosettaData;

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-8"
    >
      <div className="w-full max-w-4xl mx-auto shadow-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-2 text-white transition-all duration-500"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontWeight: "900",
              letterSpacing: "3px",
              filter: activeCategory === "efemeros" 
                ? "drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.3))" 
                : "drop-shadow(0 0 15px rgba(239, 68, 68, 0.6)) drop-shadow(0 0 30px rgba(239, 68, 68, 0.3))",
              textShadow: activeCategory === "efemeros"
                ? "0 0 8px rgba(59, 130, 246, 0.4), 0 0 16px rgba(59, 130, 246, 0.3)"
                : "0 0 8px rgba(239, 68, 68, 0.4), 0 0 16px rgba(239, 68, 68, 0.3)"
            }}
          >
            PRISMAVERSO 88
          </h1>
        </div>
        
        {/* Registration Button - Moved to top */}
        <div className="flex justify-center mb-6">
          <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
            <DialogTrigger asChild>
              <Button
                className="relative w-14 h-14 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                style={{
                  background: "#374151",
                  boxShadow: activeCategory === "efemeros"
                    ? "0 4px 15px rgba(59, 130, 246, 0.4)"
                    : "0 4px 15px rgba(239, 68, 68, 0.4)",
                  border: "0",
                  outline: "none"
                }}
                data-testid="button-open-registration"
              >
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto border-slate-600 z-50"
              style={{ backgroundColor: "rgba(26, 26, 26, 0.95)" }}
            >
              <RegistrationForm 
                onClose={() => setIsRegistrationOpen(false)}
                onSuccess={() => {
                  refetch(); // Refresh leaderboard data after registration
                  setIsRegistrationOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <LeaderboardToggle 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        
        <LeaderboardTable 
          entries={currentData}
          category={activeCategory}
        />
        
        {/* Faction Stats */}
        <div 
          className="mt-6 px-8 py-6 border-t border-gray-600"
          style={{
            background: "linear-gradient(90deg, rgba(30, 64, 175, 0.85) 0%, rgba(42, 42, 42, 0.85) 50%, rgba(220, 38, 38, 0.85) 100%)"
          }}
        >
          <div className="flex items-center justify-center gap-8">
            {/* Efémeros Stats */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src={efemerosLogo} 
                  alt="Efémeros" 
                  className="w-6 h-6 object-contain"
                  style={{
                    filter: "brightness(1.2) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))"
                  }}
                />
              </div>
              <span className="text-cyan-300 font-bold text-lg">
                Efémeros
              </span>
              <span className="text-white font-bold text-xl bg-cyan-600/30 px-3 py-1 rounded-full border border-cyan-500/50">
                {efemeriosRegistrations.length}
              </span>
            </div>

            {/* VS Separator */}
            <div className="text-white/70 font-bold text-xl">
              VS
            </div>

            {/* Rosetta Stats */}
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-xl bg-red-600/30 px-3 py-1 rounded-full border border-red-500/50">
                {rosettaRegistrations.length}
              </span>
              <span className="text-red-300 font-bold text-lg">
                Rosetta
              </span>
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src={rosettaLogo} 
                  alt="Rosetta" 
                  className="w-6 h-6 object-contain"
                  style={{
                    filter: "brightness(1.2) drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}