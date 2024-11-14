import React from "react";
import HighlightText from "../HomePage/HighlightText";

const Quote = () => {
  return (
    <section className="py-5">
      <div className="w-11/12 max-w-maxContent mx-auto text-center text-white">
        <p className="text-xl md:text-3xl font-semibold leading-loose">
          "We are passionate about revolutionizing the way we learn. Our innovative platform{" "}
          <HighlightText text={"combines technology"} />
          <span className="text-brown-500"> expertise</span>, and community to create an
          <span className="text-brown-500"> unparalleled educational experience."</span>
        </p>
      </div>
    </section>
  );
};

export default Quote;
