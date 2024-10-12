const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const cloudinaryUpload = require("../utils/cloudinaryUploader");
require("dotenv").config();

// Create SubSection
const createSubSection = async (req, res) => {
  try {
    // Data fetch from req body
    const { sectionId, title, timeDuration, description } = req.body;
    // Extract file/video
    const video = req.files.videoFile;

    // Validation
    if (!title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload video to Cloudinary
    const uploadDetails = await cloudinaryUpload(
      video,
      process.env.FOLDER_NAME
    );

    // Create a new SubSection
    const subSectionDetails = await SubSection.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the Section by adding the new SubSection ID
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { SubSection: subSectionDetails._id } },
      { new: true }
    ).populate("SubSection"); // Populate SubSection details

    // Log the updated section for debugging
    console.log("Updated Section:", updatedSection);

    // Return response
    return res.status(200).json({
      success: true,
      message: "Sub-Section created successfully",
      updatedSection,
    });
  } catch (err) {
    // Log the error for easier debugging
    console.error("Error in creating sub-section:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Update SubSection
exports.updatedSubSection = async (req, res) => {
  try {
    // Fetch the data from request body
    const { subSectionId, title, timeDuration, description } = req.body;
    // Fetch video file if any
    const video = req.files ? req.files.videoFile : null;

    // Validation
    if (!title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "title, timeDuration, and description are required",
      });
    }

    let videoUrl = null;

    // If video file exists, upload to Cloudinary
    if (video) {
      const uploadDetails = await cloudinaryUpload(
        video,
        process.env.FOLDER_NAME
      );
      videoUrl = uploadDetails.secure_url;
    }

    // Update the SubSection
    const updateData = {
      title,
      timeDuration,
      description,
    };

    // If a new video URL was generated, add it to the update data
    if (videoUrl) {
      updateData.videoUrl = videoUrl;
    }

    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      { $set: updateData }, // Use $set to update fields
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Sub-Section updated successfully",
      updatedSubSection,
    });
  } catch (err) {
    // Log the error for easier debugging
    console.error("Error in updating sub-section:", err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// Delete Sub-Section
exports.deleteSubSection = async (req, res) => {
  try {
    // Data fetching
    const { subSectionId } = req.body;

    // Validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required",
      });
    }

    // Find the section containing this sub-section and remove the sub-section reference
    const section = await Section.findOneAndUpdate(
      { SubSection: subSectionId },
      { $pull: { SubSection: subSectionId } }, // Removes the sub-section reference from the section
      { new: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found for the provided sub-section ID",
      });
    }

    // Delete the sub-section itself
    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-Section not found",
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Sub-Section deleted successfully",
      deletedSubSection,
    });
  } catch (err) {
    console.error("Error in deleting sub-section:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
