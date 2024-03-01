import React from "react";

const TrendingCampaignsData = [
    {
        image: '',
        name: 'OpenStamp',
        description: 'OpenStamp x Ta'
    }
]

export default function TrendingCampaigns() {

  return (
    <div className="container m-auto">
        <div class="flex justify-between items-center py-10">
            <div className="text-3xl font-bold">
                Trending Campaigns
            </div>

            <div class='text-xl cursor-pointer font-light text-white hover:text-slate-400'>
                View All
            </div>
        </div>
        
        <div>
            
        </div>

    </div>
  );
}
