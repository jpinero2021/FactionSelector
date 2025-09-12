import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeaderboardToggle from "@/components/LeaderboardToggle";
import LeaderboardTable, { LeaderboardEntry } from "@/components/LeaderboardTable";
import RegistrationForm from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FactionRegistration } from "@shared/schema";

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
      style={{
        backgroundColor: "#1a1a1a"
      }}
    >
      <div className="w-full max-w-4xl mx-auto shadow-2xl">
        {/* Registration Button - Moved to top */}
        <div className="flex justify-center mb-6">
          <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 py-2"
                data-testid="button-open-registration"
              >
                Registrarse
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="sm:max-w-md border-slate-600"
              style={{ backgroundColor: "#1a1a1a" }}
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
          className="mt-6 px-8 py-4 text-center border-t border-gray-600"
          style={{
            backgroundColor: "#2a2a2a"
          }}
        >
          <div className="text-gray-300 text-sm">
            <span className="text-cyan-400 font-medium">Efémeros: {efemeriosRegistrations.length}</span>
            <span className="mx-4 text-gray-500">vs</span>
            <span className="text-blue-400 font-medium">Rosetta: {rosettaRegistrations.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}