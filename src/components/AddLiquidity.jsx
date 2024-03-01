import React, { useState, useEffect, useContext } from "react";
import tokens from "config/tokens";
import TokenSelect from "./TokenSelect";
import TokenSelectModal from "./TokenSelectModal";
import { ContractContext } from "context/contracts";
import { createPair, getValidPair } from "utils";
import { useAccount } from "wagmi";
import { SubmitButton } from "./UI/SubmitButton";
import { toast } from "react-hot-toast";

export default function AddLiquidity(props) {
  const contracts = useContext(ContractContext);
  const [loading, setLoading] = useState({
    pair: true,
    creatingPair: false,
  });

  const [states, setStates] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenA, setTokenA] = useState(tokens[1]);
  const [tokenB, setTokenB] = useState(tokens[2]);
  const [pair, setPair] = useState("");

  const closeModalA = () => {
    setOpenA(false);
  };

  const closeModalB = () => {
    setOpenB(false);
  };

  const moveToSupply = () => {
    props.handleSupply(true);
    props.setTokenA(tokenA);
    props.setTokenB(tokenB);
  };

  const checkValidPair = async (tokenA, tokenB) => {
    try {
      setPair("");
      setLoading({ ...loading, pair: true });
      const pair = await getValidPair(
        tokenA?.address,
        tokenB?.address,
        contracts.factoryProvider
      );
      setPair(pair);
      setLoading({ ...loading, pair: false });
    } catch (e) {
      setLoading({ ...loading, pair: false });
      console.log(e.reason);
    }
  };

  const newPair = async () => {
    try {
      setLoading({ ...loading, creatingPair: true });
      const res = await createPair(
        tokenA.address,
        tokenB.address,
        contracts.factorySigner
      );
      if (res) {
        setPair(res);
        toast.success("New Pair is created successfuly");
      }
      setLoading({ ...loading, creatingPair: false });
    } catch (e) {
      setPair("");
      setLoading({ ...loading, creatingPair: false });
    }
  };

  useEffect(() => {
    if (tokenA && tokenB && contracts) {
      checkValidPair(tokenA, tokenB);
    }
  }, [tokenA, tokenB, contracts]);

  return (
    <div className="flex justify-center">
      <div className="card">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {/* <button className="action_btn"><img src="/assets/chart.png" alt="" /></button> */}
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="block">
              <h1 className="text-center text-yellow-main text-2xl">
                Add Liquidity
              </h1>
            </div>
          </div>
          <div className="flex-1 flex justify-end items-center">
            <button className="action_btn">
              <img src="/assets/refresh.png" alt="" />
            </button>
            <button className="action_btn ml-3">
              <img src="/assets/setting.png" alt="" />
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400">
          Receive LP tokens and earn trading fees
        </p>
        <div className="block">
          <p className="text-sm text-gray-300">Select Token</p>
          <TokenSelect
            token={tokenA}
            setOpen={setOpenA}
            selectOnly={true}
            setStates={setStates}
          />

          <div className="flex justify-center">
            {pair ? (
              <div className="swap_btn_box2">CHOOSE A VALID PAIR</div>
            ) : (
              <div className="swap_btn_box2">CHOOSE A VALID PAIR</div>
            )}
          </div>

          <TokenSelect
            token={tokenB}
            setOpen={setOpenB}
            selectOnly={true}
            setStates={setStates}
          />

          <SubmitButton
            type={"add"}
            loading={loading}
            pair={pair}
            moveToSupply={moveToSupply}
            newPair={newPair}
          />

          <p className="text-xl text-yellow-main text-center">
            LP reward APR 2.39%
          </p>
        </div>
      </div>
      {/* TokenA modal */}
      <TokenSelectModal
        open={openA}
        closeModal={closeModalA}
        setToken={setTokenA}
        disableAddress={tokenB?.address}
        selected={tokenA?.address}
      />
      {/* TokenB modal */}
      <TokenSelectModal
        open={openB}
        closeModal={closeModalB}
        setToken={setTokenB}
        disableAddress={tokenA?.address}
        selected={tokenB?.address}
      />
    </div>
  );
}
