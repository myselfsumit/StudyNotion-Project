import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CountryCode from "../../data/countrycode.json";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging Data", data);
    try {
      setLoading(true);
      const response = { status: "OK" };
      console.log("Logging response", response);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstName: "",
        lastName: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form onSubmit={handleSubmit(submitContactForm)} className="w-full">
      <div className="space-y-4">
        <div className="flex gap-5">
          <div className="flex flex-col w-1/2">
            <label htmlFor="firstname" className="mb-2 text-richblack-100">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              placeholder="Enter first name"
              className="p-3 rounded-md bg-richblack-800 text-richblack-5 placeholder-richblack-400 border-b-2 border-richblack-600"
              {...register("firstname", { required: true })}
            />
            {errors.firstname && (
              <span className="text-red-500 text-sm">
                Please enter your first name
              </span>
            )}
          </div>

          <div className="flex flex-col w-1/2">
            <label htmlFor="lastname" className="mb-2 text-richblack-100">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              placeholder="Enter last name"
              className="p-3 rounded-md bg-richblack-800 text-richblack-5 placeholder-richblack-400 border-b-2 border-richblack-600"
              {...register("lastname")}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 text-richblack-100">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email address"
            className="p-3 rounded-md bg-richblack-800 text-richblack-5 placeholder-richblack-400 border-b-2 border-richblack-600"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              Please enter your email address
            </span>
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
              className="p-3 rounded-md bg-richblack-800 text-richblack-50 w-24 text-center placeholder-richblack-400 border-b-2 border-richblack-600"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((element, index) => (
                <option key={index} value={element.code} >
                  {element.code}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="phonenumber"
              id="phonenumber"
              placeholder="12345 67890"
              className="flex-1 p-3 rounded bg-richblack-800 text-richblack-50 placeholder-richblack-400 border-b-2 border-richblack-600"
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

        {/* TextArea  */}
        <div className="flex flex-col">
          <label htmlFor="message" className="mb-2 text-richblack-100">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            rows="7"
            placeholder="Enter your message here"
            className="p-3 rounded-md bg-richblack-800 text-richblack-5 placeholder-richblack-400 border-b-2 border-richblack-600"
            {...register("message", { required: true })}
          />
          {errors.message && (
            <span className="text-red-500 text-sm">
              Please enter your message
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-3 mt-5 bg-yellow-100 text-black font-semibold rounded hover:bg-yellow-200 transition duration-200"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
