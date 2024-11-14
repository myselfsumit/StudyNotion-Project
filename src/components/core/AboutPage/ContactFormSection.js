import React from 'react';
import ContactUsForm from '../../contactPage/ContactUsForm';

const ContactFormSection = () => {
  return (
    <div className="mt-10 w-11/12 max-w-3xl mx-auto flex flex-col justify-center items-center text-richblack-25 bg-richblack-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-richblack-25 mb-2">
        Get in Touch
      </h1>
      <p className="text-richblack-300 mb-8 text-center">
        We'd love to hear from you. Please fill out this form.
      </p>
      <div className="w-full mt-6">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
