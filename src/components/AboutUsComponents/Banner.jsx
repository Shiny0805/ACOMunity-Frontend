import React, { useState } from "react";
import 'pages/style.css'
  
  export default function Banner() {

    return (
        <div className="aboutus_banner">
            <div className="container m-auto flex justify-between items-center">
                <div class='w-1/4 p-5'>
                    <img src="./assets/AboutUs/banner_icon.png" alt="aboutus_banner_icon" />
                </div>
                <div class='w-2/3'>
                    <div class='text-4xl text-center p-10'>
                        Why ACOMUnity?
                    </div>
                    <div className="text-2xl py-10">
                        Envision a world where work is borderless, payments are transparent, and community collaborate drives success.
                        ACOMUnity is not just a platform; it's a movement redefining the future of work.
                    </div>
                </div>
            </div>
        </div>
    );
  }
  