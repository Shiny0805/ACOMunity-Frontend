import React, { useState, useEffect } from "react";
import TokenDisplay from "components/TokenDisplay";
import { getZapAddress } from "utils/addressHelpers";
import farms from "config/farms";
import { useZapForFarm } from "hooks/useZap";
import Modal from "react-modal";
import { ethers } from "ethers";
import { ArrowForwardIcon } from "uikit";
import Loading from "components/Loading";
import { useTranslation } from "context/Localization";
import { useEthersSigner } from "hooks/useEthers";
import { useAccount } from "wagmi";
import { get3WiLDContract } from "utils/contractHelpers";
import { useHarvest } from "hooks/useHarvest";
import { notify } from "utils/toastHelper";
import { harvestMany } from "utils/callHelpers";
import { useMasterchef } from "hooks/useContract";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/farms";
import { getFarmFromPid } from "utils/farmHelpers";
import { didUserReject } from "utils/customHelpers";
import { sleep } from "utils/customHelpers";
import tokens from "config/tokens";
import { fromReadableAmount } from "utils";
import { getCounts } from "utils/limitHelper";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "#1F212A",
    color: "white",
    border: "none",
  },
};

export default function CompoundModal({
  open,
  closeModal,
  earnings,
  pid,
  isAll,
}) {
  const signer = useEthersSigner();
  const { t } = useTranslation();
  const [targetToken, setTargetToken] = useState(
    !isAll ? getFarmFromPid(pid[0]) : getFarmFromPid(0)
  );
  const [pendingZapTx, setZapPendingTx] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);

  const [currentCounts, setCurrentCounts] = useState(3);

  const { address } = useAccount();
  const zapAddress = getZapAddress();
  const wildXContract = get3WiLDContract(signer);
  const { onReward } = useHarvest(pid[0]);
  const { onZapForFarm } = useZapForFarm();
  const masterChefContract = useMasterchef();

  const getCurrentCounts = async (address) => {
    const currentDate = new Date().toLocaleDateString();
    const res = await getCounts(address);
    if (res.lastCalled !== currentDate) {
      setCurrentCounts(3);
    } else {
      setCurrentCounts(3 - res.counts);
    }
  };

  useEffect(() => {
    if (address) {
      getCurrentCounts(address);
    }
  }, [address]);

  // const [approve, setApprove] = useState(false);

  const dispatch = useAppDispatch();

  const getAllowance = async () => {
    setIsCheckingAllowance(true);
    const allowance = await wildXContract.allowance(address, zapAddress, {
      from: address,
    });
    setAllowance(allowance.toString());
    setIsCheckingAllowance(false);
    return Number(ethers.utils.formatUnits(allowance, "ether"));
  };

  async function handleApprove() {
    try {
      setIsApproving(true);
      const allowance = await wildXContract.allowance(address, zapAddress, {
        from: address,
      });
      if (
        Number(ethers.utils.formatUnits(allowance, "ether")) <
        Number(earnings.toString())
      ) {
        const tx = await wildXContract.approve(
          zapAddress,
          ethers.constants.MaxUint256,
          {
            from: address,
          }
        );
        await tx.wait();
      }
      setIsApproving(false);
    } catch (e) {
      console.log(e);
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setIsApproving(false);
    }
  }

  async function handleDeposit() {
    setZapPendingTx(true);
    try {
      if (isAll) {
        const res = await harvestMany(masterChefContract, pid, false, address);
        // const res = await onReward(false);
        if (res === false) {
          setZapPendingTx(false);
          return;
        }
      } else {
        const res = await onReward(false);
        if (res === false) {
          setZapPendingTx(false);
          return;
        }
      }
      await sleep(2000);

      const allowanceAfterHarvest = await getAllowance();
      if (allowanceAfterHarvest < Number(earnings)) {
        await handleApprove();
      }

      await onZapForFarm(
        tokens.wild.address,
        false,
        fromReadableAmount(earnings),
        targetToken.lpAddresses,
        targetToken.pid
      );

      dispatch(fetchFarmUserDataAsync({ account: address, pids: pid }));
      closeModal();
      setZapPendingTx(false);
    } catch (e) {
      if (didUserReject(e)) {
        notify("error", "User rejected transaction");
      } else {
        notify("error", e.reason);
      }
      setZapPendingTx(false);
    }
  }

  const handleChangeToken = (e, type) => {
    setTargetToken(farms[Number(e)]);
  };

  useEffect(() => {
    if (address && signer) {
      getAllowance();
    }
  }, [address, signer]);

  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="min-w-[350px] max-w-[500px] w-full p-6 rounded-lg">
        <div className="flex justify-around items-center">
          <img
            src={tokens.wild.logo}
            alt="token"
            className="rounded-full w-[60px] h-[60px] lg:w-[65px] lg:h-[65px] border-[3px] border-white mb-3"
          />
          <ArrowForwardIcon />
          <TokenDisplay token={targetToken} modal={true} />
        </div>
        {isAll ? (
          <>
            <p className="text-center text-gray-400 text-sm py-2">
              Select target pool.
            </p>
            <div className="bg-secondary-700 rounded-full p-2 flex mb-2">
              <select
                name="tokenA"
                className="bg-transparent focus-visible:outline-none w-full cursor-pointer"
                onChange={(e) => handleChangeToken(e.target.value)}
              >
                {farms.map((item, key) => {
                  if (item.lpSymbol === "WBNB-3WiLD")
                    return (
                      <option
                        key={key}
                        className="bg-secondary-700"
                        value={key}
                      >
                        {item?.lpSymbol}
                      </option>
                    );
                })}
              </select>
            </div>
          </>
        ) : (
          <></>
        )}

        <p className="text-center text-lg pt-4">
          Compound{" "}
          <span className="font-semibold text-green-500 mx-1">
            {tokens.wild.symbol}
          </span>
          into{" "}
          <span className="font-semibold text-green-500 mx-1">
            {targetToken?.lpSymbol}
          </span>{" "}
          Pool
        </p>
        <p className="text-center my-2">
          Available: {Number(earnings.toString()).toFixed(3)} 3WiLD
        </p>
        <div className="flex gap-3 pt-4">
          <button
            className="border border-gray-600 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px]"
            onClick={closeModal}
          >
            Cancel
          </button>
          {isCheckingAllowance ? (
            <button className="border flex justify-center disabled:opacity-50 disabled:hover:scale-100 border-secondary-700 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700">
              <Loading /> Loading...
            </button>
          ) : (
            <button
              onClick={handleDeposit}
              className="border disabled:opacity-50 disabled:hover:scale-100 border-secondary-700 w-full rounded-lg hover:scale-105 transition ease-in-out p-[8px] bg-secondary-700"
              disabled={
                Number(earnings) === 0 || pendingZapTx || currentCounts === 0
              }
            >
              {pendingZapTx ? <Loading /> : t("Compound")}
            </button>
          )}
        </div>

        {currentCounts === 0 ? (
          <p className="mt-2 text-red-600">
            You can not compound or harvest over 3 time(s) a day
          </p>
        ) : (
          <p className="mt-2">{`You are able to compound or harvest ${currentCounts} time(s) today.`}</p>
        )}
      </div>
    </Modal>
  );
}
