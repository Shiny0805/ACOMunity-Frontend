import { Interface } from "@ethersproject/abi";
// Addresses
const multicall = async (abi, calls) => {
  try {
    const itf = new Interface(abi);

    return;
  } catch (error) {
    throw new Error(error);
  }
};

export default multicall;
