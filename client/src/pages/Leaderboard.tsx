import { useState } from "react";
import LeaderboardToggle from "@/components/LeaderboardToggle";
import LeaderboardTable, { LeaderboardEntry } from "@/components/LeaderboardTable";

export default function Leaderboard() {
  const [activeCategory, setActiveCategory] = useState<"efemeros" | "rosetta">("efemeros");

  // todo: remove mock functionality - sample data from the image
  const efemeriosData: LeaderboardEntry[] = [
    {
      id: "1",
      playerName: "HumanoOnce",
      teamName: "Seres Humanos",
      energyPoints: 400,
      rank: 1,
    },
    {
      id: "2", 
      playerName: "ZzGENERALzZ",
      teamName: "ANGELS",
      energyPoints: 70,
      rank: 2,
    },
    {
      id: "3",
      playerName: "_Matiu",
      teamName: "LATAM",
      energyPoints: 70,
      rank: 3,
    },
    {
      id: "4",
      playerName: "DeviantFALLIDO",
      teamName: "Gordit0s lexones",
      energyPoints: 50,
      rank: 4,
    },
    {
      id: "5",
      playerName: "G3mini",
      teamName: "Seres Humanos",
      energyPoints: 50,
      rank: 5,
    },
    {
      id: "6",
      playerName: "Ratitaa",
      teamName: "Seres Humanos",
      energyPoints: 20,
      rank: 6,
    },
    {
      id: "7",
      playerName: "Thechamps3",
      teamName: "ANGELS",
      energyPoints: 10,
      rank: 7,
    },
  ];

  const rosettaData: LeaderboardEntry[] = [
    {
      id: "8",
      playerName: "HumanoOnce",
      teamName: "Seres Humanos", 
      energyPoints: 400,
      rank: 1,
    },
    {
      id: "9",
      playerName: "RosettaPlayer2",
      teamName: "Blue Team",
      energyPoints: 350,
      rank: 2,
    },
    {
      id: "10",
      playerName: "CrystalMaster",
      teamName: "Diamond Guild",
      energyPoints: 300,
      rank: 3,
    },
    {
      id: "11",
      playerName: "BlueStorm",
      teamName: "Storm Legion",
      energyPoints: 250,
      rank: 4,
    },
  ];

  const currentData = activeCategory === "efemeros" ? efemeriosData : rosettaData;

  return (
    <div className="min-h-screen bg-background">
      <LeaderboardToggle 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <div className="container mx-auto px-8 py-8">
        <LeaderboardTable 
          entries={currentData}
          category={activeCategory}
        />
      </div>
    </div>
  );
}