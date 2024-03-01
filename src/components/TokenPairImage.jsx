import React from "react";

import { TokenPairImage as UIKitTokenPairImage } from "uikit";

export const getImageUrlFromToken = (token) => {
  const symbol = token.symbol.toLowerCase();
  return `/assets/tokens/${symbol}.${symbol === "alb" ? "jpg" : "svg"}`;
};

const TokenPairImage = ({ primaryToken, secondaryToken, ...props }) => {
  return (
    <UIKitTokenPairImage
      primarySrc={primaryToken.logo}
      secondarySrc={secondaryToken.logo}
      {...props}
    />
  );
};

export default TokenPairImage;
