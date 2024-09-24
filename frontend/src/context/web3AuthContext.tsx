"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { BiconomySmartAccountV2, createSmartAccountClient } from "@biconomy/account";
import { ethers, providers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { chains } from '@/conf/chains';

interface Web3AuthContextType {
  smartAccount: BiconomySmartAccountV2 | null;
  setSmartAccount: (account: BiconomySmartAccountV2 | null) => void;
  smartAccountAddress: string | null;
  setSmartAccountAddress: (address: string | null) => void;
  connect: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);

  const web3authClient = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

  const connect = async () => {
    try {
      // You can modify this chainConfig or make it dynamic based on your needs
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0xaa36a7",
        rpcTarget: chains[0].providerUrl,
        displayName: "Ethereum Sepolia",
        blockExplorer: "https://sepolia.etherscan.io/",
        ticker: "ETH",
        tickerName: "Ethereum",
      };

      const web3auth = new Web3Auth({
        clientId: web3authClient,
        web3AuthNetwork: "sapphire_devnet",
        chainConfig,
        uiConfig: {
          appName: "Biconomy X Web3Auth",
          mode: "dark",
          loginMethodsOrder: ["apple", "google", "twitter"],
          logoLight: "https://web3auth.io/images/web3auth-logo.svg",
          logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
          defaultLanguage: "en",
          loginGridCol: 3,
          primaryButton: "socialLogin",
        },
      });

      await web3auth.initModal();
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider as unknown as providers.ExternalProvider
      );
      const web3AuthSigner = ethersProvider.getSigner();

      const config = {
        biconomyPaymasterApiKey: chains[0].biconomyPaymasterApiKey,
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${chains[0].chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
      };

      const smartWallet = await createSmartAccountClient({
        signer: web3AuthSigner,
        biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        bundlerUrl: config.bundlerUrl,
        rpcUrl: chains[0].providerUrl,
        chainId: chains[0].chainId,
      });

      console.log("Biconomy Smart Account", smartWallet);
      setSmartAccount(smartWallet);
      const saAddress = await smartWallet.getAccountAddress();
      console.log("Smart Account Address", saAddress);
      setSmartAccountAddress(saAddress);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        smartAccount,
        setSmartAccount,
        smartAccountAddress,
        setSmartAccountAddress,
        connect,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};
