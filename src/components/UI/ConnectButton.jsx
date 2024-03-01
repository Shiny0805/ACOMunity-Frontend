import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaAngleDown } from "react-icons/fa";
export const WalletConnect = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
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
                    className="bt-yellow-main btn_connect m-2 sm:m-0 hover:bg-hover bg-orange transition ease-in-out"
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
                    className="bt-yellow-main btn_connect m-2 sm:m-0 hover:bg-red-500 bg-red-600  transition ease-in-out text-[white!important] flex justify-center items-center gap-1"
                  >
                    Wrong network
                    <FaAngleDown className="text-xl" />
                  </button>
                );
              }
              return (
                <div className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="w-[25.3px] h-[25px] mx-1"
                  />
                  <button
                    onClick={openChainModal}
                    className="hidden sm:inline-flex justify-center items-center hover:bg-hover bg-orange rounded-full  transition ease-in-out text-black text-xl"
                  >
                    {chain.iconUrl ? (
                      <img
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        className="h-[40px] w-[40px!important]"
                      />
                    ) : (
                      <>?</>
                    )}
                  </button>
                  <button
                    onClick={openAccountModal}
                    className="bt-yellow-main btn_connect m-2 sm:m-0 hover:bg-hover bg-orange transition ease-in-out flex justify-center items-center gap-1"
                    type="button"
                  >
                    {account.displayName}
                    <FaAngleDown className="text-xl" />
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
