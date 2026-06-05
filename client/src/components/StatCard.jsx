export default function StatCard({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">{title}</p>
      <p className="mt-4 text-4xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
