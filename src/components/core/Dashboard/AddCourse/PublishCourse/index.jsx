import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import IconBtn from "../../../../common/IconBtn";

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

  const goBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  const handleCoursePublish = async () => {
    try {
      // Get the current value of "public"
      const isPublic = getValues("public");

      // Check if the form has been updated
      const isUnchanged =
        (course?.status === COURSE_STATUS.PUBLISHED && isPublic === true) ||
        (course?.status === COURSE_STATUS.DRAFT && isPublic === false);

      if (isUnchanged) {
        // Form has not been updated, no API call required
        goToCourses();
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("courseId", course._id);
      const courseStatus = isPublic
        ? COURSE_STATUS.PUBLISHED
        : COURSE_STATUS.DRAFT;
      formData.append("status", courseStatus);

      // Log form data for debugging
      console.log("Form Data --- ", formData);

      // Set loading state to true
      setLoading(true);

      // Make API call to update course details
      const result = await editCourseDetails(formData, token);
      console.log("Result Data --- ", result);

      if (result) {
        goToCourses();
      }
    } catch (error) {
      console.error("Error in handleCoursePublish:", error);
      alert("Failed to update course details. Please try again.");
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    console.log("OnSubmit Data -- ", data);
    handleCoursePublish();
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  );
}
