const User = require("../models/User");
const Profile = require("../models/Profile");

//update the profile
exports.updateProfile = async (req, res) => {
  try {
    //Fetching the data
    const { gender, dateOfBirth = "", contactNumber, about = "" } = req.body;

    //get user id
    const id = req.user.id;
    //Validation
    if (!gender || !contactNumber || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //Contact Number is valid only 10 digits
    if (contactNumber.length !== 10 || !/^\d{10}$/.test(contactNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Contact Number",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById({ profileId });

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;
    profileDetails.about = about;
    await profileDetails.save();

    //return the response
    return res.status(200).json({
      success: true,
      message: "Successfully created profile",
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Something fetching error while creating Profile",
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



