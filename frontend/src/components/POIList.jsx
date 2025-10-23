import POICard from "./POICard";

export default function POIList({ results }) {
  if (!results.length) return <p className="text-center text-gray-500">No results yet</p>;

  return (
    <div className="space-y-2">
      {results.map((poi) => (
        <POICard key={poi.xid} poi={poi} />
      ))}
    </div>
  );
}
