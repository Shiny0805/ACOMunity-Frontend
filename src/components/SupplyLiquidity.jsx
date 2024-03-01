/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import TokenSelectModal from "./TokenSelectModal";
import TokenSelect from "./TokenSelect";
import {
  approveHandler,
  createPair,
  fromReadableAmount,
  getPrice,
  getValidPair,
} from "utils";
import { ContractContext } from "context/contracts";
import { getAllowance } from "utils";
import { getRouterAddress } from "utils/addressHelpers";
import { useAccount } from "wagmi";
import { useEthersProvider, useEthersSigner } from "hooks/useEthers";
import toast from "react-hot-toast";
import { SubmitButton } from "./UI/SubmitButton";

export default function SupplyLiquidity(props) {
  const contracts = useContext(ContractContext);
  const { address } = useAccount();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const [status, setStatus] = useState({
    tokenA: true,
    tokenB: true,
    insufficientA: false,
    insufficientB: false,
    supply: false,
    approve: false,
    pairCreating: false,
  });
  const [pairLoading, setPairLoading] = useState(true);

  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenA, setTokenA] = useState(props.tokenA);
  const [tokenB, setTokenB] = useState(props.tokenB);
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [tokenAAllowance, setTokenAAllowance] = useState();
  const [tokenBAllowance, setTokenBAllowance] = useState();
  const [typingTimer, setTypingTimer] = useState(0);
  const [pair, setPair] = useState("");

  const closeModalA = () => {
    setOpenA(false);
  };

  const closeModalB = () => {
    setOpenB(false);
  };

  const handleSetInsufficientA = (flag) => {
    setStatus({ ...status, insufficientA: flag });
  };

  const handleSetInsufficientB = (flag) => {
    setStatus({ ...status, insufficientB: flag });
  };

  const handleSetTokenAAvailable = (flag) => {
    setStatus({ ...status, tokenA: flag });
  };

  const handleSetTokenBAvailable = (flag) => {
    setStatus({ ...status, tokenB: flag });
  };

  const checkValidPair = async (tokenA, tokenB) => {
    try {
      setPair("");
      setPairLoading(true);
      const pair = await getValidPair(
        tokenA?.address,
        tokenB?.address,
        contracts.factoryProvider
      );
      setPairLoading(false);
      setPair(pair);
    } catch (e) {
      setPairLoading(false);
      console.log(e);
    }
  };

  const checkAllowance = async (token, type) => {
    const res = await getAllowance(
      address,
      token,
      getRouterAddress(),
      provider
    );
    if (type === "A") {
      setTokenAAllowance(Number(res));
    } else {
      setTokenBAllowance(Number(res));
    }
  };

  const handleSetTokenA = (val) => {
    setTokenA(val);
    checkAllowance(tokenA, "A");
  };

  const handleSetTokenB = (val) => {
    setTokenB(val);
    checkAllowance(tokenB, "B");
  };

  const checkPrice = async (amount, type) => {
    try {
      if (type === "A") {
        const res = await getPrice(
          tokenA,
          tokenB,
          amount,
          type,
          contracts.routerProvider
        );
        if (res !== "unkown") setTokenBAmount("");
        setTokenBAmount(Number(res));
      } else {
        const res = await getPrice(
          tokenB,
          tokenA,
          amount,
          type,
          contracts.routerProvider
        );
        if (res !== "unkown") setTokenAAmount("");
        setTokenAAmount(Number(res));
      }
    } catch (error) {
      setTokenAAmount("");
      setTokenBAmount("");
      console.log(error);
    }
  };

  const approve = async (type) => {
    setStatus({ ...status, approve: true });

    if (type === "A") {
      try {
        const res = await approveHandler(
          tokenA,
          Math.ceil(tokenAAmount),
          signer
        );
        if (res) {
          toast.success(tokenA.symbol + " has been approved successfuly");
          setTokenAAllowance(Math.ceil(tokenAAmount));
          setStatus({ ...status, approve: false });
        } else {
          setStatus({ ...status, approve: false });
        }
      } catch (error) {
        toast.error(error);
        setStatus({ ...status, approve: false });
      }
    } else {
      try {
        const res = await approveHandler(
          tokenB,
          Math.ceil(tokenBAmount),
          signer
        );
        if (res) {
          toast.success(tokenB.symbol + " has been approved successfuly");
          setTokenBAllowance(Math.ceil(tokenBAmount));
          setStatus({ ...status, approve: false });
        } else {
          setStatus({ ...status, approve: false });
        }
      } catch (error) {
        toast.error(error);
        setStatus({ ...status, approve: false });
      }
    }
  };

  const supply = async () => {
    setStatus({ ...status, supply: true });
    try {
      const amount_in = fromReadableAmount(tokenAAmount, tokenA.decimals);
      const amount_out = fromReadableAmount(tokenBAmount, tokenB.decimals);

      if (tokenA.symbol === "WBNB") {
        await contracts.routerSigner.addLiquidityETH(
          tokenB.address,
          amount_out,
          0,
          0,
          address,
          Date.now() + 10 * 60,
          {
            value: amount_in,
          }
        );
      } else if (tokenB.address === "WBNB") {
        await contracts.routerSigner.addLiquidityETH(
          tokenA.address,
          amount_in,
          0,
          0,
          address,
          Date.now() + 10 * 60,
          {
            value: amount_out,
          }
        );
      } else {
        await contracts.routerSigner.addLiquidity(
          tokenA.address,
          tokenB.address,
          amount_in,
          amount_out,
          0,
          0,
          address,
          Date.now() + 10 * 60
        );
      }
      toast.success("Lquidity has been added successfully");
      setStatus({ ...status, supply: false });
    } catch (e) {
      toast.error(e.reason);
      setStatus({ ...status, supply: false });
    }
  };

  const clearTimer = () => {
    clearTimeout(typingTimer);
  };

  const setTimer = (amount, type) => {
    clearTimeout(typingTimer);
    const timer = setTimeout(() => {
      checkPrice(Number(amount), type);
    }, 50);
    setTypingTimer(timer);
  };

  const newPair = async () => {
    try {
      setStatus({ ...status, pairCreating: true });
      const res = await createPair(
        tokenA.address,
        tokenB.address,
        contracts.factorySigner
      );
      if (res) {
        setPair(res);
        toast.success("New Pair is created successfuly");
      }
      setStatus({ ...status, pairCreating: false });
    } catch (e) {
      setPair("");
      setStatus({ ...status, pairCreating: false });
    }
  };

  useEffect(() => {
    if (tokenA && tokenB && contracts) {
      checkValidPair(tokenA, tokenB);
    }
  }, [tokenA, tokenB, contracts]);

  useEffect(() => {
    checkAllowance(tokenA, "A");
  }, [tokenA]);

  useEffect(() => {
    checkAllowance(tokenB, "B");
  }, [tokenB]);

  return (
    <div className="flex justify-center">
      <div className="card">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <button
              className="action_btn"
              onClick={() => props.handleSupply(false)}
            >
              <img src="/assets/arrow.png" alt="" />
            </button>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="block">
              <h1 className="text-center text-yellow-main text-2xl">
                {tokenA.symbol} - {tokenB.symbol} LP
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
        <p className="text-center text-gray-400 mb-4">
          Receive LP tokens and earn trading fees
        </p>
        <div className="block pt-3">
          <TokenSelect
            type="A"
            selectOnly={false}
            token={tokenA}
            amount={tokenAAmount}
            insufficient={status.insufficientA}
            setOpen={setOpenA}
            setAmount={setTokenAAmount}
            setStates={handleSetTokenAAvailable}
            setInsufficient={handleSetInsufficientA}
            clearTimer={clearTimer}
            setTimer={setTimer}
          />

          <div className="flex justify-center">
            <div className="swap_btn_box text-yellow-main text-5xl">+</div>
          </div>

          <TokenSelect
            type="B"
            selectOnly={false}
            token={tokenB}
            amount={tokenBAmount}
            insufficient={status.insufficientB}
            setOpen={setOpenB}
            setAmount={setTokenBAmount}
            setStates={handleSetTokenBAvailable}
            setInsufficient={handleSetInsufficientB}
            clearTimer={clearTimer}
            setTimer={setTimer}
          />

          <SubmitButton
            type="supply"
            pairLoading={pairLoading}
            pair={pair}
            status={status}
            tokenA={tokenA}
            tokenAAmount={tokenAAmount}
            tokenAAllowance={tokenAAllowance}
            tokenB={tokenB}
            tokenBAllowance={tokenBAllowance}
            tokenBAmount={tokenBAmount}
            approve={approve}
            supply={supply}
            newPair={newPair}
          />

          <div className="flex justify-between items-center py-6">
            <div className="flex-1">
              <h1 className="text-base text-yellow-main">
                {tokenA.symbol} per {tokenB.symbol}
              </h1>
              <p className="text-gray-400 text-sm">
                {tokenAAmount / tokenBAmount
                  ? tokenAAmount / tokenBAmount
                  : "-"}
              </p>
            </div>
            <div className="flex-1">
              <h1 className="text-base text-yellow-main text-center">
                {tokenB.symbol} per {tokenA.symbol}
              </h1>
              <p className="text-gray-400 text-sm text-center">
                {tokenBAmount / tokenAAmount
                  ? tokenBAmount / tokenAAmount
                  : "-"}
              </p>
            </div>
            <div className="flex-1">
              <h1 className="text-base text-yellow-main text-end">
                Share of Pool
              </h1>
              <p className="text-gray-400 text-sm text-end">0%</p>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-b border-gray-600 py-4">
            <p className="text-yellow-main text-base">LP reward APR</p>
            <p className="text-yellow-main text-base">0.5%</p>
          </div>
          <div className="flex justify-between items-center border-b border-gray-600 py-6">
            <p className="text-yellow-main text-base">Slippage Tolerance</p>
            <p className="text-yellow-main text-base">2.39%</p>
          </div>
        </div>
      </div>
      {/* TokenA modal */}
      <TokenSelectModal
        open={openA}
        closeModal={closeModalA}
        setToken={handleSetTokenA}
        disableAddress={tokenB?.address}
      />
      {/* TokenB modal */}
      <TokenSelectModal
        open={openB}
        closeModal={closeModalB}
        setToken={handleSetTokenB}
        disableAddress={tokenA?.address}
      />
    </div>
  );
}
