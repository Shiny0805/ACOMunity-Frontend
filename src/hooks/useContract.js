import { useMemo } from "react";
import { useEthersProvider, useEthersSigner } from "hooks/useEthers";
import {
  getErc721Contract,
  getNFTContract,
  getNFTmintContract,
  getNFTmarketplaceContract,
} from "utils/contractHelpers";
import { useNetwork } from "wagmi";
import { CHAIN_ID, TESTNET_CHAIN_ID } from "config";

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC721 = (address) => {
  const signer = useEthersSigner();
  return useMemo(() => getErc721Contract(address, signer), [address, signer]);
};


export const useNFTContract = () => {
  const signer = useEthersSigner();
  const { chain } = useNetwork();
  return useMemo(
    () => chain && chain.id === CHAIN_ID && getNFTContract(signer),
    [signer, chain]
  );
};

export const useNFTmintContract = () => {
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const { chain } = useNetwork();
  return useMemo(
    () => chain && chain.id === TESTNET_CHAIN_ID && provider ? getNFTmintContract(signer) : null,
    [signer, chain, provider]
  );
};

export const useNFTmarketplaceContract = () => {
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const { chain } = useNetwork();
  return useMemo(
    () => chain && chain.id === TESTNET_CHAIN_ID && provider ? getNFTmarketplaceContract(signer) : null,
    [signer, chain, provider]
  );
};
