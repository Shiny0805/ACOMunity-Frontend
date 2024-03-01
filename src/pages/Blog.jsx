import React, { useState, useEffect } from "react";
import TokenSelect from "components/TokenSelect";
import TokenSelectModal from "components/TokenSelectModal";
import { getErc20Contract, getLpContract } from "utils/contractHelpers";
import { useEthersSigner } from "hooks/useEthers";
import { liquidityList } from "config/farms";
import { useRouterContract } from "hooks/useContract";
import { didUserReject } from "utils/customHelpers";
import { notify } from "utils/toastHelper";
import { useAccount } from "wagmi";
import { fromReadableAmount, toReadableAmount } from "utils/customHelpers";
import { ethers } from "ethers";
import { getRouterAddress } from "utils/addressHelpers";
import Loading from "components/Loading";

export default function Blog() {
  const [states, setStates] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [openC, setOpenC] = useState(false);
  const [tokenA, setTokenA] = useState(liquidityList[2]);
  const [tokenB, setTokenB] = useState(liquidityList[0]);
  const [removeToken, setRemoveToken] = useState(liquidityList[3]);
  const [tokenAAmount, setTokenAAmount] = useState("");
  const [tokenBAmount, setTokenBAmount] = useState("");
  const [removeTokenAmount, setRemoveTokenAmount] = useState("");

  const [active, setActive] = useState(0);
  const [pendingFromApproveTx, setPendingFromApproveTx] = useState(false);
  const [pendingToApproveTx, setPendingToApproveTx] = useState(false);
  const [pendingRemoveApproveTx, setPendingRemoveApproveTx] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);
  const [pendingRemoveTx, setPendingRemoveTx] = useState(false);
  const [allowanceFrom, setAllowanceFrom] = useState(0);
  const [allowanceTo, setAllowanceTo] = useState(0);
  const [allowanceRemove, setAllowanceRemove] = useState(0);
  const [direction, setDirection] = useState("sell");

  const { address } = useAccount();
  const signer = useEthersSigner();
  const routerContract = useRouterContract();
  const routerAddress = getRouterAddress();

  const [status, setStatus] = useState({
    insufficientA: false,
    insufficientB: false,
    insufficientC: false,
    tokenA: false,
    tokenB: false,
    loading: false,
    approve: false,
  });

  const refresh = () => {
    setTokenAAmount("");
    setTokenBAmount("");
    setRemoveTokenAmount("");
  };

  const getAllowance = async (token, type) => {
    let tokenContract;
    if (type === "remove") {
      tokenContract = getLpContract(token.lpAddresses, signer);
      const tokenAllowance = await tokenContract.allowance(
        address,
        routerAddress,
        {
          from: address,
        }
      );
      setAllowanceRemove(tokenAllowance.toString());
    } else {
      tokenContract = getErc20Contract(token.lpAddresses, signer);
      const tokenAllowance = await tokenContract.allowance(
        address,
        routerAddress,
        {
          from: address,
        }
      );
      if (type === "from") setAllowanceFrom(tokenAllowance.toString());
      else setAllowanceTo(tokenAllowance.toString());
    }
  };

  const handleApproveFromToken = async () => {
    try {
      if (
        Number(ethers.utils.formatUnits(allowanceFrom, "ether")) <
        Number(tokenAAmount)
      ) {
        console.log("approving...");
        setPendingFromApproveTx(true);
        let tokenContract;
        tokenContract = getErc20Contract(tokenA.lpAddresses, signer);
        await tokenContract.approve(
          routerAddress,
          ethers.constants.MaxUint256,
          {
            from: address,
          }
        );
        setPendingFromApproveTx(false);
        getAllowance(tokenA, "from");
      }
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      }
      setPendingFromApproveTx(false);
    }
  };

  const handleApproveToToken = async () => {
    try {
      if (
        Number(ethers.utils.formatUnits(allowanceTo, "ether")) <
        Number(tokenBAmount)
      ) {
        console.log("approving...");
        setPendingToApproveTx(true);
        let tokenContract;
        tokenContract = getErc20Contract(tokenB.lpAddresses, signer);
        await tokenContract.approve(
          routerAddress,
          ethers.constants.MaxUint256,
          {
            from: address,
          }
        );
        setPendingToApproveTx(false);
        getAllowance(tokenB, "to");
      }
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      }
      setPendingToApproveTx(false);
    }
  };

  const handleApproveRemoveToken = async () => {
    try {
      if (
        Number(ethers.utils.formatUnits(allowanceRemove, "ether")) <
        Number(removeTokenAmount)
      ) {
        console.log("approving...");
        setPendingRemoveApproveTx(true);
        let tokenContract;
        tokenContract = getLpContract(removeToken.lpAddresses, signer);
        await tokenContract.approve(
          routerAddress,
          ethers.constants.MaxUint256,
          {
            from: address,
          }
        );
        setPendingRemoveApproveTx(false);
        getAllowance(removeToken, "remove");
      }
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      }
      setPendingRemoveApproveTx(false);
    }
  };

  const getAmount = async (amount, type) => {
    const amount_in = fromReadableAmount(amount, 18);
    try {
      if (type === "sell") {
        const amount_out = await routerContract.getAmountsOut(amount_in, [
          tokenA?.lpAddresses,
          tokenB?.lpAddresses,
        ]);
        setTokenBAmount(toReadableAmount(amount_out[1], 18));
      } else {
        const amount_out = await routerContract.getAmountsIn(amount_in, [
          tokenA?.lpAddresses,
          tokenB?.lpAddresses,
        ]);
        setTokenAAmount(toReadableAmount(amount_out[0], 18));
      }
    } catch (e) {
      console.log(e);
      return "unkown";
    }
  };

  const handleAddLiquidity = async () => {
    if (pendingTx) return;
    setPendingTx(true);
    try {
      console.log("adding liquidity...");
      const tx = await routerContract.addLiquidity(
        tokenA.lpAddresses,
        tokenB.lpAddresses,
        fromReadableAmount(tokenAAmount, 18),
        fromReadableAmount(tokenBAmount, 18),
        "0",
        "0",
        address,
        Date.now() + 400,
        {
          from: address,
        }
      );
      await tx.wait();
      refresh();
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      }
    }
    setPendingTx(false);
  };
  const handleRemoveLiquidity = async () => {
    if (pendingRemoveTx) return;
    setPendingRemoveTx(true);
    try {
      console.log("removing liquidity...");
      const tx = await routerContract.removeLiquidity(
        tokenA.lpAddresses,
        tokenB.lpAddresses,
        fromReadableAmount(removeTokenAmount, 18),
        "0",
        "0",
        address,
        Date.now() + 400,
        {
          from: address,
        }
      );
      await tx.wait();
      refresh();
      setActive(0);
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      }
    }
    setPendingRemoveTx(false);
  };
  const closeModalA = () => {
    setOpenA(false);
  };

  const closeModalB = () => {
    setOpenB(false);
  };
  const closeModalC = () => {
    setOpenC(false);
  };

  const handleSetInsufficientA = (flag) => {
    setStatus({ ...status, insufficientA: flag });
  };

  const handleSetInsufficientB = (flag) => {
    setStatus({ ...status, insufficientB: flag });
  };
  const handleSetInsufficientC = (flag) => {
    setStatus({ ...status, insufficientC: flag });
  };
  useEffect(() => {
    if (direction === "sell") {
      if (Number(tokenAAmount) === 0) {
        setTokenAAmount("");
        setTokenBAmount("");
      } else {
        getAmount(tokenAAmount, "sell");
      }
    }
  }, [tokenAAmount, direction]);

  useEffect(() => {
    if (direction === "buy") {
      if (Number(tokenBAmount) === 0) {
        setTokenAAmount("");
        setTokenBAmount("");
      } else {
        getAmount(tokenBAmount, "buy");
      }
    }
  }, [tokenBAmount, direction]);

  useEffect(() => {
    if (address && signer) {
      getAllowance(tokenA, "from");
      getAllowance(tokenB, "to");
      getAllowance(tokenB, "remove");
    }
  }, [address, signer]);

  return (
    <div className="flex justify-center items-center flex-col  min-h-[calc(100vh-200px)] w-full px-5">
      <div className="tab">
        <div className="flex justify-center">
          <div className="tab_panel">
            <div
              className={`tab_button ${active === 0 ? "active" : ""}`}
              onClick={() => setActive(0)}
            >
              Add Liquidity
            </div>
            <div
              className={`tab_button ${active === 1 ? "active" : ""}`}
              onClick={() => setActive(1)}
            >
              Remove Liquidity
            </div>
          </div>
        </div>
        <div className="flex justify-center"></div>
      </div>
      {active === 0 ? (
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
              <button className="action_btn" onClick={refresh}>
                <img src="/assets/refresh.png" alt="" />
              </button>
            </div>
          </div>

          <p className="text-center text-gray-400">
            Receive LP tokens and earn trading fees
          </p>
          <div className="block w-full">
            <p className="text-sm text-gray-300">Select Token</p>
            <TokenSelect
              token={tokenA}
              setOpen={setOpenA}
              selectOnly={false}
              amount={tokenAAmount}
              setAmount={setTokenAAmount}
              setStates={setStates}
              setInsufficient={handleSetInsufficientA}
              setDirection={setDirection}
              tokenType="sell"
            />

            <div className="flex justify-center">
              <div className="swap_btn_box2">CHOOSE A VALID PAIR</div>
            </div>

            <TokenSelect
              token={tokenB}
              setOpen={setOpenB}
              amount={tokenBAmount}
              setAmount={setTokenBAmount}
              selectOnly={false}
              setStates={setStates}
              setInsufficient={handleSetInsufficientB}
              setDirection={setDirection}
              tokenType="buy"
            />
          </div>
          {Number(tokenAAmount) > 0 &&
          Number(allowanceFrom) <= Number(tokenAAmount) ? (
            <button
              className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
              onClick={handleApproveFromToken}
              disabled={pendingFromApproveTx}
            >
              {pendingFromApproveTx
                ? `Enabling ${tokenA.lpSymbol}`
                : `Enable ${tokenA.lpSymbol}`}
            </button>
          ) : (
            ""
          )}
          {Number(tokenBAmount) > 0 &&
          Number(allowanceTo) <= Number(tokenBAmount) ? (
            <button
              className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
              onClick={handleApproveToToken}
              disabled={pendingToApproveTx}
            >
              {pendingToApproveTx
                ? `Enabling ${tokenB.lpSymbol}`
                : `Enable ${tokenB.lpSymbol}`}
            </button>
          ) : (
            ""
          )}
          <button
            className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
            onClick={handleAddLiquidity}
            disabled={
              pendingTx ||
              Number(tokenAAmount) === 0 ||
              Number(tokenBAmount) === 0
            }
          >
            {pendingTx ? (
              <Loading title="Adding Liquidity..." />
            ) : (
              "Add Liquidity"
            )}
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              {/* <button className="action_btn"><img src="/assets/chart.png" alt="" /></button> */}
            </div>
            <div className=" flex justify-center items-center">
              <div className="">
                <h1 className="text-center text-yellow-main text-2xl">
                  Remove Liquidity
                </h1>
              </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
              <button className="action_btn" onClick={refresh}>
                <img src="/assets/refresh.png" alt="" />
              </button>
            </div>
          </div>

          <p className="text-center text-gray-400">
            Remove LP tokens and earn {tokenA.lpSymbol} and {tokenB.lpSymbol}
          </p>
          <div className="block w-full">
            <p className="text-sm text-gray-300">Select Token</p>
            <TokenSelect
              token={removeToken}
              setOpen={setOpenC}
              selectOnly={false}
              amount={removeTokenAmount}
              setAmount={setRemoveTokenAmount}
              setStates={setStates}
              setInsufficient={handleSetInsufficientC}
              setDirection={setDirection}
              tokenType=""
            />
          </div>
          {Number(removeTokenAmount) > 0 &&
          Number(allowanceRemove) <= Number(removeTokenAmount) ? (
            <button
              className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
              onClick={handleApproveRemoveToken}
              disabled={pendingRemoveApproveTx}
            >
              {pendingRemoveApproveTx
                ? `Enabling ${removeToken.lpSymbol}`
                : `Enable ${removeToken.lpSymbol}`}
            </button>
          ) : (
            ""
          )}
          <button
            className="custom_btn  mt-5 hover:bg-hover  flex justify-center disabled:opacity-50 disabled:hover:scale-100  w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
            onClick={handleRemoveLiquidity}
            disabled={pendingRemoveTx || Number(removeTokenAmount) === 0}
          >
            {pendingRemoveTx ? (
              <Loading title="Removing Liquidity..." />
            ) : (
              "Remove Liquidity"
            )}
          </button>
        </div>
      )}

      {/* TokenA modal */}
      <TokenSelectModal
        open={openA}
        closeModal={closeModalA}
        setToken={setTokenA}
        disabledToken={tokenA?.lpSymbol}
        tokens={[liquidityList[2]]}
      />
      {/* TokenB modal */}
      <TokenSelectModal
        open={openB}
        closeModal={closeModalB}
        setToken={setTokenB}
        disabledToken={tokenB?.lpSymbol}
        tokens={[liquidityList[0]]}
      />
      {/* TokenC modal */}
      <TokenSelectModal
        open={openC}
        closeModal={closeModalC}
        setToken={setRemoveToken}
        disabledToken={removeToken?.lpSymbol}
        tokens={[liquidityList[3]]}
      />
    </div>
  );
}
