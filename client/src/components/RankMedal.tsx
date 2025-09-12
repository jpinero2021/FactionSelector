interface RankMedalProps {
  rank: number;
}

export default function RankMedal({ rank }: RankMedalProps) {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center border-2 border-yellow-300/50">
        <span className="text-yellow-900 font-bold text-sm">1</span>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center border-2 border-gray-200/50">
        <span className="text-gray-700 font-bold text-sm">2</span>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center border-2 border-amber-400/50">
        <span className="text-amber-100 font-bold text-sm">3</span>
      </div>
    );
  }

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <span className="text-muted-foreground font-medium text-sm">{rank}</span>
    </div>
  );
}