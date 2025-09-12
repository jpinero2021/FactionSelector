import RankMedal from "./RankMedal";

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  teamName: string;
  energyPoints: number;
  rank: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  category: "efemeros" | "rosetta";
}

export default function LeaderboardTable({ entries, category }: LeaderboardTableProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div 
        className="grid grid-cols-4 gap-6 px-8 py-4"
        style={{
          backgroundColor: "#1a1a1a"
        }}
      >
        <div className="text-gray-400 text-sm font-medium">Clasificación</div>
        <div className="text-gray-400 text-sm font-medium">Jugador</div>
        <div className="text-gray-400 text-sm font-medium">Colmena</div>
        <div className="text-gray-400 text-sm font-medium text-right">Energía de prisma</div>
      </div>

      {/* Entries */}
      <div>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="grid grid-cols-4 gap-6 px-8 py-4 hover:bg-gray-700/20 transition-colors"
            style={{
              backgroundColor: "#2a2a2a"
            }}
            data-testid={`row-player-${entry.rank}`}
          >
            {/* Rank */}
            <div className="flex items-center">
              <RankMedal rank={entry.rank} />
            </div>

            {/* Player Name */}
            <div className="flex items-center">
              <span className="text-white font-normal text-base">{entry.playerName}</span>
            </div>

            {/* Team Name */}
            <div className="flex items-center">
              <span className="text-gray-300 font-normal text-base">{entry.teamName}</span>
            </div>

            {/* Energy Points */}
            <div className="flex items-center justify-end">
              <span className="text-white font-normal text-base">{entry.energyPoints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}