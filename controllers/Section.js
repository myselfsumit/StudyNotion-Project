const Course = require("../models/Course");
const Section = require("../models/Section");

exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    //create section
    const newSection = await Section.create({ sectionName });
    //update course with section ObjectID
    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    //HW : Use populate to replace sections/sub-sections both in the updatedCourseDetails
    //return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section, please try again",
      error: err.message,
    });
  }
};

//Update Section
exports.updateSection = async (req, res) => {
  try {
    //data fetching
    const { sectionName, sectionId } = req.body;

    //data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    //update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Section Updated Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Unable to create section, please try again",
    });
  }
};

//deleted section
exports.deleteSection = async (req, res) => {
  try {
    // Fetch sectionId from params
    const sectionId = req.params.sectionId;

    // Check if section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete section
    await Section.findByIdAndDelete(sectionId);

    // Remove the section reference from Course schema (not delete the course itself)
    await Course.updateMany(
      { courseContent: sectionId },
      { $pull: { courseContent: sectionId } }
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Unable to delete section, please try again",
    });
  }
};
