import React, { useState } from "react";
import Loading from "components/Loading";
import { useAccount } from "wagmi";
import { useNFTmintContract, useNFTmarketplaceContract } from 'hooks/useContract';
import { getNFTmarketplaceAddress } from "utils/addressHelpers";
import { notify } from "utils/toastHelper";
import useRefresh from "hooks/useRefresh";
import { didUserReject } from "utils/customHelpers";
import { useEthersSigner } from "hooks/useEthers";
import { ethers } from "ethers";
import Slideshow from "./Slideshow";

const NFTsData = [
	{ nft: '/assets/nft/DDAWG1.png' },
	{ nft: '/assets/nft/DDAWG2.png' },
	{ nft: '/assets/nft/DDAWG3.png' },
	{ nft: '/assets/nft/DDAWG4.png' },
	{ nft: '/assets/nft/DDAWG5.png' },
	{ nft: '/assets/nft/DDAWG6.png' },
	{ nft: '/assets/nft/DDAWG7.png' },
	{ nft: '/assets/nft/DDAWG8.png' },
	{ nft: '/assets/nft/DDAWG9.png' },
	{ nft: '/assets/nft/DDAWG10.png' },
	{ nft: '/assets/nft/DDAWG11.png' },
	{ nft: '/assets/nft/DDAWG12.png' },
	{ nft: '/assets/nft/DDAWG13.png' },
	{ nft: '/assets/nft/DDAWG14.png' },
	{ nft: '/assets/nft/DDAWG15.png' },
	{ nft: '/assets/nft/DDAWG16.png' },
	{ nft: '/assets/nft/DDAWG17.png' },
	{ nft: '/assets/nft/DDAWG18.png' },
	{ nft: '/assets/nft/DDAWG19.png' },
	{ nft: '/assets/nft/DDAWG20.png' },
	{ nft: '/assets/nft/DDAWG21.png' },
	{ nft: '/assets/nft/DDAWG22.png' },
	{ nft: '/assets/nft/DDAWG23.png' },
	{ nft: '/assets/nft/DDAWG24.png' },
	{ nft: '/assets/nft/DDAWG25.png' },
	{ nft: '/assets/nft/DDAWG26.png' },
	{ nft: '/assets/nft/DDAWG27.png' },
	{ nft: '/assets/nft/DDAWG28.png' },
	{ nft: '/assets/nft/DDAWG29.png' },
	{ nft: '/assets/nft/DDAWG30.png' },
];

export default function MintNFT() {
	const { address } = useAccount();
	const NFTmarketplaceAddress = getNFTmarketplaceAddress();
	const NFTmintContract = useNFTmintContract();
	const NFTmarketplaceContract = useNFTmarketplaceContract();
	const signer = useEthersSigner();
	const { fastRefresh } = useRefresh();
	const [isProcessing, setIsProcessing] = useState(false);

	const mintNFT = async () => {
		try {
			setIsProcessing(true);
			const tx = await NFTmintContract.publicMint({ value: ethers.utils.parseEther(String(0.01)) });
			await tx.wait();
			const totalSupply = await NFTmintContract.totalSupply();
			const totalNumber = parseInt(totalSupply);
			const rp = await NFTmintContract.approve(NFTmarketplaceAddress, totalNumber);
			await rp.wait();
			const rs = await NFTmarketplaceContract.listNFT(totalNumber, ethers.utils.parseEther('0.1'));
			await rs.wait();
			setIsProcessing(false);
			notify("success", "you have successfully minted an NFT");

			console.log("NFT Minted Successfully!");
		} catch (error) {
			notify("error", error.reason);
			setIsProcessing(false);
			console.log("Error minting NFT : ", error);
		}
	}

  return (
    <div className="flex justify-center items-center flex-col  min-h-[calc(100vh-200px)] w-full px-5">
        <div className="flex justify-center">
          <div className="tab_panel justify-center text-2xl">
            Deputy Dawg NFT MINT
          </div>
        </div>
        <div className="flex justify-center"></div>

        <div className="card">
            <div className="flex-1 flex justify-center items-center">
              <div className="block">
                <Slideshow images={NFTsData} interval={100} />
              </div>
            </div>

          <button
            className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
			onClick={() => mintNFT()}
		  >
            {isProcessing ? (
              <Loading title="Minting NFT now..." />
            ) : (
              "MINT NOW"
            )}
          </button>
        </div>
      
    </div>
  );
}
