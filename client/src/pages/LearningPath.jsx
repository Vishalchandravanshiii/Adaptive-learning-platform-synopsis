import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function LearningPath() {
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPath = async () => {
      try {
        const { data } = await API.get("/courses/student/recommendation");
        setPath(data.path || []);
      } catch (error) {
        toast.error("Unable to load learning path.");
      } finally {
        setLoading(false);
      }
    };

    loadPath();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-slate-900">Learning Path</h1>
            <p className="mt-3 text-slate-600">Follow a recommended learning path tailored for you.</p>
          </div>
          {loading ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg text-slate-600">Loading learning recommendations...</div>
          ) : (
            <div className="space-y-4">
              {path.length > 0 ? (
                path.map((item, index) => (
                  <div key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-slate-900 font-semibold">{index + 1}. {item.title}</p>
                        {item.reason && <p className="mt-2 text-sm text-slate-500">{item.reason}</p>}
                      </div>
                      <span className="rounded-full bg-cyan-100 px-4 py-1 text-sm text-cyan-700">{item.type}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl bg-white p-6 shadow-sm text-slate-500">No recommendations are available yet. Complete courses to get personalized guidance.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
