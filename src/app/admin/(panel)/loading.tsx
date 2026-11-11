export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 rounded-xl bg-indigo/10" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-3xl bg-indigo/5" />
        ))}
      </div>
      <div className="h-64 rounded-3xl bg-indigo/5" />
    </div>
  );
}
