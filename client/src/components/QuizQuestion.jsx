export default function QuizQuestion({ question, selectedAnswer, onSelect, disabled }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900">{question.question}</h3>
      <p className="mt-2 text-sm text-slate-500">Category: {question.category} • Difficulty: {question.difficulty}</p>
      <div className="mt-4 space-y-3">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(question._id, option)}
            disabled={disabled}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
              selectedAnswer === option
                ? "border-cyan-600 bg-cyan-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-700 hover:border-cyan-500"
            } ${disabled ? "cursor-not-allowed opacity-70" : "hover:bg-slate-50"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
