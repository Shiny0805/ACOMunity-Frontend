import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNFTmintContract, useNFTmarketplaceContract } from "hooks/useContract";
import { notify } from "utils/toastHelper";
import Loading from "components/Loading";
import { useEthersSigner } from "hooks/useEthers";
import useRefresh from "hooks/useRefresh";

export default function AgemsToken() {
  const { address } = useAccount();
  const NFTmintContract = useNFTmintContract();
  const NFTmarketplaceContract = useNFTmarketplaceContract();
  const { fastRefresh } = useRefresh();
  const signer = useEthersSigner();

  const [active, setActive] = useState(0);

  const [ nftList, setNFTlist ] = useState([]);
  const [ myNftData, setMyNftData ] = useState([]);
  const [ myTokenId, setMyTokenId ] = useState(0);
  const [ apiUrls, setApiUrls ] = useState([]);
  const [ marketplaceData, setMarketplaceData ] = useState([]);
  const [ filter, setFilter ] = useState('all');
  const [ newOfferEvent, setNewOfferEvent ] = useState(null);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  }

  const fecthMintedNftData = async () => {
    const totalSupply = await NFTmintContract.totalSupply();
    const totalNumber = parseInt(totalSupply);
    const nfts =[];

    for (let i = 0; i < totalNumber; i ++) {
      const nft = await NFTmarketplaceContract.listings(Number(i));

      if (nft.seller === address) {
        setMyTokenId(i+1);

        try {
          const response = await fetch(`https://salmon-eldest-squirrel-166.mypinata.cloud/ipfs/QmQnfuesd29z6zBfbPkNHH9XuMg9n2oXC7T4z33UdeVjRh/${i+1}.json`);
          const jsonData = await response.json();
          setMyNftData(jsonData);
        } catch (error) {
          notify("Error : ", error.reason);
          console.log("Error my nft Data : ", error);
        }
      }
      nfts.push(nft);
    }
    setNFTlist(nfts);
    getMetaData();
  };

  const getMetaData = () => {
    const apiUrl = [];
    for ( let i = 0; i < nftList.length; i ++) {
      apiUrl.push(`https://salmon-eldest-squirrel-166.mypinata.cloud/ipfs/QmQnfuesd29z6zBfbPkNHH9XuMg9n2oXC7T4z33UdeVjRh/${nftList[i].tokenId}.json`);
    }
    setApiUrls(apiUrl);
    fetchingMetaData();
  };

  const fetchingMetaData = async () => {
      const responseData = [];
      for (let i = 0; i < apiUrls.length; i ++) {
        try {
          const response = await fetch(apiUrls[i]);
          const jsonData = await response.json();
          responseData.push(jsonData);
        } catch (error) {
          notify("Error : ", error.reason);
          console.error("Error fetching Data: ", error);
        }
      }
      setMarketplaceData(responseData);
  };

  // const handleNewOfferEvent = async (listingId, buyer, amount) => {
  //   const res = await NFTmintContract.ownerOf(Number(listingId)+1);

  //   if (res === address) {
  //     setNewOfferEvent({ listingId, buyer, amount });
  //   }
  // }

  useEffect(() => {
    if (signer && address && NFTmintContract && NFTmarketplaceContract) fecthMintedNftData();
  }, [address, signer, fastRefresh, NFTmintContract, NFTmarketplaceContract])

  return (
    <>
      {
        address ?
          marketplaceData.length !== 0 ?
          <div>
            <div>
              <div className="tab">
                <div className="flex justify-center">
                  <div className="tab_panel">
                    <div
                      className={`tab_button ${active === 0 ? "active" : ""}`}
                      onClick={() => setActive(0)}
                    >
                      All NFTs
                    </div>
                    <div
                      className={`tab_button ${active === 1 ? "active" : ""}`}
                      onClick={() => setActive(1)}
                    >
                      My NFT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center min-h-[calc(100vh-200px)]">
                {
                  active === 0 ?
                    <>
                      {
                        marketplaceData.map((item, index) => (
                          <div className="card" key={index}>
                            <div className="flex items-center">
                              <div className="flex-1 flex justify-center items-center">
                                  <img src={item.image} alt={item.name} />
                              </div>
                            </div>
                            <a href={`/nftoffer/${index+1}`}>
                              <button
                                className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
                              >
                                Make Offer
                              </button>
                            </a>
                          </div>
                        ))
                      }
                    </>
                  :
                    <>
                      <div className="card">
                        <div className="flex items-center">
                          <div className="flex-1 flex justify-center items-center">
                              <img src={myNftData.image} alt={myNftData.name} />
                          </div>
                        </div>
                        <a href={`/nftoffer/${myTokenId}`}>
                          <button
                            className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
                          >
                            Make Offer
                          </button>
                        </a>
                      </div>
                    </>
                }           
                
              </div>
            </div>
            
          </div>
          :
          <Loading title="Loading..." />
        :
        <Loading title="No connected wallet..." />
      }
    </>
  );
}
