import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa6";
import { FaEyeLowVision } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };

  return (
    <div className="text-white mx-auto relative mt-[10%] flex flex-col justify-center items-center">
      {loading ? (
        <div>Loading..</div>
      ) : (
        <div className="mx-auto flex flex-col w-11/12 max-w-md p-6 shadow-lg">
          <h1 className="text-[1.5rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose new password
          </h1>
          <p className="mt-1 text-[1.0rem] text-richblack-100 font-inter">
            Almost done. Enter your new password and you’re all set.
          </p>

          <form onSubmit={handleOnSubmit} className="w-full mt-5">
            <label className="block w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New password <sup className="text-pink-200">*</sup>
              </p>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleOnChange}
                  placeholder="New Password"
                  className="w-full px-4 py-2 text-richblack-5 bg-richblack-800 rounded-[0.5rem] mb-4"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-2 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showPassword ? (
                    <FaEye fontSize={24}  fill="#AFB2BF" />
                  ) : (
                    <FaEyeLowVision fontSize={24}  fill="#AFB2BF" />
                  )}
                </span>
              </div>
            </label>

            <label className="block w-full">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm new password <sup className="text-pink-200">*</sup>
              </p>
              <div className="relative">
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleOnChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 text-richblack-5 bg-richblack-800 rounded-[0.5rem]"
                />
                <span
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? (
                    <FaEye fontSize={24} fill="#AFB2BF"/>
                  ) : (
                    <FaEyeLowVision fontSize={24}  fill="#AFB2BF"/>
                  )}
                </span>
              </div>
            </label>

            <button
              type="submit"
              className="mt-5 w-full bg-yellow-100 text-richblack-900 py-2 px-4 rounded-md hover:bg-yellow-50 transition duration-300 cursor-pointer"
            >
              Reset Password
            </button>
          </form>

          <div className="mt-4">
            <Link
              to="/login"
              className="text-richblack-5 hover:text-richblack-10 transition duration-300 gap-1 flex flex-row items-center justify-start self-baseline text-sm"
            >
              <HiOutlineArrowLeft />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
