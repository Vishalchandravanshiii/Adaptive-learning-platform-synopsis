import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import CourseCard from "../components/CourseCard";
import toast from "react-hot-toast";
import { BiX, BiRightArrow } from "react-icons/bi";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data } = await API.get("/courses");
      setCourses(data);
    } catch (error) {
      toast.error("Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  const enroll = async (courseId) => {
    try {
      await API.post("/courses/enroll", { courseId });
      toast.success("Enrolled successfully!");
      setSelectedCourse(null);
    } catch (error) {
      const message = error?.response?.data?.message || "Enrollment failed.";
      toast.error(message);
    }
  };

  const categories = ["All", ...new Set(courses.map((c) => c.category))];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = courses.filter((course) => {
    const categoryMatch = filterCategory === "All" || course.category === filterCategory;
    const difficultyMatch = filterDifficulty === "All" || course.difficulty === filterDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h1 className="text-4xl font-bold text-slate-900">Explore Courses</h1>
            <p className="mt-3 text-slate-600">Discover and enroll in adaptive learning courses tailored to your needs.</p>
          </div>

          {/* Filters */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">Showing {filteredCourses.length} courses</p>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg text-slate-600 text-center py-16">
              <p className="text-lg">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg text-slate-600 text-center py-16">
              <p className="text-lg">No courses match your filters. Try adjusting them.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => setSelectedCourse(course)}
                  className="cursor-pointer transition transform hover:scale-105"
                >
                  <CourseCard
                    title={course.title}
                    description={course.description}
                    category={course.category}
                    difficulty={course.difficulty}
                    duration={course.duration}
                    durationUnit={course.durationUnit}
                    rating={course.rating}
                    enrollmentCount={course.enrollmentCount}
                    learningOutcomes={course.learningOutcomes}
                    featured={course.featured}
                    onEnroll={() => enroll(course._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-6 flex justify-between items-start text-white">
              <div>
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <p className="mt-2 opacity-90">{selectedCourse.category}</p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              >
                <BiX size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Course Meta */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Difficulty</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedCourse.difficulty}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Duration</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedCourse.duration} {selectedCourse.durationUnit}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600">Students</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedCourse.enrollmentCount}+</p>
                </div>
              </div>

              {/* Description */}
              {selectedCourse.description && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Overview</h3>
                  <p className="text-slate-700">{selectedCourse.description}</p>
                </div>
              )}

              {/* Learning Outcomes */}
              {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">What You'll Learn</h3>
                  <ul className="space-y-2">
                    {selectedCourse.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <BiRightArrow className="text-cyan-600 mt-1 flex-shrink-0" />
                        <span className="text-slate-700">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Prerequisites</h3>
                  <ul className="space-y-2">
                    {selectedCourse.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-cyan-600 font-semibold">✓</span>
                        <span className="text-slate-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modules */}
              {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Course Modules</h3>
                  <div className="space-y-2">
                    {selectedCourse.modules.map((module, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                        <p className="font-semibold text-slate-900">{idx + 1}. {module.title}</p>
                        {module.description && <p className="text-sm text-slate-600 mt-1">{module.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enroll Button */}
              <button
                onClick={() => enroll(selectedCourse._id)}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-xl transition"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
