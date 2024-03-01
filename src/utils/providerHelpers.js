import { providers } from "ethers";
import getRpcUrl from "utils/getRpcUrl";

const RPC_URL = getRpcUrl();
const network = {
  chainId: 56,
  name: "BNB Smart Chain",
  ensAddress: undefined,
};
const httpProvider = new providers.JsonRpcProvider(RPC_URL, network);

export default httpProvider;
