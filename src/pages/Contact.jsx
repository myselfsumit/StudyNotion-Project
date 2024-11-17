import React from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { GiWorld } from "react-icons/gi";
import { PiPhoneCallDuotone } from "react-icons/pi";
import Footer from "../components/common/Footer";
import ContactUsForm from "../components/contactPage/ContactUsForm";

const contactData = [
  {
    icon: <IoIosChatbubbles />,
    firstPara: "Chat on us",
    secondPara: "Our friendly team is here to help.",
    thirdPara: "@mail address",
  },
  {
    icon: <GiWorld />,
    firstPara: "Visit us",
    secondPara: "Come and say hello at our office HQ.",
    thirdPara: "Here is the location/ address",
  },
  {
    icon: <PiPhoneCallDuotone />,
    firstPara: "Call us",
    secondPara: "Mon - Fri From 8am to 5pm",
    thirdPara: "+123 456 7890",
  },
];

const Contact = () => {
  return (
    <div className="flex flex-col text-white">
      {/* Section 1 */}
      <section className="bg-richblack-900 py-10">
        <div className="mx-auto w-11/12 max-w-7xl flex flex-col md:flex-row items-start justify-between mt-10 space-y-8 md:space-y-0 gap-x-10">
          
          {/* Contact Options */}
          <div className="w-full md:w-2/5 bg-richblack-800 rounded-lg p-8 flex flex-col gap-6">
            {contactData.map((data, index) => (
              <div key={index} className="flex gap-2">
                <div className="text-2xl text-richblack-25">
                  {data.icon}
                </div>
                <div className="flex flex-col mb-2">
                  <p className="text-lg font-semibold text-richblack-25">
                    {data.firstPara}
                  </p>
                  <p className="text-sm font-inter text-richblack-100">
                    {data.secondPara}
                  </p>
                  <p className="text-sm text-richblack-100">
                    {data.thirdPara}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Us Form */}
          <div className="w-full md:w-3/5 bg-richblack-900 rounded-lg p-8 shadow-lg border border-richblack-600">
            <h2 className="text-2xl font-bold mb-4">
              Got an Idea? We’ve got the skills. Let’s team up
            </h2>
            <p className="text-sm text-richblack-100 mb-8">
              Tell us more about yourself and what you’ve got in mind.
            </p>
            <ContactUsForm />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mx-auto mt-16 w-11/12 max-w-7xl flex flex-col justify-center items-center bg-richblack-900 py-10">
        <div className="text-3xl font-semibold text-white mb-12">
          Reviews from other learners
          {/* <ReviewSlider /> */}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
