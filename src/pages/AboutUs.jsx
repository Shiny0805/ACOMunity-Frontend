import React from "react";
import FAQs from "components/AboutUsComponents/FAQs";
import ContactUs from "components/AboutUsComponents/ContactUs";
import Banner from "components/AboutUsComponents/Banner";
import Vision from 'components/AboutUsComponents/Vision';
  
  export default function AboutUs() {

    return (
      <div>
        {/* <div className="container m-auto">
          About Us - title
        </div> */}
        <Banner />
        <Vision />
        <FAQs />
        <ContactUs />
      </div>
    );
  }
  