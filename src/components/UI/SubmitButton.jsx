import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaArrowRight } from "react-icons/fa";

export const SubmitButton = (props) => {
  const handleSwap = () => {
    if (!props.pairLoading) {
      if (props.status.insufficientA) {
        return (
          <>
            <button
              disabled={true}
              className="custom_btn disabled:mb-[20px] mt-8 hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
            >
              Insufficient {props.tokenA.symbol} Token Balance
            </button>
          </>
        );
      } else {
        if (props.tokenAAmount > props.tokenAAllowance) {
          if (props.status.approve) {
            return (
              <>
                <button
                  disabled={true}
                  className="custom_btn mt-10 mb-5 disabled:mb-[20px] disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                >
                  Approving...
                </button>
              </>
            );
          } else {
            return (
              <>
                <button
                  onClick={() => props.approve("A")}
                  className="custom_btn mt-10 mb-5 disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                >
                  Approve {props.tokenA.symbol} Token
                </button>
              </>
            );
          }
        } else {
          if (props.status.swap) {
            return (
              <>
                <button
                  disabled={true}
                  className="custom_btn mt-10 mb-5 hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange disabled:mb-[20px] disabled:mt-[40px]  flex justify-center items-center"
                >
                  Swaping...
                </button>
              </>
            );
          } else {
            return (
              <>
                <button
                  disabled={!props.tokenAAmount || !props.tokenBAmount}
                  onClick={props.handleSwap}
                  className="custom_btn mt-10 mb-5 hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange disabled:mb-[20px] disabled:mt-[40px]  flex justify-center items-center"
                >
                  Swap
                </button>
              </>
            );
          }
        }
      }
    } else {
      return (
        <button
          disabled={true}
          className="custom_btn mt-10 mb-5 hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange disabled:mb-[20px] disabled:mt-[40px]  flex justify-center items-center"
        >
          Checking pair...
        </button>
      );
    }
  };

  const handleAddLiquidity = () => {
    if (!props.loading.pair) {
      if (props.pair) {
        return (
          <button
            className="custom_btn mt-10 mb-5  hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
            onClick={props.moveToSupply}
          >
            Add Liquidity
          </button>
        );
      } else {
        if (props.loading.creatingPair) {
          return (
            <button
              disabled={true}
              className="custom_btn mt-10 mb-5  hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
            >
              Creating Pair...
            </button>
          );
        } else {
          return (
            <button
              onClick={props.newPair}
              className="custom_btn mt-10 mb-5  hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
            >
              Create a Pair Now
            </button>
          );
        }
      }
    } else {
      return (
        <button className="custom_btn mt-10 mb-5 transition ease-in-out opacity-50 flex justify-center items-center">
          Checking Pair...
        </button>
      );
    }
  };

  const handleSupplyLiquidity = () => {
    if (!props.pairLoading) {
      if (props.pair) {
        if (props.status.insufficientA) {
          return (
            <>
              <button
                disabled={true}
                className="custom_btn disabled:mb-[20px] mt-8 hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
              >
                Insufficient {props.tokenA.symbol} Token Balance
              </button>
            </>
          );
        } else if (props.status.insufficientB) {
          return (
            <>
              <button
                disabled={true}
                className="custom_btn mt-8 disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
              >
                Insufficient {props.tokenB.symbol} Token Balance
              </button>
            </>
          );
        } else {
          console.log(props.tokenAAmount, props.tokenAAllowance);
          if (props.tokenAAmount > props.tokenAAllowance) {
            if (props.status.approve) {
              return (
                <>
                  <button
                    disabled={true}
                    className="custom_btn mt-8 disabled:mb-[20px] disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                  >
                    Approving...
                  </button>
                </>
              );
            } else {
              return (
                <>
                  <button
                    onClick={() => props.approve("A")}
                    className="custom_btn mt-8 disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                  >
                    Approve {props.tokenA.symbol} Token
                  </button>
                </>
              );
            }
          } else if (props.tokenBAmount > props.tokenBAllowance) {
            if (props.status.approve) {
              return (
                <>
                  <button
                    disabled={true}
                    className="custom_btn mt-8 disabled:mb-[20px] disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                  >
                    Approving...
                  </button>
                </>
              );
            } else {
              return (
                <>
                  <button
                    onClick={() => props.approve("B")}
                    className="custom_btn mt-8 disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                  >
                    Approve {props.tokenB.symbol} Token
                  </button>
                </>
              );
            }
          } else {
            if (props.status.supply) {
              return (
                <>
                  <button
                    disabled={true}
                    className="custom_btn mt-8 disabled:mb-[20px] disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                  >
                    Suppling...
                  </button>
                </>
              );
            } else {
              return (
                <>
                  <button
                    disabled={!props.tokenAAmount || !props.tokenBAmount}
                    onClick={props.supply}
                    className="custom_btn mt-8 disabled:mt-[40px] hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange  flex justify-center items-center"
                  >
                    Supply
                  </button>
                </>
              );
            }
          }
        }
      } else {
        if (props.status.pairCreating) {
          return (
            <button
              disabled={true}
              className="custom_btn mt-10 mb-5  hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
            >
              Creating Pair...
            </button>
          );
        } else {
          return (
            <button
              onClick={props.newPair}
              className="custom_btn mt-10 mb-5  hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
            >
              Create a Pair Now
            </button>
          );
        }
      }
    } else {
      return (
        <button
          disabled={true}
          className="custom_btn mt-8 hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange disabled:mb-[20px] disabled:mt-[40px]  flex justify-center items-center"
        >
          Checking pair...
        </button>
      );
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        openChainModal,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you`
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="custom_btn mt-10 mb-5  hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="custom_btn mt-10 mb-5 group hover:bg-hover transition ease-in-out disabled:opacity-50 disabled:hover:bg-orange flex justify-center items-center"
                  >
                    Connect to Binance &nbsp;
                    <FaArrowRight className="text-xl group-hover:ml-2 transition ease ease-in-out delay-3000" />
                  </button>
                );
              }
              if (props.type === "swap") {
                return <>{handleSwap()}</>;
              } else if (props.type === "add") {
                return <>{handleAddLiquidity()}</>;
              } else {
                return <>{handleSupplyLiquidity()}</>;
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
