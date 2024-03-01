import addresses from "constants/addresses";

const tokens = {
  eth: {
    symbol: "BNB",
    address: addresses.wbnb,
    decimals: 18,
    logo: "/assets/tokens/bnb.svg",
  },
  wild: {
    symbol: "3WiLD",
    address: addresses.wild,
    decimals: 18,
    logo: "/assets/tokens/wildx.png",
    projectLink: "https://wildbase.farm/", // todo:
  },
  weth: {
    symbol: "WBNB",
    address: addresses.weth,
    decimals: 18,
    logo: "https://svgshare.com/getbyhash/sha1-38zdMb/7WVkaVJEus7guQuBuCSU=",
  },
  wbnb: {
    symbol: "WBNB",
    logo: "/assets/tokens/wbnb.svg",
    address: addresses.wbnb,
    decimals: 18,
  },
  usdc: {
    symbol: "USDC",
    address: addresses.usdc,
    decimals: 18,
    logo: "/assets/tokens/usdc.svg",
  },
  busd: {
    symbol: "BUSD",
    address: addresses.busd,
    decimals: 18,
    logo: "/assets/tokens/busd.svg",
  },
  usdt: {
    symbol: "USDT",
    address: addresses.usdt,
    decimals: 18,
    logo: "/assets/tokens/usdt.svg",
  },
  nft: {
    symbol: "3WiLD NFT",
    address: addresses.nft,
    decimals: 18,
    logo: "/assets/tokens/nft.png",
  },
};

export default tokens;
