import React from "react";
import TrendingCampaigns from "components/HomeComponents/TrendingCampaigns";
import './style.css';

export default function Home() {
  return (
    <div>
      <div className="home_introduction_banner">
        <div className="container m-auto py-[150px] flex justify-between items-center">
          <div class="w-1/2">
            <h1 class="text-6xl">
              ACOMUnity - AGEMs
            </h1>
            <p class="text-2xl py-10">
              Embark on a revolutionary journey with ACOMUnity, where freelancing and outsourcing meet blockchain innovation. Our platform, fueled by the AGEMS Token, transcends traditional boundaries, offering a decentralized space where talents thrive and opportunities abound.
            </p>
            <div class="flex items-center">
              <div class="w-[180px] py-4 text-2xl bg-lime-500 border-2 hover:bg-lime-600 cursor-pointer rounded-lg border-lime-500 text-gray-950 font-bold text-center">
                Explorer
              </div>
              <div class="w-[180px] py-4 text-2xl bg-slate-800 border-2 hover:bg-slate-900 cursor-pointer mx-4 rounded-lg border-lime-600 text-lime-600 font-bold text-center">
                Create
              </div>
            </div>
          </div>
          <div class="w-1/2">
            <img src="/assets/Home/banner_img.png" alt="home_banner_image" />
          </div>
        </div>
      </div>

      <TrendingCampaigns />
    </div>
  );
}
