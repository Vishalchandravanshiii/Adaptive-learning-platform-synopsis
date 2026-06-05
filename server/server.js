const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const coursesRoutes = require("./routes/courses");
const adminRoutes = require("./routes/admin");
const quizRoutes = require("./routes/quiz");

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Adaptive Learning Platform API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
