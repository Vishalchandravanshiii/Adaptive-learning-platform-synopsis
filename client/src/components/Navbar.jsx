import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dashboardLink = user?.role === "student" ? "/student" : user?.role === "instructor" ? "/instructor" : "/admin";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link to={dashboardLink} className="text-xl font-semibold text-slate-900">
            Adaptive Learning
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-slate-600">
            <Link to={dashboardLink} className="hover:text-cyan-600 transition">
              Dashboard
            </Link>
            <Link to="/courses" className="hover:text-cyan-600 transition">
              Courses
            </Link>
            <Link to="/quiz" className="hover:text-cyan-600 transition">
              Quiz
            </Link>
            <Link to="/learning-path" className="hover:text-cyan-600 transition">
              Learning Path
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">{user?.name || "Guest"}</div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
