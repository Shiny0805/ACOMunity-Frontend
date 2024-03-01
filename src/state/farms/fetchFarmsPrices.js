import BigNumber from "bignumber.js";
import { BIG_ONE, BIG_ZERO } from "utils/bigNumber";
import { filterFarmsByQuoteToken } from "utils/farmsPriceHelpers";
import { wildWethFarmPid, wethUsdcFarmPid } from "config";
const getFarmFromTokenSymbol = (farms, tokenSymbol, preferredQuoteTokens) => {
  const farmsWithTokenSymbol = farms.filter(
    (farm) => farm.token.symbol === tokenSymbol
  );
  const filteredFarm = filterFarmsByQuoteToken(
    farmsWithTokenSymbol,
    preferredQuoteTokens
  );
  return filteredFarm;
};

const getFarmBaseTokenPrice = (
  farm,
  quoteTokenFarm,
  wethPriceUsdt,
  threeWildPriceUsdt
) => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote);
  if (["USDC", "USDT", "BUSD"].includes(farm.quoteToken.symbol)) {
    return hasTokenPriceVsQuote
      ? new BigNumber(farm.tokenPriceVsQuote)
      : BIG_ZERO;
  }
  if (farm.quoteToken.symbol === "WBNB") {
    return hasTokenPriceVsQuote
      ? wethPriceUsdt.times(farm.tokenPriceVsQuote)
      : BIG_ZERO;
  }
  if (farm.quoteToken.symbol === "3WiLD") {
    return hasTokenPriceVsQuote
      ? threeWildPriceUsdt.times(farm.tokenPriceVsQuote)
      : BIG_ZERO;
  }

  // We can only calculate profits without a quoteTokenFarm for USDC/WBNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't USDC or wWBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - WBNB, (pBTC - WBNB)
  // from the WBNB - pBTC price, we can calculate the PNT - USDC price
  if (quoteTokenFarm.quoteToken.symbol === "WBNB") {
    const quoteTokenInUsdc = wethPriceUsdt.times(
      quoteTokenFarm.tokenPriceVsQuote
    );
    return hasTokenPriceVsQuote && quoteTokenInUsdc
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsdc)
      : BIG_ZERO;
  }

  if (["USDC", "USDT", "BUSD"].includes(quoteTokenFarm.quoteToken.symbol)) {
    const quoteTokenInUsdc = quoteTokenFarm.tokenPriceVsQuote;
    return hasTokenPriceVsQuote && quoteTokenInUsdc
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInUsdc)
      : BIG_ZERO;
  }

  // Catch in case token does not have immediate or once-removed WMATIC/USDC quoteToken
  return BIG_ZERO;
};

const getFarmQuoteTokenPrice = (
  farm,
  quoteTokenFarm,
  wethPriceUsdt,
  threeWildPriceUsdt
) => {
  if (["USDC", "USDT", "BUSD"].includes(farm.quoteToken.symbol)) {
    return BIG_ONE;
  }
  if (farm.quoteToken.symbol === "3WiLD") {
    return threeWildPriceUsdt;
  }
  if (farm.quoteToken.symbol === "WBNB") {
    return wethPriceUsdt;
  }
  if (!quoteTokenFarm) {
    return BIG_ZERO;
  }

  if (quoteTokenFarm.quoteToken.symbol === "WBNB") {
    return quoteTokenFarm.tokenPriceVsQuote
      ? wethPriceUsdt.times(quoteTokenFarm.tokenPriceVsQuote)
      : BIG_ZERO;
  }

  return BIG_ZERO;
};

const fetchFarmsPrices = async (farms) => {
  const wethUsdtFarm = farms.find((farm) => farm.pid === wethUsdcFarmPid);
  const wethPriceUsdt =
    wethUsdtFarm.tokenPriceVsQuote > 0
      ? BIG_ONE.div(wethUsdtFarm.tokenPriceVsQuote)
      : BIG_ZERO;
  const threeWildUsdtFarm = farms.find((farm) => farm.pid === wildWethFarmPid);
  const threeWildPriceUsdt =
    threeWildUsdtFarm.tokenPriceVsQuote > 0
      ? new BigNumber(threeWildUsdtFarm.tokenPriceVsQuote).times(wethPriceUsdt)
      : BIG_ZERO;
  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(
      farms,
      farm.quoteToken.symbol
    );
    const baseTokenPrice = getFarmBaseTokenPrice(
      farm,
      quoteTokenFarm,
      wethPriceUsdt,
      threeWildPriceUsdt
    );
    const quoteTokenPrice = getFarmQuoteTokenPrice(
      farm,
      quoteTokenFarm,
      wethPriceUsdt,
      threeWildPriceUsdt
    );

    const token = { ...farm.token, usdcPrice: baseTokenPrice.toJSON() };
    const quoteToken = {
      ...farm.quoteToken,
      usdcPrice: quoteTokenPrice.toJSON(),
    };
    return { ...farm, token, quoteToken };
  });

  return farmsWithPrices;
};

export default fetchFarmsPrices;
