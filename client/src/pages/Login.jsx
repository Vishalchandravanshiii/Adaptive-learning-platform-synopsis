import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      toast.success("Login successful");

      if (data.user.role === "student") navigate("/student");
      if (data.user.role === "instructor") navigate("/instructor");
      if (data.user.role === "admin") navigate("/admin");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-600">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
            />
          </label>
          <button className="w-full rounded-2xl bg-cyan-600 py-3 text-white font-semibold hover:bg-cyan-700 transition">
            Continue
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-cyan-600 font-semibold hover:text-cyan-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
