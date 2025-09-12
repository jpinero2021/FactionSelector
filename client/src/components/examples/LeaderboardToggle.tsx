import { useState } from "react";
import LeaderboardToggle from '../LeaderboardToggle';

export default function LeaderboardToggleExample() {
  const [activeCategory, setActiveCategory] = useState<"efemeros" | "rosetta">("efemeros");

  return (
    <LeaderboardToggle 
      activeCategory={activeCategory} 
      onCategoryChange={setActiveCategory} 
    />
  );
}