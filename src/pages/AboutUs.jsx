import React from "react";
import FAQs from "components/AboutUsComponents/FAQs";
import ContactUs from "components/AboutUsComponents/ContactUs";
  
  export default function AboutUs() {

    return (
      <div>
        {/* <div className="container m-auto">
          About Us - title
        </div> */}
        <FAQs />
        <ContactUs />
      </div>
    );
  }
  