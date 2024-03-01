import React from "react";

export default function TrendingCampaigns() {

  return (
    <div className="container m-auto">
        <div class="flex justify-between items-center py-10">
            <div class="w-1/2 text-center">
                <h1 class='uppercase text-3xl opacity-50 py-5'>
                    why acomunity?
                </h1>

                <p class="text-2xl p-3">
                    Envision a World where work is Borderless, Payments are Transparent, and Community Collaboration drives Success. ACOMUnity DAO is not just a platform; it's a movement redefining the future of work.
                </p>
            </div>

            <div class="w-1/2 text-center">
                <h1 class="uppercase text-3xl opacity-50 py-5">
                    our vision
                </h1>

                <p class='text-2xl p-3'>
                    ACOMUnity DAO envisions a future where the Global Workforce operates in a Decentralized, Transparent, and Collaborative Ecosystem. AGEMS Token is our catalyst for change, driving innovation and empowerment.
                </p>
            </div>
        </div>

        <div class='flex justify-center pb-20'>
            <div class='px-5 py-3 text-2xl text-black bg-white hover:bg-slate-200 rounded-md cursor-pointer'>
                Subscribe to be updated
            </div>
        </div>
    </div>
  );
}
