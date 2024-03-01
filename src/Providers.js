import React from "react";
import { ToastContainer } from "react-toastify";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, mainnet, bsc } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { RefreshContextProvider } from "context/RefreshContext";
import { ThemeContextProvider } from "context/ThemeContext";
import { LanguageProvider } from "context/Localization";
import { ModalProvider } from "uikit";

import { ALCHEMY_ID } from "config";
import store from "state";

const Providers = ({ children }) => {
  const { chains, publicClient } = configureChains(
    [bscTestnet, mainnet, bsc, ],
    [alchemyProvider({ apiKey: ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Deputy Dawgs NFT Marketplace",
    projectId: "824b57e445357ee91b5163b23daee199",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Provider store={store}>
          <HelmetProvider>
            <ThemeContextProvider>
              <LanguageProvider>
                <RefreshContextProvider>
                    <ModalProvider>{children}</ModalProvider>
                </RefreshContextProvider>
              </LanguageProvider>
            </ThemeContextProvider>
          </HelmetProvider>
          <ToastContainer />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Providers;
