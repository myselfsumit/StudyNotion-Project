import React from "react";
import HighlightText from "../components/core/HomePage/HighlightText";
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/AboutPage/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import StatsComponent from "../components/core/AboutPage/Stats";
import LearningGrid from "../components/core/AboutPage/LearningGrid";
import ContactFormSection from "../components/core/AboutPage/ContactFormSection";
import Footer from "../components/common/Footer";

const About = () => {
  return (
    <div className="text-white">
      {/* section 1 */}
      <section className="bg-richblack-800">
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
          <header className="text-center text-3xl font-semibold mt-28">
            Driving Innovation in Online Education for a
            <br />
            <HighlightText text={"Brighter Future"} />
            <p className="mt-3 w-[50%] lg:text-[14px] mx-auto text-richblack-300 leading-5 mb-6">
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="flex gap-x-3 mx-auto translate-y-11">
            <img src={BannerImage1} className="rounded-lg shadow-lg" />
            <img src={BannerImage2} className="rounded-lg shadow-lg" />
            <img src={BannerImage3} className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="border-b border-richblack-700 py-24">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent items-center justify-center">
          <Quote />
        </div>
      </section>

      {/* section 3 */}
      <section className="bg-richblack-900 py-16">
        <div className="w-11/12 max-w-screen-xl mx-auto flex flex-col gap-y-20 text-white">
          {/* Founding Story Section */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Founding Story Left Box */}
            <div className="md:w-1/2 space-y-4">
              <h1
                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(117.95deg, #833AB4 -2.4%, #FD1D1D 52.25%, #FCB045 106.89%)",
                }}
              >
                Our Founding Story
              </h1>
              <p className="text-richblack-300 text-lg md:text-base leading-7">
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className="text-richblack-300 text-lg md:text-base leading-7">
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>
            {/* Founding Story Right Box */}
            <div className="relative md:w-1/2">
              {/* Background Gradient */}

              {/* Image */}
              <img
                src={FoundingStory}
                alt="Founding Story"
                className="relative rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Vision and Mission Section */}
          <div className="flex flex-col md:flex-row justify-between gap-10">
            {/* Vision Box */}
            <div className="md:w-1/2 space-y-4">
              <h1
                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(118.41deg, #E65C00 -6.05%, #F9D423 106.11%)",
                }}
              >
                Our Vision
              </h1>
              <p className="text-richblack-300 text-lg md:text-base leading-7">
                With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.
              </p>
            </div>
            {/* Mission Box */}
            <div className="md:w-1/2 space-y-4">
              <h1
                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(118.19deg, #1FA2FF -3.62%, #12D8FA 50.44%, #A6FFCB 104.51%)",
                }}
              >
                Our Mission
              </h1>
              <p className="text-richblack-300 text-lg md:text-base leading-7">
                Our mission goes beyond just delivering courses online. We
                wanted to create a vibrant community of learners, where
                individuals can connect, collaborate, and learn from one
                another. We believe that knowledge thrives in an environment of
                sharing and dialogue, and we foster this spirit of collaboration
                through forums, live sessions, and networking opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* section 4 */}
      <StatsComponent />

      {/* section 5 */}
      <section className="mx-auto mt-16 w-11/12 max-w-maxContent flex flex-col justify-center items-center bg-richblack-900">
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section className="mx-auto mt-16 w-11/12 max-w-maxContent flex flex-col justify-center items-center bg-richblack-900">
        <div className="text-3xl mb-24">
          Reviews from other learners
          {/* <ReviewSlider /> */}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
