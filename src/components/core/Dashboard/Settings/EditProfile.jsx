import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CountryCode from "../../../../data/countrycode.json";

export default function ProfileInformation() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  const [selectedGender, setSelectedGender] = useState("");

  const handleGenderChange = (value) => {
    setSelectedGender(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5 mt-8"
    >
      {/* Profile Information Section */}
      <div className="rounded-lg ">
        <h2 className="text-lg font-semibold text-richblack-25 mb-4">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm text-richblack-100 mb-2"
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              placeholder="Enter display name"
              className="w-full p-3 rounded-md bg-richblack-700 text-richblack-25 placeholder-richblack-400 border-b-2 border-richblack-600 focus:ring focus:ring-blue-500 focus:outline-none"
              {...register("displayName", {
                required: "Display name is required",
              })}
            />
            {errors.displayName && (
              <p className="text-red-500 text-sm mt-1">
                Please enter your display name
              </p>
            )}
          </div>

          <div className="relative">
            {/* Profession Label */}
            <label
              htmlFor="profession"
              className="block text-sm text-richblack-100 mb-2"
            >
              Profession
            </label>

            {/* Profession Dropdown */}
            <select
              id="profession"
              className="w-full p-3 rounded-lg bg-richblack-700 text-richblack-25 placeholder-richblack-400 border-b-2 border-richblack-600 focus:border-blue-400 focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300 ease-in-out"
              {...register("profession", { required: true })}
            >
              <option value="" disabled hidden className="text-richblack-400">
                Select your profession
              </option>
              <option value="Developer" className="text-richblack-100">
                👨‍💻 Developer
              </option>
              <option value="Designer" className="text-richblack-100">
                🎨 Designer
              </option>
              <option value="Manager" className="text-richblack-100">
                📋 Manager
              </option>
            </select>

            {/* Error Message */}
            {errors.profession && (
              <p className="mt-2 text-sm text-red-500 animate-pulse">
                Profession is required
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              htmlFor="dob"
              className="block text-sm text-richblack-100 mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="w-full p-3 rounded-md bg-richblack-700 text-richblack-25 placeholder-richblack-400 border-b-2 border-richblack-600 focus:ring focus:ring-blue-500 focus:outline-none"
              {...register("dob", { required: "Date of Birth is required" })}
            />
            {errors.dob && (
              <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-richblack-100 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {/* Male */}
              <div
                onClick={() => handleGenderChange("Male")}
                className={`flex items-center gap-2 p-3 rounded-md border-2 cursor-pointer ${
                  selectedGender === "Male"
                    ? "bg-yellow-300 text-richblack-900 border-yellow-400"
                    : "bg-richblack-700 text-richblack-100 border-richblack-50 hover:border-yellow-300"
                }`}
              >
                <input
                  type="radio"
                  value="Male"
                  id="male"
                  {...register("gender", { required: true })}
                  className="hidden"
                  onChange={() => handleGenderChange("Male")}
                />
                <span className="font-medium">Male</span>
              </div>

              {/* Female */}
              <div
                onClick={() => handleGenderChange("Female")}
                className={`flex items-center gap-2 p-3 rounded-md border-2 cursor-pointer ${
                  selectedGender === "Female"
                    ? "bg-pink-300 text-richblack-900 border-pink-400"
                    : "bg-richblack-700 text-richblack-100 border-richblack-50 hover:border-pink-300"
                }`}
              >
                <input
                  type="radio"
                  value="Female"
                  id="female"
                  {...register("gender", { required: true })}
                  className="hidden"
                  onChange={() => handleGenderChange("Female")}
                />
                <span className="font-medium">Female</span>
              </div>

              {/* Other */}
              <div
                onClick={() => handleGenderChange("Other")}
                className={`flex items-center gap-2 p-3 rounded-md border-2 cursor-pointer ${
                  selectedGender === "Other"
                    ? "bg-blue-300 text-richblack-900 border-blue-400"
                    : "bg-richblack-700 text-richblack-100 border-richblack-50 hover:border-blue-300"
                }`}
              >
                <input
                  type="radio"
                  value="Other"
                  id="other"
                  {...register("gender", { required: true })}
                  className="hidden"
                  onChange={() => handleGenderChange("Other")}
                />
                <span className="font-medium">Other</span>
              </div>
            </div>

            {/* Validation Error */}
            {errors.gender && (
              <p className="text-red-500 text-sm mt-2">Gender is required</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label htmlFor="phonenumber" className="mb-2 text-richblack-100">
              Phone Number
            </label>
            <div className="flex gap-3">
              <select
                name="countrycode"
                id="dropdown"
                className="p-3 rounded-md bg-richblack-700 text-richblack-25 w-24 text-center placeholder-richblack-400 border-b-2 border-richblack-600 focus:ring focus:ring-blue-500 focus:outline-none"
                {...register("countrycode", { required: true })}
              >
                {CountryCode.map((element, index) => (
                  <option key={index} value={element.code}>
                    {element.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="phonenumber"
                id="phonenumber"
                placeholder="12345 67890"
                className="flex-1 p-3 rounded bg-richblack-700 text-richblack-5 placeholder-richblack-400 border-b-2 border-richblack-600 focus:ring focus:ring-blue-500 focus:outline-none"
                {...register("phoneNo", {
                  required: "Please enter your phone number",
                  maxLength: 10,
                  minLength: 8,
                })}
              />
            </div>
            {errors.phoneNo && (
              <span className="text-red-500 text-sm">
                {errors.phoneNo.message}
              </span>
            )}
          </div>

          {/* About */}
          <div className="col-span-1">
            <label
              htmlFor="about"
              className="block text-sm text-richblack-100 mb-2"
            >
              About
            </label>
            <input
              type="text"
              id="about"
              placeholder="Enter Bio Details"
              className="w-full p-3 rounded-md bg-richblack-700 text-richblack-25 placeholder-richblack-400 border-b-2 border-richblack-600 focus:ring focus:ring-blue-500 focus:outline-none"
              {...register("about", { required: "About is required" })}
            />
            {errors.about && (
              <p className="text-red-500 text-sm mt-1">
                {errors.about.message}
              </p>
            )}
          </div>
          
        </div>
      </div>
    </form>
  );
}
