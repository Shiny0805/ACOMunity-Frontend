import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { ContractContext } from "context/contracts";
import { tokens } from "config/tokens";
import TokenSelectModal from "./TokenSelectModal";
import TokenSelect from "./TokenSelect";
import {
  getPrice,
  getAllowance,
  approveHandler,
  fromReadableAmount,
  getValidPair,
} from "utils";
import { getRouterAddress } from "utils/addressHelper";
import { useAccount, useNetwork } from "wagmi";
import { useEthersProvider, useEthersSigner } from "hooks/useEthers";
import toast from "react-hot-toast";
import { SubmitButton } from "./UI/SubmitButton";

export default function WildSwapCard() {
  const signer = useEthersSigner();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useEthersProvider();
  const contracts = useContext(ContractContext);
  const [status, setStatus] = useState({
    insufficientA: false,
    insufficientB: false,
    tokenA: false,
    tokenB: false,
    loading: false,
    swap: false,
    approve: false,
  });
  const [pairLoading, setPairLoading] = useState(true);

  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenA, setTokenA] = useState(tokens[1]);
  const [tokenB, setTokenB] = useState(tokens[2]);
  const [tokenAAllowance, setTokenAAllowance] = useState(0);
  const [tokenBAllowance, setTokenBAllowance] = useState(0);
  const [tokenAAmount, setTokenAAmount] = useState(0);
  const [tokenBAmount, setTokenBAmount] = useState(0);
  const [typingTimer, setTypingTimer] = useState(0);
  const [pair, setPair] = useState("");
  const slippage = 0.1;

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

  const HandleReverse = () => {
    const tempTokenA = tokenA;
    setTokenA(tokenB);
    setTokenB(tempTokenA);
    setTokenAAmount(tokenBAmount);
    checkPrice(tokenBAmount, "A");
  };

  const checkPrice = async (amount, type) => {
    if (type === "A") {
      const res = await getPrice(
        tokenA,
        tokenB,
        amount,
        type,
        contracts.routerProvider
      );
      if (res !== "unkown") setTokenBAmount(res);
    } else {
      const res = await getPrice(
        tokenB,
        tokenA,
        amount,
        type,
        contracts.routerProvider
      );
      if (res !== "unkown") setTokenAAmount(res);
    }
  };

  const clearTimer = () => {
    clearTimeout(typingTimer);
  };

  const setTimer = (amount, type) => {
    if (Number(amount) !== 0 || !amount) {
      clearTimeout(typingTimer);
      const timer = setTimeout(() => {
        checkPrice(Number(amount), type);
      }, 50);
      setTypingTimer(timer);
    } else {
      setTokenAAmount("");
      setTokenBAmount("");
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

  const checkAllowance = async (token, type) => {
    const res = await getAllowance(
      address,
      token,
      getRouterAddress(),
      provider
    );
    if (type === "A") {
      setTokenAAllowance(res);
    } else {
      setTokenBAllowance(res);
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

  const checkValidPair = async (tokenA, tokenB) => {
    setPair("");
    console.log(tokenA, tokenB, contracts.factoryProvider);
    try {
      setPairLoading(true);
      const newPair = await getValidPair(
        tokenA?.address,
        tokenB?.address,
        contracts.factoryProvider
      );
      setPairLoading(false);
      setPair(newPair);
      console.log(newPair, "true");
    } catch (e) {
      setPairLoading(false);
      console.log(e);
      console.log(pair, "false");
    }
  };

  const handleSwap = async () => {
    setStatus({ ...status, swap: true });
    if (tokenAAmount > tokenAAllowance) {
      const res = await approveHandler(
        tokenA,
        tokenAAmount - tokenAAllowance,
        signer
      );
      toast.success(tokenA.symbol + " has been approved successfuly");
      setTokenAAllowance(res);
    }

    if (tokenBAmount > tokenBAllowance) {
      const res = await approveHandler(
        tokenB,
        tokenBAmount - tokenBAllowance,
        signer
      );
      toast.success(tokenB.symbol + " has been approved successfuly");
      setTokenBAllowance(res);
    }

    try {
      const amount_in = fromReadableAmount(tokenAAmount, tokenA.decimals);
      let amount_out = await contracts.routerSigner.getAmountsOut(
        amount_in,
        [tokenA.address, tokenB.address],
        {
          from: address,
        }
      );
      amount_out = amount_out[1]?.toString();
      amount_out = Math.round(
        (amount_out * (100 - slippage)) / 100
      )?.toString();

      if (tokenA.address === "WBNB") {
        await contracts.routerSigner.swapExactETHForTokens(
          amount_out,
          [tokenA.address, tokenB.address],
          address,
          Date.now() + 10 * 60,
          {
            value: Web3.utils.toWei(tokenAAmount, "ether"),
          }
        );
      } else if (tokenB.address === "WBNB") {
        await contracts.routerSigner.swapExactTokensForETH(
          amount_in,
          amount_out,
          [tokenA.address, tokenB.address],
          address,
          Date.now() + 10 * 60
        );
      } else {
        await contracts.routerSigner.swapExactTokensForTokens(
          amount_in,
          amount_out,
          [tokenA.address, tokenB.address],
          address,
          Date.now() + 10 * 60
        );
        setStatus({ ...status, swap: false });
        toast.success(`Swapped successfully`);
      }
    } catch (e) {
      setStatus({ ...status, swap: false });
      toast.error(e);
      console.log(e);
    }
  };

  useEffect(() => {
    if (tokenA && tokenB && contracts?.factoryProvider) {
      checkValidPair(tokenA, tokenB);
    }
  }, [tokenA, tokenB, chain, contracts]);

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <button className="action_btn shadow-md shadow-black hover:bg-black  transition ease-in-out">
            <img src="/assets/chart.png" alt="" />
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="block">
            <h1 className="text-center text-yellow-main text-2xl">Wild Swap</h1>
          </div>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <button className="action_btn shadow-md shadow-black hover:bg-black  transition ease-in-out">
            <img src="/assets/refresh.png" alt="" />
          </button>
          <button className="action_btn shadow-md shadow-black hover:bg-black  transition ease-in-out ml-3">
            <img src="/assets/setting.png" alt="" />
          </button>
        </div>
      </div>
      <p className="text-center text-gray-400">Trade tokens in on instant</p>
      <div className="block">
        <p className="text-sm text-gray-300">You Pay</p>
        <TokenSelect
          type="A"
          token={tokenA}
          selectOnly={false}
          amount={tokenAAmount}
          setOpen={setOpenA}
          setAmount={setTokenAAmount}
          setStates={handleSetTokenAAvailable}
          clearTimer={clearTimer}
          setTimer={setTimer}
          setInsufficient={handleSetInsufficientA}
        />

        <div className="flex justify-center">
          <div className="swap_btn_box">
            <button
              onClick={HandleReverse}
              className="scale-100 hover:scale-110 transition ease-in-out"
            >
              <img
                className="w-7 transition ease-in-out"
                src="/assets/swap.png"
                alt=""
              />
            </button>
          </div>
        </div>

        <TokenSelect
          type="B"
          selectOnly={false}
          token={tokenB}
          amount={tokenBAmount}
          setOpen={setOpenB}
          setAmount={setTokenBAmount}
          pairLoading={pairLoading}
          setStates={handleSetTokenBAvailable}
          clearTimer={clearTimer}
          setTimer={setTimer}
          setInsufficient={handleSetInsufficientB}
        />

        <SubmitButton
          type="swap"
          tokenA={tokenA}
          tokenB={tokenB}
          status={status}
          tokenAAmount={tokenAAmount}
          tokenAAllowance={tokenAAllowance}
          tokenBAmount={tokenBAmount}
          tokenBAllowance={tokenBAllowance}
          pair={pair}
          pairLoading={pairLoading}
          handleSwap={handleSwap}
          approve={approve}
        />
      </div>
      <div className="block">
        <div className="p-3 bg-primary rounded-lg">
          <div className="token_select min-w-max mr-3 flex justify-between">
            <p className="text-sm text-gray-300">Slippage Tolerance</p>
            <p className="text-sm text-gray-300 font-semibold">0.0%</p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-3 sm:gap-10">
          <button className="connect_btn">
            <img src="/assets/metamask.svg" alt="" />
            &nbsp;CONNECT WALLET
          </button>
          <button className="connect_btn">
            <img src="/assets/walletconnector.svg" alt="" />
            &nbsp;CONNECT WALLET
          </button>
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
