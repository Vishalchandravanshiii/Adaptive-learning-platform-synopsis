import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [overviewRes, usersRes, coursesRes] = await Promise.all([
          API.get("/admin/overview"),
          API.get("/admin/users"),
          API.get("/admin/courses"),
        ]);
        setOverview(overviewRes.data);
        setUsers(usersRes.data);
        setCourses(coursesRes.data);
      } catch (error) {
        toast.error("Unable to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role });
      setUsers((current) => current.map((user) => (user._id === userId ? { ...user, role } : user)));
      toast.success("User role updated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update role.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers((current) => current.filter((user) => user._id !== userId));
      toast.success("User deleted.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete user.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="mt-3 text-slate-600">Manage users, courses, and platform metrics from one place.</p>
          </section>

          <section className="grid gap-6 md:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Total Users</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{overview ? overview.totalUsers : loading ? "..." : 0}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Students</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{overview ? overview.totalStudents : loading ? "..." : 0}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Instructors</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{overview ? overview.totalInstructors : loading ? "..." : 0}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Courses</p>
              <p className="mt-4 text-4xl font-semibold text-slate-900">{overview ? overview.totalCourses : loading ? "..." : 0}</p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900">Users</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-4 py-4 text-sm text-slate-900">{user.name}</td>
                        <td className="px-4 py-4 text-sm text-slate-500">{user.email}</td>
                        <td className="px-4 py-4 text-sm text-slate-900">
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user._id, e.target.value)}
                            className="rounded-2xl border border-slate-300 px-3 py-2 text-sm"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="rounded-2xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && !loading && (
                      <tr>
                        <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900">Courses</h2>
              <div className="mt-6 space-y-4">
                {courses.map((course) => (
                  <div key={course._id} className="rounded-3xl border border-slate-200 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                        <p className="text-sm text-slate-500">{course.category} • {course.difficulty}</p>
                      </div>
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700">{course.instructor?.name || "Unknown"}</span>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && !loading && (
                  <p className="text-slate-500">No courses are currently published.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
