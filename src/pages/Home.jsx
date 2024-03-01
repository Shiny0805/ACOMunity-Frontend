import React from "react";
import HomeDescription from "components/HomeComponents/HomeDescription";
import Introduction from "components/HomeComponents/Introduction";
import HomeContent from "components/HomeComponents/HomeContent";
import Team from "components/HomeComponents/Team";

import './style.css';

export default function Home() {
  return (
    <div>
      <Introduction />
      <HomeContent />
      <HomeDescription />
      <Team />
    </div>
  );
}
