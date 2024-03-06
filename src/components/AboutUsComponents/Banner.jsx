import React, { useState } from "react";
import 'pages/style.css'
  
  export default function Banner() {

    return (
        <div className="aboutus_banner">
            <div className="container m-auto flex justify-between items-center py-5">
                <div class='w-1/2 p-5'>
                    <img class='rotate-12' src="./assets/AboutUs/banner_icon.png" alt="aboutus_banner_icon" />
                </div>
                <div class='w-1/2 p-5'>
                    <div>
                        <div class='text-3xl text-center p-5'>
                            Why ACOMUnity?
                        </div>
                        <div className="text-xl py-5">
                            Envision a world where work is borderless, payments are transparent, and community collaborate drives success.
                            ACOMUnity is not just a platform; it's a movement redefining the future of work.
                        </div>
                    </div>

                    <div>
                        <div class='text-3xl text-center'>
                            Our Vision :
                        </div>

                        <div class='text-xl py-5'>
                            ACOMUnity envisions a future where the global workforce operates in a decentralized, transparent, and collaborative ecosystem.
                            AGEMS Token is our catalyst for change, driving innovation and empowerment.

                            <p class='text-2xl py-3'>
                                Welcome to ACOMUnity.com - Where Innovation Meets Opportunity!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class='container m-auto'>
                <div class='text-3xl text-center'>
                    Empowerment through Technology:
                </div>
                <div class='text-xl py-5'>
                    At the core of ACOMUnity.com lies a symphony of cutting-edge technologies. Seamlessly integrating TOKEN's, SWAP mechanisms, NFT's, immersive GAMES, and groundbreaking AI Integration, we pave the way for a revolution in freelancing and outsourcing.
                </div>
            </div>
        </div>
    );
  }
  