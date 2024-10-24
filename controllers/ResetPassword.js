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
    const token = crypto.randomBytes(20).toString("hex");

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
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: resetPasswordExpires,
      },
      { new: true }
    );

    console.log("DETAILS", updatedDetails);

    // Create the password reset URL
    const url = `http://localhost:3000/update-password/${token}`;

    // Send the reset password link via email
    await mailSender(
			email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`
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
		const { password, confirmPassword, token } = req.body;

		if (confirmPassword !== password) {
			return res.json({
				success: false,
				message: "Password and Confirm Password Does not Match",
			});
		}
		const userDetails = await User.findOne({ token: token });
		if (!userDetails) {
			return res.json({
				success: false,
				message: "Token is Invalid",
			});
		}
		if (!(userDetails.resetPasswordExpires > Date.now())) {
			return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
			});
		}
		const encryptedPassword = await bcrypt.hash(password, 10);
		await User.findOneAndUpdate(
			{ token: token },
			{ password: encryptedPassword },
			{ new: true }
		);
		res.json({
			success: true,
			message: `Password Reset Successful`,
		});
	} catch (error) {
		return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
	}
};