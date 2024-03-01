import BigNumber from "bignumber.js";
import multicall from "utils/multicall";
import nftABI from "config/abis/nft.json";

export const fetchFarmUserAllowances = async (account, farmsToFetch) => {

  const callsNFT = farmsToFetch
    .filter((farm) => farm.isNFTPool)
    .map((farm) => {
      const lpContractAddress = farm.isTokenOnly
        ? farm.token.address
        : farm.lpAddresses;
      return {
        address: lpContractAddress,
        name: "isApprovedForAll",
        params: [account],
      };
    });

  const rawNFTAllowances = await multicall(nftABI, callsNFT);

  const parsedNFTAllowances = rawNFTAllowances.map((lpBalance) => {
    return lpBalance;
  });
  return [...parsedNFTAllowances];
};
