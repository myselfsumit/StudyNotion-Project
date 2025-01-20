const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true }, // Ensure course name is required
    courseDescription: { type: String, required: true }, // Ensure course description is required
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // Assuming instructors are a type of user
    },
    whatYouWillLearn: { type: String },
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
      },
    ],
    price: {
      type: Number,
      default: 0, // Default price is free
    },
    thumbnail: { type: String },
    tag: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one tag is required.",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Ensures every course has a category
      ref: "Category",
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Referencing the user model
      },
    ],
    instructions: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft", // Default status is Draft
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);
