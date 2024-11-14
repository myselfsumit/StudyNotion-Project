import React from "react";

const Stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponent = () => {
  return (
    <section>
      <div className="bg-richblack-800 py-20">
        <div className="w-11/12 max-w-maxContent mx-auto flex gap-x-5 justify-between items-center">
          {Stats.map((data, index) => {
            return (
              <div key={index} className="flex flex-col justify-center items-center gap-y-2">
                <h1 className="text-richblack-25">{data.count}</h1>
                <h2 className="text-richblack-200">{data.label}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsComponent;
