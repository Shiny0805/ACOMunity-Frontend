import { ethers } from "ethers";
// Addresses
import {
  getNFTAddress,
  getNFTmintAddress,
  getNFTmarketplaceAddress
} from "utils/addressHelpers";

// ABI
import nftABI from "config/abis/nft.json";
import nftmintABI from "config/abis/nftmint.json";
import nftmarketplaceABI from "config/abis/nftmarketplace.json";

import { DEFAULT_GAS_PRICE } from "config";
// import { getSettings, getGasPriceInWei } from './settings'

export const getDefaultGasPrice = () => {
  return DEFAULT_GAS_PRICE;
};

const getContract = (abi, address, provider) => {
  return new ethers.Contract(address, abi, provider);
};

export const getErc721Contract = (address, provider) => {
  return getContract(nftABI, address, provider);
};

export const getNFTContract = (provider) => {
  return getContract(nftABI, getNFTAddress(), provider);
};

export const getNFTmintContract = (provider) => {
  return getContract(nftmintABI, getNFTmintAddress(), provider);
};

export const getNFTmarketplaceContract = (provider) => {
  return getContract(nftmarketplaceABI, getNFTmarketplaceAddress(), provider);
};
