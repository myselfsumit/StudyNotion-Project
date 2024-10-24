const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const mailSender = require("../utils/mailSender");
const { default: mongoose } = require("mongoose");
const { format } = require("express/lib/response");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//Step1 :- Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  //get courseId and userId
  const userId = req.user.id;
  const {courseId} = req.body;
  //validation
  //valid courseId
  if (!courseId) {
    return res.json({
      success: false,
      message: "Please provide valid course ID",
    });
  }
  //valid courseDetails
  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      return res.json({
        success: false,
        message: "Could not find the course",
      });
    }

    //user already pay for same course
    const uid = new mongoose.Types.ObjectId({ userId });
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already registered",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
  //order create
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      userId,
      courseId,
    },
  };

  try {
    //initite the payment using Razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    //return response
    return res.json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (err) {
    console.log(error);
    res.json({
      success: false,
      message: "Could not initiate order",
    });
  }
};

//Step2 : Verify the Signature
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";

  const signature = req.headers("x-razorpay-signature");

  // convert the webhookSecret in signature format or hashed the webhookSecret
  const shasum = crypto.createHmac("sha256", webhookSecret);
  //hmac object ko string format me convert krne hai
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  //compare both the signature
  if (signature === digest) {
    console.log("Payment is Authorised");

    const { userId, courseId } = req.body.payload.payment.entity.notes;

    try {
      //fullfill the action

      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not Found",
        });
      }
      console.log(enrolledCourse);

      //find the student and add the course to their list enrolled course me
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );

      console.log(enrolledStudent);

      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulation from StudyNotion",
        "Congratulation, you are onboarded into new CodeHelp Course"
      );

      console.log(emailResponse);
      return res.status(200).json({
        success: true,
        message: "Signature Verified and Course Added",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    console.log(err);
    return res.status(400).json({
      success: false,
      message: "Invalid Request",
    });
  }
};
