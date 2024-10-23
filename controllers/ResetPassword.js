const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    // Fetch the email from req body
    const { email } = req.body;

    // Validate if the user is registered
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered, please try again",
      });
    }

    // Generate a secure token
    const token = crypto.randomUUID();

    // Set token expiry (1 hour from now)
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    //2nd Approach and this is optimal approach to write the expire time
    //Step 1 :- Install dayjs
    //Step 2 :- 
    //const dayjs = require("dayjs");
    //const resetPasswordExpires = dayjs().add(1, "hour").valueOf()
    //---->>>>> About the code <<<<------
    // dayjs() creates a new date object for the current time.
    // .add(1, 'hour') adds 1 hour to the current time.
    // .valueOf() returns the timestamp in milliseconds.

    // Update the user with the reset token and expiry time
    //Yaha user ke adar token aur resetPsdExp daal rhe hai kyuki hume baad me paasword ko update krne ke lie user ki koi details honi chahie that's why we do this
    await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: resetPasswordExpires,
      }
    );

    // Create the password reset URL
    const url = `http://localhost:3000/update-password/${token}`;

    // Send the reset password link via email
    await mailSender(
      email,
      "Password Reset Link",
      `Click on the link to reset your password: ${url}`
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully, please check your inbox to reset the password",
    });
  } catch (err) {
    console.error("Error in resetPasswordToken: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    // Fetch the data from the request body
    const { password, confirmPassword, token } = req.body;

    // Validate if both passwords match
    if (password !== confirmPassword) {
      return res.status(422).json({
        success: false,
        message: "Password and Confirm Password do not match, please try again",
      });
    }

    // Find the user by the token
    const user = await User.findOne({ token: token });

    // Check if the token is valid
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token. Please try again.",
      });
    }

    // Check if the token is expired
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(410).json({
        success: false,
        message: "Token has expired. Please request a new password reset.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    user.token = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the token expiry time
    await user.save();

    // Send a confirmation email
    await mailSender(
      user.email,
      "Password Successfully Changed",
      "Your password has been successfully changed."
    );

    // Return a success response
    return res.status(200).json({
      success: true,
      message: "Password has been successfully changed",
    });
  } catch (err) {
    console.error("Error in resetPassword: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
