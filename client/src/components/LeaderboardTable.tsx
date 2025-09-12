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
    <div 
      className="overflow-hidden"
      style={{
        backgroundColor: "#2d3748",
        border: "1px solid #4a5568"
      }}
    >
      {/* Header */}
      <div 
        className="grid grid-cols-4 gap-4 px-6 py-4 border-b"
        style={{
          backgroundColor: "#1a202c",
          borderColor: "#4a5568"
        }}
      >
        <div className="text-slate-400 text-sm font-medium">Clasificación</div>
        <div className="text-slate-400 text-sm font-medium">Jugador</div>
        <div className="text-slate-400 text-sm font-medium">Colmena</div>
        <div className="text-slate-400 text-sm font-medium text-right">Energía de prisma</div>
      </div>

      {/* Entries */}
      <div>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="grid grid-cols-4 gap-4 px-6 py-4 hover-elevate transition-colors border-b border-slate-600/30"
            style={{
              backgroundColor: index % 2 === 0 ? "#2d3748" : "#374151"
            }}
            data-testid={`row-player-${entry.rank}`}
          >
            {/* Rank */}
            <div className="flex items-center">
              <RankMedal rank={entry.rank} />
            </div>

            {/* Player Name */}
            <div className="flex items-center">
              <span className="text-white font-medium">{entry.playerName}</span>
            </div>

            {/* Team Name */}
            <div className="flex items-center">
              <span className="text-slate-300">{entry.teamName}</span>
            </div>

            {/* Energy Points */}
            <div className="flex items-center justify-end">
              <span className="text-white font-semibold">{entry.energyPoints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}