interface RankMedalProps {
  rank: number;
}

export default function RankMedal({ rank }: RankMedalProps) {
  if (rank === 1) {
    return (
      <div 
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
        style={{
          background: "radial-gradient(circle, #ffd700 0%, #ffed4e 40%, #b8860b 100%)",
          borderColor: "#ffd700",
          color: "#8b6914"
        }}
      >
        1
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div 
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
        style={{
          background: "radial-gradient(circle, #c0c0c0 0%, #e5e5e5 40%, #a0a0a0 100%)",
          borderColor: "#c0c0c0",
          color: "#555555"
        }}
      >
        2
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div 
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
        style={{
          background: "radial-gradient(circle, #cd7f32 0%, #daa520 40%, #8b4513 100%)",
          borderColor: "#cd7f32",
          color: "#4a2c17"
        }}
      >
        3
      </div>
    );
  }

  return (
    <div className="w-7 h-7 flex items-center justify-center">
      <span className="text-gray-400 font-medium text-sm">{rank}</span>
    </div>
  );
}