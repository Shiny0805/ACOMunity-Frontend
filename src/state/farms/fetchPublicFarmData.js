import BigNumber from "bignumber.js";
import { BIG_TEN, BIG_ZERO } from "utils/bigNumber";
import multicall from "utils/multicall";
import nftABI from "config/abis/nft.json";
import httpProvider from "utils/providerHelpers";
const fetchPublicFarmData = async (farm) => {
  const { lpAddresses, isNFTPool } = farm;
  const lpAddress = lpAddresses;
  const calls = [
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: "totalSupply",
    },
  ];

  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply] =
    await multicall(isNFTPool ? nftABI : calls);
  let tokenAmountTotal;
  let quoteTokenAmountTotal = BIG_ZERO;
  let lpTotalInQuoteToken = BIG_ZERO;
  let tokenPriceVsQuote = BIG_ZERO;
  const tokenDecimals = 18;
  const quoteTokenDecimals = 18;

  if (farm.isNFTPool) {
    tokenAmountTotal = new BigNumber(lpTokenBalanceMC);
  } else if (!farm.isNFTPool && farm.isTokenOnly) {
    tokenAmountTotal = new BigNumber(lpTokenBalanceMC).div(
      BIG_TEN.pow(tokenDecimals)
    );
    const tokenBalance = new BigNumber(tokenBalanceLP).div(
      BIG_TEN.pow(tokenDecimals)
    );
    const quoteTokenBalance = new BigNumber(quoteTokenBalanceLP).div(
      BIG_TEN.pow(quoteTokenDecimals)
    );
    const stables = ["USDC", "USDT", "BUSD"];
    if (
      stables.includes(farm.token.symbol) &&
      stables.includes(farm.quoteToken.symbol)
    ) {
      tokenPriceVsQuote = new BigNumber(1);
    } else if (new BigNumber(tokenBalanceLP).comparedTo(0) > 0) {
      tokenPriceVsQuote = quoteTokenBalance.div(new BigNumber(tokenBalance));
    }
    lpTotalInQuoteToken = tokenAmountTotal.times(tokenPriceVsQuote);
  } else {
    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
      new BigNumber(lpTotalSupply)
    );

    // Raw amount of token in the LP, including those not staked
    const tokenAmountMC = new BigNumber(tokenBalanceLP).div(
      BIG_TEN.pow(tokenDecimals)
    );
    tokenAmountTotal = tokenAmountMC.times(lpTokenRatio);

    const quoteTokenAmountMC = new BigNumber(quoteTokenBalanceLP).div(
      BIG_TEN.pow(quoteTokenDecimals)
    );
    quoteTokenAmountTotal = quoteTokenAmountMC.times(lpTokenRatio);

    if (new BigNumber(quoteTokenBalanceLP).comparedTo(0) > 0) {
      // Total value in staking in quote token value
      lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatio);
    }

    if (tokenAmountMC.comparedTo(0) > 0) {
      tokenPriceVsQuote = quoteTokenAmountMC.div(tokenAmountMC);
    } else if (new BigNumber(tokenBalanceLP).comparedTo(0) > 0) {
      tokenPriceVsQuote = new BigNumber(quoteTokenBalanceLP).div(
        new BigNumber(tokenBalanceLP)
      );
    }
  }

  return;
};

export default fetchPublicFarmData;
