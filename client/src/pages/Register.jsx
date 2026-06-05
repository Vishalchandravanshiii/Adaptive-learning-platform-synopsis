import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await API.post("/auth/register", form);
      toast.success("Registration successful. Please log in.");
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6">Create account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-600">Name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Role</span>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </label>
          <button className="w-full rounded-2xl bg-cyan-600 py-3 text-white font-semibold hover:bg-cyan-700 transition">
            Sign up
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/" className="text-cyan-600 font-semibold hover:text-cyan-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
