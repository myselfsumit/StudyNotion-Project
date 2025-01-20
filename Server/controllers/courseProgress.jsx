const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Validate the subsection existence
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find or create the course progress document for the user and course
    let courseProgress = await CourseProgress.findOneAndUpdate(
      { courseID: courseId, userId },
      { $addToSet: { completedVideos: subsectionId } },
      { new: true, upsert: true }
    )

    // If no course progress exists initially, handle it appropriately
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress does not exist",
      })
    }

    // If subsection was already completed, send a response
    if (courseProgress.completedVideos.includes(subsectionId)) {
      return res.status(400).json({ error: "Subsection already completed" })
    }

    // Save course progress after the update (in this case, done automatically)
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
