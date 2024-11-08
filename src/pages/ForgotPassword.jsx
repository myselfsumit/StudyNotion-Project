import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";
import toast from "react-hot-toast";
import { HiOutlineArrowLeft } from "react-icons/hi";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getPasswordResetToken(email, setEmailSent));
  };

  return (
    <div className="text-white mx-auto relative mt-[10%] flex items-center justify-center">
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="mx-auto flex flex-col w-11/12 max-w-md p-6 rounded-lg shadow-lg">
          <h1 className="text-[1.5rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!emailSent ? "Reset your password" : "Check your email"}
          </h1>

          <p className="mt-4 text-[1.06rem] leading-[1.625rem] text-richblack-100 font-inter">
            {!emailSent
              ? `Have no fear. We’ll email you instructions to reset your password. If you dont have access to your email we can try account recovery`
              : `We have sent the reset email to ${email}`}
          </p>

          <form onSubmit={handleOnSubmit} className="w-full mt-5">
            {!emailSent && (
              <label htmlFor="email" className="block w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  className="w-full px-4 py-2 text-richblack-5 bg-richblack-800 rounded-[0.5rem] mb-4"
                />
              </label>
            )}

            <button
              type="submit"
              className="mt-5 w-full bg-yellow-100 text-richblack-900 py-2 px-4 rounded-md hover:bg-yellow-50 transition duration-300 cursor-pointer"
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>

          <div className="mt-4">
            <Link
              to="/login"
              className="text-richblack-5 hover:text-richblack-10 transition duration-300 gap-1 flex flex-row items-center justify-start self-baseline text-sm"
            >
            <HiOutlineArrowLeft/>
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
