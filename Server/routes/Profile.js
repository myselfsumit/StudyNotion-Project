const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth"); // Added isInstructor
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard, // Added instructorDashboard
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);
// Update User Profile
router.put("/updateProfile", auth, updateProfile);
// Get User Details
router.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
// Update User Display Picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
// Instructor Dashboard (Accessible by instructors only)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
