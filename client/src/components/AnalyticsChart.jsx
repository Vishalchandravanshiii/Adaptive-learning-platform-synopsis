export default function AnalyticsChart({ data }) {
  if (!data) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-slate-500">Loading chart...</p>
      </div>
    );
  }

  const chartItems = [
    { label: "Completed", value: data.completedCourses, color: "bg-cyan-500" },
    { label: "Average", value: `${data.averageScore}%`, color: "bg-slate-900" },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Learning Performance</h2>
      <div className="mt-6 space-y-4">
        {chartItems.map((item) => {
          const width =
            item.label === "Average"
              ? item.value
              : `${Math.min(item.value * 20, 100)}%`;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                <div className={`${item.color} h-full`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
