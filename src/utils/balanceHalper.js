import { BigNumber, ethers } from "ethers";
import { erc20ABI } from "wagmi";
import lpTokenAbi from "config/abis/lpToken.json";
import { toReadableAmount } from "./customHelpers";

export async function getBalance(address, token, provider) {
  if (!token || !address || !provider) return;
  try {
    if (token.lpSymbol === "BNB") {
      const balance = await provider?.getBalance(address);
      return toReadableAmount(balance, 18);
    } else {
      if (token.isTokenOnly) {
        const contract = new ethers.Contract(
          token.lpAddresses,
          erc20ABI,
          provider
        );
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        return toReadableAmount(balance, Number(decimals.toString()));
      } else {
        const contract = new ethers.Contract(
          token.lpAddresses,
          lpTokenAbi,
          provider
        );
        const balance = await contract.balanceOf(address);
        const decimals = await contract.decimals();
        return toReadableAmount(balance, Number(decimals.toString()));
      }
    }
  } catch (e) {
    console.log(e);
  }
}
