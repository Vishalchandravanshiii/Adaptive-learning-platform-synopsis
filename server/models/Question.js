const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length >= 2, "At least two options are required"],
    },
    correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
