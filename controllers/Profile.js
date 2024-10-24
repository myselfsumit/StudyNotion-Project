const User = require("../models/User");
const Profile = require("../models/Profile");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Method for updating a profile
exports.updateProfile = async (req, res) => {
	try {
		const { dateOfBirth = "", about = "", contactNumber } = req.body;
		const id = req.user.id;

		// Find the profile by id
		const userDetails = await User.findById(id);
		const profile = await Profile.findById(userDetails.additionalDetails);

		// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;

		// Save the updated profile
		await profile.save();

		return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

//Delete Accounts
exports.deleteAccounts = async (req, res) => {
  try {
    //Account delete krne ke lie user ki id le aao
    const id = req.user.id;

    //Validation kar lo yrr
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Is id ke correspond ek profile par padi hai phele delete kar lo
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    //HW:---Enrolled Accounts me se bhi is user ke details ko delete krna chahte hain

    //user delete kar do
    await User.findByIdAndDelete({ _id: id });

    //response return kar do
    return res.status(200).json({
      success: true,
      message: "Successfully Accounts Deleted",
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "User cannot be deleted successfully",
    });
  }
};

//HW:--How to schedule the req to delay like 5 din baad humara code executes ho Or We can say How to task scheduling perform the logic and also we say the job scheduling
//What is a Crone Job

//Get All User Details
const getAllUserDetails = async (req, res) => {
  try {
    //get the user id
    const id = req.user.id;

    //validation
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    //return response
    return res.status(200).json({
      success: false,
      message: "User data fetched successfully",
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec()
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
};



