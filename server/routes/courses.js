const express = require("express");
const authMiddleware = require("../middleware/auth");
const permit = require("../middleware/role");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const QuizAttempt = require("../models/QuizAttempt");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .select("title description category difficulty duration durationUnit rating enrollmentCount featured learningOutcomes skillLevel instructor");
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch courses" });
  }
});

router.get("/:courseId/details", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate("instructor", "name email");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({
      ...course.toObject(),
      instructorName: course.instructor?.name,
      instructorEmail: course.instructor?.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch course details" });
  }
});

router.post("/", authMiddleware, permit("instructor", "admin"), async (req, res) => {
  const {
    title,
    description,
    overview,
    category,
    difficulty,
    duration,
    durationUnit,
    learningOutcomes,
    prerequisites,
    skillLevel,
    modules,
    featured,
  } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: "Course title and category are required" });
  }

  try {
    const course = await Course.create({
      title,
      description,
      overview,
      category,
      difficulty,
      duration,
      durationUnit,
      learningOutcomes: learningOutcomes || [],
      prerequisites: prerequisites || [],
      skillLevel: skillLevel || [],
      modules: modules || [],
      featured: featured || false,
      instructor: req.user._id,
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create course" });
  }
});

router.post("/enroll", authMiddleware, permit("student"), async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required to enroll" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({ student: req.user._id, course: courseId });
    if (existing) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Enrollment failed" });
  }
});

router.get("/student/analytics", authMiddleware, permit("student"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate("course", "title category difficulty");
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((item) => item.completed).length;
    const averageScore = enrollments.length
      ? Math.round(enrollments.reduce((sum, item) => sum + item.score, 0) / enrollments.length)
      : 0;
    const recentCourses = enrollments.slice(0, 3).map((item) => ({
      id: item._id,
      title: item.course.title,
      category: item.course.category,
      difficulty: item.course.difficulty,
      progress: item.progress,
      score: item.score,
    }));

    res.json({
      totalCourses,
      completedCourses,
      averageScore,
      recentCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch student analytics" });
  }
});

router.get("/student/recommendation", authMiddleware, permit("student"), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate("course", "_id title category difficulty");
    const completedCourseIds = enrollments.filter((item) => item.completed).map((item) => item.course._id.toString());
    const enrolledCourseIds = enrollments.map((item) => item.course._id.toString());

    const quizAttempts = await QuizAttempt.find({ student: req.user._id }).populate("answers.question", "category difficulty");
    const categoryStats = {};

    quizAttempts.forEach((attempt) => {
      attempt.answers.forEach((answer) => {
        const category = answer.question?.category || "General";
        if (!categoryStats[category]) {
          categoryStats[category] = { correct: 0, total: 0 };
        }
        categoryStats[category].total += 1;
        if (answer.isCorrect) {
          categoryStats[category].correct += 1;
        }
      });
    });

    const categoryScores = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      score: Math.round((stats.correct / stats.total) * 100),
    }));

    const lowCategories = categoryScores
      .filter((item) => item.score < 75)
      .sort((a, b) => a.score - b.score)
      .map((item) => item.category);

    const highCategories = categoryScores
      .filter((item) => item.score >= 75)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.category);

    const allCourses = await Course.find();
    const candidates = allCourses.filter((course) => !enrolledCourseIds.includes(course._id.toString()));

    const recommended = [];
    const addCourse = (course, reason) => {
      if (!course) return;
      if (recommended.some((item) => item.courseId === course._id.toString())) return;
      recommended.push({
        courseId: course._id,
        title: course.title,
        category: course.category,
        difficulty: course.difficulty,
        reason,
        type: "Recommended",
      });
    };

    lowCategories.forEach((category) => {
      const match = candidates.find((course) => course.category === category && course.difficulty === "Beginner");
      if (match) {
        addCourse(match, `Improve your ${category} mastery`);
      }
    });

    if (recommended.length < 3) {
      lowCategories.forEach((category) => {
        if (recommended.length >= 3) return;
        const match = candidates.find((course) => course.category === category);
        addCourse(match, `Strengthen ${category} skills`);
      });
    }

    if (recommended.length < 3) {
      highCategories.forEach((category) => {
        if (recommended.length >= 3) return;
        const match = candidates.find((course) => course.category === category && course.difficulty === "Advanced");
        addCourse(match, `Advance your ${category} expertise`);
      });
    }

    if (recommended.length < 3) {
      candidates
        .sort((a, b) => {
          const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        })
        .slice(0, 3 - recommended.length)
        .forEach((course) => addCourse(course, "Explore a recommended course"));
    }

    if (recommended.length === 0) {
      const fallback = [
        { title: "JavaScript Essentials", type: "Recommended", reason: "Start with core programming skills" },
        { title: "React Component Patterns", type: "Recommended", reason: "Build modern UI skills" },
        { title: "Backend API Design", type: "Recommended", reason: "Learn how backend services work" },
      ];
      return res.json({ path: fallback });
    }

    res.json({ path: recommended });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to compute learning path" });
  }
});

router.get("/instructor/dashboard", authMiddleware, permit("instructor"), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    const courseIds = courses.map((course) => course._id);
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const totalStudents = new Set(enrollments.map((item) => item.student.toString())).size;
    const totalModules = courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0);

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalModules,
      courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch instructor dashboard" });
  }
});

router.get("/instructor/courses", authMiddleware, permit("instructor"), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to load instructor courses" });
  }
});

router.put("/:courseId", authMiddleware, permit("instructor", "admin"), async (req, res) => {
  const { courseId } = req.params;
  const { title, description, category, difficulty } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    course.difficulty = difficulty || course.difficulty;
    await course.save();

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update course" });
  }
});

router.post("/:courseId/modules", authMiddleware, permit("instructor", "admin"), async (req, res) => {
  const { courseId } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Module title is required" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    course.modules.push({ title, description });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to add module" });
  }
});

module.exports = router;
