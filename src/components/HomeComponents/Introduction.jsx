import React from "react";
import 'pages/style.css';

export default function Introduction() {

  return (
    <div>
        <div id="video-container">
            <video autoplay="autoplay" muted loop>
                <source src="/assets/Home/introduction.mp4" type="video/mp4" />
            </video>
        </div>

        <div class="video_content relative text-white text-center py-[150px]">
            <div class="w-3/5 m-auto">
                <h1 class="text-4xl uppercase font-normal py-5">
                    you waited a long time for this
                </h1>

                <h1 class="text-8xl font-bold py-4">
                    Crypto Payments For Your SKILLS
                </h1>

                <div class="text-3xl font-medium text-left">
                    <p>
                        Discover ACOMUnity.com:
                    </p>

                    <p class="pl-5">
                         • Seamlessly Manage Tasks with our Intuitive Platform.
                    </p>

                    <p class="pl-5">
                         • Receive Payments Securely in AGEMS Tokens.
                    </p>

                    <p class="pl-5">
                         • Join a Vibrant Community Forum Fostering Collaboration.
                    </p>
                </div>
                
            </div>
        </div>
    </div>
  );
}
