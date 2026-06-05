const express = require("express");
const authMiddleware = require("../middleware/auth");
const permit = require("../middleware/role");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

const router = express.Router();

const seedQuestions = async () => {
  const count = await Question.countDocuments();
  if (count > 0) return;
  const questions = [
    {
      question: "What is the primary purpose of React?",
      options: ["Server-side rendering", "State management", "Building user interfaces", "Database queries"],
      correctAnswer: "Building user interfaces",
      difficulty: "Beginner",
      category: "React",
    },
    {
      question: "Which HTTP method is typically used to update a resource?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: "PUT",
      difficulty: "Beginner",
      category: "Backend",
    },
    {
      question: "In MongoDB, which operation is used to add a document?",
      options: ["insertOne", "updateOne", "deleteOne", "findOne"],
      correctAnswer: "insertOne",
      difficulty: "Beginner",
      category: "Database",
    },
    {
      question: "What does JWT stand for?",
      options: ["JSON Web Token", "Java Web Token", "Joint Web Token", "JavaScript Web Token"],
      correctAnswer: "JSON Web Token",
      difficulty: "Beginner",
      category: "Auth",
    },
    {
      question: "Which hook is used for state in React?",
      options: ["useEffect", "useState", "useMemo", "useContext"],
      correctAnswer: "useState",
      difficulty: "Intermediate",
      category: "React",
    },
    {
      question: "What does REST stand for?",
      options: ["Representational State Transfer", "Rapid State Transfer", "Remote Server Transfer", "Resource Service Transfer"],
      correctAnswer: "Representational State Transfer",
      difficulty: "Intermediate",
      category: "API",
    },
    {
      question: "Which MongoDB feature allows you to reference documents across collections?",
      options: ["Aggregation", "Population", "Indexing", "Sharding"],
      correctAnswer: "Population",
      difficulty: "Intermediate",
      category: "Database",
    },
    {
      question: "Which HTTP status code indicates a successful request?",
      options: ["404", "500", "200", "301"],
      correctAnswer: "200",
      difficulty: "Beginner",
      category: "HTTP",
    },
    {
      question: "What is the main benefit of using middleware in Express?",
      options: ["Faster rendering", "Reusable request handling", "Automatic database setup", "Improved CSS styling"],
      correctAnswer: "Reusable request handling",
      difficulty: "Intermediate",
      category: "Backend",
    },
    {
      question: "In React, which lifecycle hook is analogous to componentDidMount?",
      options: ["useMemo", "useEffect", "useState", "useCallback"],
      correctAnswer: "useEffect",
      difficulty: "Intermediate",
      category: "React",
    },
    {
      question: "Which SQL command retrieves all columns from a table?",
      options: ["SELECT * FROM table", "GET * FROM table", "QUERY * FROM table", "FETCH * FROM table"],
      correctAnswer: "SELECT * FROM table",
      difficulty: "Advanced",
      category: "Database",
    },
    {
      question: "What does CORS stand for?",
      options: ["Cross-Origin Resource Sharing", "Cross-Organization Resource Sharing", "Client-Origin Resource Sharing", "Cross Object Resource Sharing"],
      correctAnswer: "Cross-Origin Resource Sharing",
      difficulty: "Advanced",
      category: "Security",
    },
  ];

  await Question.insertMany(questions);
};

router.use(authMiddleware);

router.get("/questions", async (req, res) => {
  const level = req.query.level || "Beginner";

  try {
    await seedQuestions();
    const questions = await Question.aggregate([
      { $match: { difficulty: level } },
      { $sample: { size: 5 } },
      { $project: { question: 1, options: 1, difficulty: 1, category: 1 } },
    ]);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load quiz questions" });
  }
});

router.post("/submit", async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: "Answers are required" });
  }

  try {
    const questionIds = answers.map((answer) => answer.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const results = questions.map((question) => {
      const answer = answers.find((item) => item.questionId === question._id.toString());
      const selectedOption = answer?.selectedOption || "";
      const isCorrect = selectedOption === question.correctAnswer;
      return {
        question: question._id,
        selectedOption,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const correctCount = results.filter((item) => item.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const difficulty = req.body.difficulty || "Beginner";

    const nextDifficulty = score >= 80 ? (difficulty === "Beginner" ? "Intermediate" : difficulty === "Intermediate" ? "Advanced" : "Advanced") : difficulty === "Advanced" ? "Intermediate" : difficulty;

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      difficulty,
      totalQuestions,
      score,
      answers: results,
    });

    res.json({
      score,
      totalQuestions,
      correctCount,
      nextDifficulty,
      attemptId: attempt._id,
      results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to submit quiz" });
  }
});

router.get("/history", permit("student"), async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("answers.question", "question difficulty category");
    res.json(attempts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load quiz history" });
  }
});

router.post("/questions", permit("instructor", "admin"), async (req, res) => {
  const { question, options, correctAnswer, difficulty, category } = req.body;
  if (!question || !options || !correctAnswer) {
    return res.status(400).json({ message: "Question, options and correct answer are required" });
  }

  try {
    const newQuestion = await Question.create({ question, options, correctAnswer, difficulty, category });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create quiz question" });
  }
});

module.exports = router;
