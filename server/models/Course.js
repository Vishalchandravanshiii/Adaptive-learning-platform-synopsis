const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    overview: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    modules: [
      {
        title: String,
        description: String,
      },
    ],
    duration: {
      type: Number,
      default: 4,
    },
    durationUnit: {
      type: String,
      enum: ["weeks", "months"],
      default: "weeks",
    },
    learningOutcomes: [
      {
        type: String,
      },
    ],
    prerequisites: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    skillLevel: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
