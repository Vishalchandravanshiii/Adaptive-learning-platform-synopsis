const express = require("express");
const authMiddleware = require("../middleware/auth");
const permit = require("../middleware/role");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const router = express.Router();

router.use(authMiddleware, permit("admin"));

router.get("/overview", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch admin overview" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch users" });
  }
});

router.put("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["student", "instructor", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = role;
    await user.save();
    res.json({ message: "Role updated successfully", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update role" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete user" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch courses" });
  }
});

module.exports = router;
