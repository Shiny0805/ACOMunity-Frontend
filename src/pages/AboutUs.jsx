import React from "react";
  import DDawgsBanner from "components/DDawgsComponents/Banner";
  import DDawgsImage from "components/DDawgsComponents/Image";
  import DDawgsBasicGrid from "components/DDawgsComponents/BasicGrid";
  
  export default function AboutUs() {

    return (
      <div className="flex justify-center w-full md:max-w-7xl mt-12">
        <div className="container m-3">
          <DDawgsBanner />
          <DDawgsImage />
          <DDawgsBasicGrid />
        </div>
      </div>
    );
  }
  