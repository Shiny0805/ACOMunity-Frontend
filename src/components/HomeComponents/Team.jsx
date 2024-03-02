import React from "react";
import 'pages/style.css';

export default function Team() {

  return (
    <div className="container m-auto py-20">
        <div class="grid grid-cols-4 gap-4">
            <div>
                <div class='py-5 text-center'>
                    <h1 class='uppercase text-4xl pb-3'>
                        team
                    </h1>
                    <h1 class='uppercase text-2xl'>
                        agems
                    </h1>
                </div>
                <div class="team_manager">
                    project manager
                </div>
            </div>
            <div>
                <div class="team_member">
                    lead dev
                </div>
                <div class="team_member">
                    agems coder
                </div>
            </div>
            <div>
                <div class="team_member">
                    manager
                </div>
                <div class="team_member">
                    agems coder
                </div>
            </div>
            <div>
                <div class="team_member">
                    designer
                </div>
                <div class="team_member">
                    social media
                </div>
            </div>
        </div>
    </div>
  );
}
