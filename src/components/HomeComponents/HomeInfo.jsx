import React from "react";
import 'pages/style.css';

export default function HomeInfo() {

  return (
    <div className="container m-auto py-20">
        <div class="grid grid-cols-4 gap-4">
            <div>
                <div class='golden_circle'>
                    <h1>token swap</h1>
                    <h1>productions</h1>
                </div>
                <div class="blue_circle">
                    Outsources
                </div>
            </div>
            <div>
                <div class="blue_circle">
                    NFT Handbook
                </div>
                <div class="blue_circle">
                    Annual Report
                </div>
            </div>
            <div>
                <div class="blue_circle">
                    Games
                </div>
                <div class="blue_circle">
                    AI Integration
                </div>
            </div>
            <div>
                <div class="blue_circle">
                    Freelancer
                </div>
                <div class="blue_circle">
                    Company Culture
                </div>
            </div>
        </div>
    </div>
  );
}
