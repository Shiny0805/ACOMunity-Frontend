import React, { useEffect, useState } from "react";
import { useParams } from 'react-router';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from "@mui/material/styles";
import { useAccount } from "wagmi";
import { useNFTmintContract, useNFTmarketplaceContract } from "hooks/useContract";
import { getNFTmarketplaceAddress } from "utils/addressHelpers";
import { notify } from "utils/toastHelper";
import Loading from "components/Loading";
import { ethers } from "ethers";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function NFToffer() {
    const { id } = useParams();
    const { address } = useAccount();
    const [makeOfferProcessing, setMakeOfferProcessing] = useState(false);
    const [updateNftPriceProcessing, setUpdateNftPriceProcessing] = useState(false);
    const [acceptOfferProcessing, setAcceptOfferProcessing] = useState(false);

    const NFTmarketplaceAddress = getNFTmarketplaceAddress();
    const NFTmintContract = useNFTmintContract();
    const NFTmarketplaceContract = useNFTmarketplaceContract();

    const [ nftData, setNftData ] = useState([]);
    const [ nftListingData, setNftListingData ] = useState([]);
    const [ offerValue, setOfferValue ] = useState(0);
    const [ updatePrice, setUpdatePrice ] = useState(0);

    const apiUrl = `https://salmon-eldest-squirrel-166.mypinata.cloud/ipfs/QmQnfuesd29z6zBfbPkNHH9XuMg9n2oXC7T4z33UdeVjRh/${id}.json`;

    const makeOffer = async () => {
        try {
            setMakeOfferProcessing(true);
            const response = await NFTmarketplaceContract.makeOffer(id-1, { value: ethers.utils.parseEther(String(offerValue)) });
            await response.wait();
            setMakeOfferProcessing(false);
            notify("success", "you have successfully made an Offer");
            console.log("Make Offer Successfully!");
        } catch (error) {
            notify("Error : ", error.reason);
            console.error("Error Make Offer : ", error);
            setMakeOfferProcessing(false);
        }
    }

    const acceptOffer = async () => {
        try {
            setAcceptOfferProcessing(true);
            const response = await NFTmintContract.approve(NFTmarketplaceAddress, id);
            await response.wait();
            const tx = await NFTmarketplaceContract.acceptOffer(id-1);
            await tx.wait();
            setAcceptOfferProcessing(false);
            notify("Accept Offer Successfully!");
            console.log("Accept Offer Successfully!");
        } catch (error) {
            notify("Error : ", error.reason);
            console.error("Error Accept Offer : ", error);
            setAcceptOfferProcessing(false);
        }
    }

    const settingOfferValue = (e) => {
        setOfferValue(e.target.value);
    }

    const updatingPrice = (e) => {
        setUpdatePrice(e.target.value);
    }

    const updateNFTPrice = async () => {
        try {
            setUpdateNftPriceProcessing(true);
            const response = await NFTmarketplaceContract.updateNFTPrice(id-1, updatePrice * 10 ** 18);
            await response.wait();
            setUpdateNftPriceProcessing(false);
            notify("Update Price Successfully!");
            console.log("Update Price Successfully!");
        } catch (error) {
            notify("Error : ", error.reason);
            console.error("Error Update Price : ", error);
            setUpdateNftPriceProcessing(false);
        }
    }

    const gettingNFTData = async () => {
        try {
            const response = await fetch(apiUrl);
            const jsonData = await response.json();
            setNftData(jsonData);
        } catch (error) {
            console.error("Error fetching data : ", error);
        }
    }

    const gettingNFTListingData = async () => {
        try {
            const nft = await NFTmarketplaceContract.listings(Number(id-1));
            setNftListingData(nft);
        } catch (error) {
            console.error("Error fetching data : ", error);
        }
    }

    useEffect(() => {
        gettingNFTData();
        if(NFTmarketplaceContract) gettingNFTListingData();
    }, [address, NFTmarketplaceContract]);

    return (
        <>
            {
                nftListingData.seller === undefined ?
                    <Loading title="Loading..." />
                :
                    <div className="flex justify-center w-full md:max-w-7xl mt-12">
                        <div className="container m-3">
                            <h1 className="text-center text-3xl font-semibold mb-10">Deputy Dawgs NFT Make Offer</h1>
                            <div>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={6}>
                                        <Grid item md={6} sx={12}>
                                            <Item>
                                                <Box>
                                                    <img src={nftData.image} alt={nftData.name} />
                                                </Box>
                                            </Item>
                                        </Grid>
                                        <Grid item md={6} sx={12}>
                                            <Box>
                                                <p class="text-lg font-semibold p-2"> Name : {nftData.name} </p>
                                                <p class="text-lg font-semibold p-2"> Seller : {nftListingData.seller} </p>
                                                <p class="text-lg font-semibold p-2"> Price : {Number(nftListingData.price)/10**18} ETH </p>

                                                
                                                {
                                                    address === nftListingData.seller ?

                                                    <>
                                                        <input 
                                                            type="number" 
                                                            id="price-input" 
                                                            class="block m-4 p-2.5 w-4/5 z-20 ps-3 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" 
                                                            placeholder="Update the Price"
                                                            onChange={() => updatingPrice()}
                                                            required 
                                                        />
                                                            
                                                        <div class="w-56 flex justify-center m-4">
                                                            <button
                                                                className="custom_btn mt-5 hover:bg-hover flex justify-center disabled:opacity-50 disabled:hover:scale-100 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
                                                                onClick={() => updateNFTPrice()}
                                                            >
                                                                {updateNftPriceProcessing ? (
                                                                    <Loading title="Updating Price Now..." />
                                                                ) : (
                                                                    "UPDATE PRICE"
                                                                )}
                                                            </button>
                                                        </div>

                                                        <p class="text-lg p-2 mb-20 ml-2"> Please update your NFT price. </p>
                                                    </>
                                                    :
                                                    <>
                                                        <input 
                                                            type="number" 
                                                            id="price-input" 
                                                            class="block m-4 p-2.5 w-4/5 z-20 ps-3 text-sm text-gray-900 bg-gray-50 rounded-lg border-e-gray-50 border-e-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-e-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" 
                                                            placeholder="Please enter offer price"
                                                            onChange={() => settingOfferValue()}
                                                            required 
                                                        />
                                                            
                                                        <div class="w-56 flex justify-center m-4">
                                                            <button
                                                                className="custom_btn mt-5 hover:bg-hover flex justify-center disabled:opacity-50 disabled:hover:scale-100 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
                                                                onClick={() => makeOffer()}
                                                            >
                                                                {makeOfferProcessing ? (
                                                                    <Loading title="Sending Offer Now..." />
                                                                ) : (
                                                                    "SEND OFFER"
                                                                )}
                                                            </button>
                                                        </div>

                                                        <p class="text-lg p-2 mb-20 ml-2"> Please send your offer price to owner of this NFT. </p>
                                                    </>
                                                }

                                                
                                            </Box>
                                            {
                                                nftListingData.highestBid === 0 ?
                                                    null
                                                :
                                                <Box>
                                                    <p class="text-lg font-semibold p-2"> Buyer : {nftListingData.highestBidder} </p>
                                                    <p class="text-lg font-semibold p-2"> Offer Price : {Number(nftListingData.highestBid)/10**18} ETH </p>
                                                    
                                                    <div class="w-56 flex justify-center m-4">
                                                        <button
                                                            className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
                                                            onClick={() => acceptOffer()}
                                                        >
                                                            {acceptOfferProcessing ? (
                                                                <Loading title="Accepting Offer Now..." />
                                                            ) : (
                                                                "ACCEPT OFFER"
                                                            )}
                                                        </button>
                                                    </div>
                                                </Box>
                                            }
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}
