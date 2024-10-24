const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");

//createRatingAndReview
exports.createRatingAndReview = async (req, res) => {
  try {
    //get userId
    const userId = req.user.id;
    //fetch the data from req body
    const { rating, review, courseId } = req.body;
    //check user enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the course",
      });
    }

    //check if the user already the course
    const alreadyReviewed = await RatingAndReview.findOne({
      _id: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewd by the user",
      });
    }

    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update course with this rating/review
    const udatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReviews: ratingReview._id } },
      { new: true }
    );

    console.log(updatedCourseDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Rating and Review created successfully",
      ratingReview,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    //get courseId
    const courseId = req.body.courseId;

    //calculate average rating
    const result = await RatingAndReview.aggregate(
      {
        $match: {
          course: new mongoose.Types.ObjectId("courseId"),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      }
    );

    //return avg rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // If no rating and review exist
    return res.status(200).json({
      success: true,
      message: "Average rating is 0, no ratings review given till now",
      averageRating: 0,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//get All Rating And Review
exports.getAllRatingAndReview = async (req, res) => {
  try {
    //get the all details
    const allReviews = await RatingAndReview.findById()
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName, lastName, email, image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Successfully fetch all details of rating and review",
      data : allReviews,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
