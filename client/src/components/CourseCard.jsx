import { BiTime, BiStar, BiUserPlus } from "react-icons/bi";

export default function CourseCard({
  title,
  description,
  category,
  difficulty,
  duration,
  durationUnit,
  rating,
  enrollmentCount,
  learningOutcomes,
  onEnroll,
  featured,
}) {
  return (
    <div className={`rounded-3xl bg-white shadow-lg flex flex-col justify-between overflow-hidden ${featured ? "ring-2 ring-cyan-500" : ""}`}>
      {featured && (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 text-sm font-semibold">
          Featured Course
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        
        <p className="mt-2 text-slate-600 text-sm line-clamp-2">{description}</p>
        
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700 font-medium">
            {difficulty}
          </span>
          <span className="text-slate-600 text-sm">{category}</span>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <BiTime className="text-cyan-600 text-lg" />
            <span>{duration} {durationUnit}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <BiStar className="text-yellow-500 text-lg" />
            <span>{rating > 0 ? rating.toFixed(1) : "No"} rating</span>
          </div>
          
          <div className="flex items-center gap-2">
            <BiUserPlus className="text-green-600 text-lg" />
            <span>{enrollmentCount} students enrolled</span>
          </div>
        </div>

        {learningOutcomes && learningOutcomes.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-slate-700">What you'll learn:</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {learningOutcomes.slice(0, 2).map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">•</span>
                  <span>{outcome}</span>
                </li>
              ))}
              {learningOutcomes.length > 2 && (
                <li className="text-cyan-600 text-xs">+{learningOutcomes.length - 2} more</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {onEnroll && (
        <button
          onClick={onEnroll}
          className="mx-6 mb-6 w-auto rounded-2xl bg-cyan-600 py-3 px-6 text-white hover:bg-cyan-700 transition font-semibold"
        >
          Enroll Now
        </button>
      )}
    </div>
  );
}
