const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

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
    const tagDetails = await Tag.findById(tag);

    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag details not found",
      });
    }

    //Upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
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
      tags: tagDetails._id,
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
    await Tag.findByIdAndUpdate(
      {
        _id: tagDetails._id,
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
        success : true,
        message : "Data for all courses fetched successfully",
        data : allCourses,
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course data",
      error: err.message,
    });
  }
};
