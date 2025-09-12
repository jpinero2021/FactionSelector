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
    <div className="bg-card border border-card-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-muted/30 border-b border-border/50">
        <div className="text-muted-foreground text-sm font-medium">Clasificación</div>
        <div className="text-muted-foreground text-sm font-medium">Jugador</div>
        <div className="text-muted-foreground text-sm font-medium">Colmena</div>
        <div className="text-muted-foreground text-sm font-medium text-right">Energía de prisma</div>
      </div>

      {/* Entries */}
      <div className="divide-y divide-border/30">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`grid grid-cols-4 gap-4 px-6 py-4 hover-elevate transition-colors ${
              index % 2 === 0 ? "bg-background" : "bg-muted/10"
            }`}
            data-testid={`row-player-${entry.rank}`}
          >
            {/* Rank */}
            <div className="flex items-center">
              <RankMedal rank={entry.rank} />
            </div>

            {/* Player Name */}
            <div className="flex items-center">
              <span className="text-foreground font-medium">{entry.playerName}</span>
            </div>

            {/* Team Name */}
            <div className="flex items-center">
              <span className="text-muted-foreground">{entry.teamName}</span>
            </div>

            {/* Energy Points */}
            <div className="flex items-center justify-end">
              <span className="text-foreground font-semibold">{entry.energyPoints}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}