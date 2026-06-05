import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import StatCard from "../components/StatCard";
import AnalyticsChart from "../components/AnalyticsChart";

export default function StudentDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsRes, recommendationRes] = await Promise.all([
          API.get("/courses/student/analytics"),
          API.get("/courses/student/recommendation"),
        ]);
        setAnalytics(analyticsRes.data);
        setPath(recommendationRes.data.path);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-slate-900">Student Dashboard</h1>
            <p className="mt-3 text-slate-600">Track your courses, quiz performance, and learning path.</p>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <StatCard title="Courses" value={analytics ? analytics.totalCourses : "..."} />
            <StatCard title="Completed" value={analytics ? analytics.completedCourses : "..."} />
            <StatCard title="Average Score" value={analytics ? `${analytics.averageScore}%` : "..."} />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <AnalyticsChart data={analytics} />
            <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="text-xl font-semibold text-slate-900">Recommended Learning Path</h2>
              <div className="mt-6 space-y-4">
                {loading ? (
                  <p className="text-slate-500">Loading recommendation...</p>
                ) : path.length > 0 ? (
                  path.map((item) => (
                    <div key={item.title} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{item.title}</p>
                          {item.reason && <p className="mt-2 text-sm text-slate-500">{item.reason}</p>}
                        </div>
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700">{item.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">No recommendations available yet.</p>
                )}
              </div>
            </div>
          </section>

          {analytics && analytics.recentCourses?.length > 0 && (
            <section className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900">Recent Courses</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {analytics.recentCourses.map((course) => (
                  <div key={course.id} className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                    <p className="text-slate-500 mt-2">{course.category}</p>
                    <p className="mt-3 text-slate-600">Progress: {course.progress}%</p>
                    <p className="text-slate-600">Score: {course.score}%</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
