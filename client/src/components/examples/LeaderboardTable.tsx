import LeaderboardTable, { LeaderboardEntry } from '../LeaderboardTable';

export default function LeaderboardTableExample() {
  // todo: remove mock functionality - sample data matching the image
  const mockEntries: LeaderboardEntry[] = [
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

  return <LeaderboardTable entries={mockEntries} category="efemeros" />;
}