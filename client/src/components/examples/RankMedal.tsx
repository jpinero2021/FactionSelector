import RankMedal from '../RankMedal';

export default function RankMedalExample() {
  return (
    <div className="flex gap-4 p-4">
      <RankMedal rank={1} />
      <RankMedal rank={2} />
      <RankMedal rank={3} />
      <RankMedal rank={4} />
      <RankMedal rank={7} />
    </div>
  );
}