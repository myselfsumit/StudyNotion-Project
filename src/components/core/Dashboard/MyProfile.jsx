import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div className="text-richblack-50">
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

      {/* Section 1: Profile */}
      <div className="flex justify-between items-center gap-x-4 mb-8 bg-richblack-800 border-richblack-700 py-9 px-6 rounded-lg ">
        <div className="flex justify-center items-center gap-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="w-[78px] h-[78px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-x-3">
            <p className="text-lg font-semibold">{`${user?.firstName} ${user?.lastName}`}</p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn text="Edit" onclick={() => navigate("/dashboard/settings")} />
      </div>

      {/* Section 2: About */}
      <div className="flex justify-between items-center gap-x-4 mb-8 bg-richblack-800 border-richblack-700 py-9 px-6 rounded-lg ">
        <div className="flex flex-col justify-center items-start mb-2">
          <p className="text-lg font-semibold">About</p>
          <p className="text-sm text-richblack-300">
            {user?.additionalDetails?.about ??
              "Write something about yourself."}
          </p>
        </div>

        <div>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          />
        </div>
      </div>

      {/* Section 3: Personal Details */}
      <div className="flex flex-col gap-6 bg-richblack-800 border border-richblack-700 p-6 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-4 text-sm text-richblack-300">
          <div>
            <p className="font-semibold text-richblack-5">First Name</p>
            <p>{user?.firstName || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-richblack-5">Last Name</p>
            <p>{user?.lastName || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-richblack-5">Email</p>
            <p>{user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold text-richblack-5">Phone Number</p>
            <p>
              {user?.additionalDetails?.contactNumber || "Add Contact Number"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
