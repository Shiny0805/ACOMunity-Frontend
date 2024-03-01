import { useCallback } from "react";
import { approve } from "utils/callHelpers";
import { useMasterchef } from "./useContract";
import { useAccount } from "wagmi";
// Approve a Farm
export const useApprove = (lpContract, isNFTPool) => {
  const { address } = useAccount();
  const masterChefContract = useMasterchef();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(
        lpContract,
        masterChefContract,
        address,
        isNFTPool
      );
      await tx.wait();
      return tx;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, [address, lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

export default useApprove;
