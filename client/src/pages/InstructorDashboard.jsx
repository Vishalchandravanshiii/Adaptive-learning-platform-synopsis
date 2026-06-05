import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function InstructorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [createForm, setCreateForm] = useState({ title: "", description: "", category: "", difficulty: "Beginner" });
  const [moduleForm, setModuleForm] = useState({ title: "", description: "", courseId: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await API.get("/courses/instructor/dashboard");
        setDashboard(data);
        setCourses(data.courses || []);
      } catch (error) {
        toast.error("Unable to load instructor dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    try {
      const { data } = await API.post("/courses", createForm);
      setCourses((prev) => [data, ...prev]);
      setDashboard((prev) => ({
        ...prev,
        totalCourses: prev ? prev.totalCourses + 1 : 1,
        totalModules: prev ? prev.totalModules : 0,
      }));
      setCreateForm({ title: "", description: "", category: "", difficulty: "Beginner" });
      toast.success("Course created successfully.");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to create course.";
      toast.error(message);
    }
  };

  const handleAddModule = async (event) => {
    event.preventDefault();
    if (!moduleForm.courseId) {
      return toast.error("Select a course to add module to.");
    }
    try {
      const { data } = await API.post(`/courses/${moduleForm.courseId}/modules`, {
        title: moduleForm.title,
        description: moduleForm.description,
      });
      setCourses((currentCourses) => currentCourses.map((course) => (course._id === data._id ? data : course)));
      setDashboard((prev) => ({
        ...prev,
        totalModules: prev ? prev.totalModules + 1 : 1,
      }));
      setModuleForm({ title: "", description: "", courseId: "" });
      toast.success("Module added successfully.");
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to add module.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-slate-900">Instructor Dashboard</h1>
            <p className="mt-3 text-slate-600">Create courses, manage modules, and monitor student engagement.</p>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Your Courses</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{dashboard ? dashboard.totalCourses : loading ? "..." : 0}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Students</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{dashboard ? dashboard.totalStudents : loading ? "..." : 0}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Modules</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{dashboard ? dashboard.totalModules : loading ? "..." : 0}</p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900">Create New Course</h2>
              <form className="mt-6 space-y-4" onSubmit={handleCreateCourse}>
                <label className="block">
                  <span className="text-slate-600">Course title</span>
                  <input
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="React Fundamentals"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-slate-600">Category</span>
                  <input
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="Frontend"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-slate-600">Difficulty</span>
                  <select
                    value={createForm.difficulty}
                    onChange={(e) => setCreateForm({ ...createForm, difficulty: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-slate-600">Description</span>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="Summarize the course goals"
                    rows="4"
                  />
                </label>
                <button className="w-full rounded-2xl bg-cyan-600 py-3 text-white font-semibold hover:bg-cyan-700 transition">
                  Publish Course
                </button>
              </form>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900">Publish Module</h2>
              <form className="mt-6 space-y-4" onSubmit={handleAddModule}>
                <label className="block">
                  <span className="text-slate-600">Choose course</span>
                  <select
                    value={moduleForm.courseId}
                    onChange={(e) => setModuleForm({ ...moduleForm, courseId: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-slate-600">Module title</span>
                  <input
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="Building reusable components"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-slate-600">Module description</span>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                    placeholder="Outline the lesson and practice exercises"
                    rows="4"
                  />
                </label>
                <button className="w-full rounded-2xl bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition">
                  Add Module
                </button>
              </form>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900">Your courses</h2>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-slate-500">Loading your courses...</p>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course._id} className="rounded-3xl border border-slate-200 p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{course.title}</h3>
                        <p className="mt-2 text-slate-500">{course.category} • {course.difficulty}</p>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <span>{course.modules?.length || 0} modules</span>
                        <span>Published</span>
                      </div>
                    </div>
                    {course.description && <p className="mt-4 text-slate-600">{course.description}</p>}
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No courses found yet. Create your first course to begin.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
