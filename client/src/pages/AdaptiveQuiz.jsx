import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import QuizQuestion from "../components/QuizQuestion";
import toast from "react-hot-toast";

const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];

export default function AdaptiveQuiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [difficulty, setDifficulty] = useState("Beginner");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/quiz/questions?level=${difficulty}`);
        setQuestions(data);
      } catch (error) {
        toast.error("Unable to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [difficulty]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const answerList = questions.map((question) => ({
      questionId: question._id,
      selectedOption: answers[question._id] || "",
    }));

    if (answerList.some((item) => !item.selectedOption)) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await API.post("/quiz/submit", { answers: answerList, difficulty });
      setResult(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setAnswers({});
    setLoading(true);
    API.get(`/quiz/questions?level=${difficulty}`)
      .then((res) => setQuestions(res.data))
      .catch(() => toast.error("Unable to reload quiz questions."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <section className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Adaptive Quiz</h1>
                <p className="mt-3 text-slate-600">Complete the quiz and receive a personalized recommendation.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">Difficulty:</span>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    setDifficulty(e.target.value);
                    setResult(null);
                    setAnswers({});
                  }}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-cyan-500 focus:outline-none"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {result ? (
            <section className="rounded-3xl bg-white p-8 shadow-lg">
              <h2 className="text-3xl font-semibold text-slate-900">Quiz Result</h2>
              <p className="mt-4 text-slate-600">You scored {result.score}% on {result.totalQuestions} questions.</p>
              <p className="mt-2 text-slate-600">Next recommended difficulty: {result.nextDifficulty}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {result.results.map((item, index) => (
                  <div key={index} className="rounded-3xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500">Question ID: {item.question}</p>
                    <p className="mt-2 text-slate-900">Selected: {item.selectedOption || "None"}</p>
                    <p className="text-sm text-slate-600">Correct: {item.correctAnswer}</p>
                    <p className={`mt-2 font-semibold ${item.isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                      {item.isCorrect ? "Correct" : "Incorrect"}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleTryAgain}
                className="mt-8 rounded-2xl bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700 transition"
              >
                Try another quiz
              </button>
            </section>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {loading ? (
                <div className="rounded-3xl bg-white p-8 shadow-lg text-slate-600">Loading questions...</div>
              ) : (
                questions.map((question) => (
                  <QuizQuestion
                    key={question._id}
                    question={question}
                    selectedAnswer={answers[question._id]}
                    onSelect={handleSelect}
                    disabled={submitting}
                  />
                ))
              )}
              {!loading && questions.length > 0 && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-3xl bg-cyan-600 px-6 py-3 text-white hover:bg-cyan-700 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </button>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
