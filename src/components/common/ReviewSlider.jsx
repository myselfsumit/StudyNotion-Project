import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // React Slick for carousel
import ReactStars from "react-rating-stars-component"; // Rating stars
import { apiConnector } from "../../services/apiconnector"; // API connector for requests
import { ratingsEndpoints } from "../../services/apis"; // API endpoints

function ReviewSlider() {
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const truncateWords = 15; // Limit words in review text

  // Fetch reviews from the API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) {
          setReviews(data?.data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-richblack-900 py-12 w-full">
      <h2 className="text-3xl font-bold text-center text-white mb-10">
        What Our Learners Say
      </h2>
      <div className="max-w-6xl mx-auto">
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-richblack-800 text-white rounded-lg shadow-lg p-6 mx-3 grid grid-rows-[auto_1fr_auto] gap-4 mb-5 mt-5"
            >
              {/* User Info */}
              <div className="grid grid-cols-[auto_1fr] gap-4">
                <img
                  src={
                    review?.user?.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt="User"
                  className="w-14 h-14 rounded-full border-2 border-richblack-500"
                />
                <div>
                  <h3 className="text-lg font-semibold">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h3>
                  <p className="text-sm text-richblack-300">
                    {review?.user?.email}
                  </p>
                </div>
              </div>

              {/* Review Content */}
              <p className="text-sm text-richblack-200 leading-relaxed">
                {review?.review.split(" ").length > truncateWords
                  ? `${review?.review
                      .split(" ")
                      .slice(0, truncateWords)
                      .join(" ")}...`
                  : review?.review}
              </p>

              {/* Rating */}
              <div className="grid grid-cols-[auto_auto] justify-between items-center">
                <span className="text-yellow-400 text-lg font-bold">
                  {review.rating.toFixed(1)}
                </span>
                <ReactStars
                  count={5}
                  value={review.rating}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ReviewSlider;
