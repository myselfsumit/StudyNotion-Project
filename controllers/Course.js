const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { cloudinaryUpload } = require("../utils/cloudinaryUploader");

//Create Course API
exports.createCourse = async (req, res) => {
  try {
    //Fetch the data from req body
    const { courseName, courseDescription, whatYouWillLearn, price, tag } =
      req.body;
    //Fetch files from req files
    const thumbnail = req.files.thumbnail;

    //Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Instructor Validation or Check for Instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details:", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found, Please try again",
      });
    }

    //check given tag is valid or not
    const categoryDetails = await Category.findById(tag);

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    //Upload image to cloudinary
    const thumbnailImage = await cloudinaryUpload(
      thumbnail,
      process.env.FOLDER_NAME
    ).catch((error) => {
      return res.status(500).json({
        success: false,
        message: "Image upload failed, please try again",
      });
    });

    //create entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructorDetails: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tags: categoryDetails._id,
    });

    //add the new course entry in user schema
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //Update the Tag Schema
    await Category.findByIdAndUpdate(
      {
        _id: categoryDetails._id,
      },
      {
        $push: {
          course: newCourse._id,
        },
      }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Course Created Successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while course created",
      error: err.message,
    });
  }
};

//Get All Course API
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentEnrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course data",
      error: err.message,
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    //get the course id
    const courseId = req.body;
    //find the course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndreviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    //validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ${courseId}`,
      });
    }

    //return response
    return res.status(200).json({
      success: true,
      message: "Course Details Fetched Successfully",
      data: courseDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
