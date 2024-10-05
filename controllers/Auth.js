const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//Send OTP
exports.sendOTP = async (req, res) => {
  try {
    //Fetch email from req body
    const { email } = req.body;

    // Validate email format using regex
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    //check if user already exist
    const checkUserPresent = await User.find({ email });

    //If user already exist, then return res
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated : ", otp);

    //Ensure OTP is unique
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //Create an DB entry for OTP
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body :", otpBody);

    //Return success response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (err) {
    console.log("Issue fetching during sending OTP time: ", err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

//Signup

exports.signUp = async (req, res) => {
  try {
    //Fetch data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2 Password Match Kra Lo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirmed Password value does not match, Please try again",
      });
    }

    //Check user already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Already registered user, you can login the page",
      });
    }

    //Find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //Validate OTP
    if (recentOtp.length == 0) {
      //OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP Not found",
      });
    } else if (otp !== recentOtp.otp) {
      //OTP Not Match
      return res.status(400).json({
        success: false,
        message: "OTP Not Match or Invalid OTP",
      });
    }

    //Password Hash Kar Lo
    const hashedPassword = await bcrypt.hash(10, password);

    //DB me entry create Kar Lo
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactNumber,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // response return kar do
    return res.status(200).json({
      success: true,
      message: "Successfully User SignUp",
      user,
    });
  } catch (err) {
    console.log("Error Fetch", err);
    return res.status(500).json({
      success: false,
      message: "Something issue while user signing account, please try again",
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    //Fetch data from req body
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    //Ensure user already registered if not registered then return response
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signUp first",
      });
    }

    //Generate JWT, after password matching
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date.now(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User LoggedIn Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is Incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
        success : false,
        message : "Login Failure, please try again",
    });
  }
};

// Change Password Controller
exports.changePassword = async (req, res) => {
  try {
    // Fetch data from req body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validation: Check if all fields are provided
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    // Validation: Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match, please try again",
      });
    }

    // Fetch the user from the database (assume req.user contains the authenticated user's info)
    const user = await User.findById(req.user.id);

    // Check if old password matches the user's current password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect, please try again",
      });
    }

    // Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedNewPassword;
    await user.save();

    // Optionally, send a confirmation email to the user (e.g., via mailSender)
    mailSender(user.email, "Password Changed", "Your password has been successfully updated.");

    // Return response
    return res.status(200).json({
      success: true,
      message: "Password successfully changed",
    });

  } catch (err) {
    console.error("Error while changing password: ", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while changing the password, please try again",
    });
  }
};
