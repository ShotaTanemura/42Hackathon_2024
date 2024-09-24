// frontend/src/app/web3/page.tsx
"use client";

import React, { useState } from "react";
import { createSmartAccountClient, PaymasterMode } from "@biconomy/account";
import { ethers, providers } from "ethers";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { erc721ABI } from "@/contract/erc721ABI";
import { chains } from '@/conf/chains';
import "react-toastify/dist/ReactToastify.css";
import ChainSelector from "@/components/ChainSelector";
import SmartAccountInfo from "@/components/SmartAccountInfo";
import TransactionButtons from "@/components/TransactionButtons";
import { useWeb3Auth } from "@/context/web3AuthContext";

export default function Home() {
  const { smartAccount, setSmartAccount, smartAccountAddress, setSmartAccountAddress } = useWeb3Auth();
  // const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  // const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [txnHash, setTxnHash] = useState<string | null>(null);
  const [chainSelected, setChainSelected] = useState<number>(0);

  const web3authClient = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

  const connect = async () => {
    try {
      const chainConfig =
        chainSelected == 0
          ? {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0xaa36a7",
              rpcTarget: chains[chainSelected].providerUrl,
              displayName: "Ethereum Sepolia",
              blockExplorer: "https://sepolia.etherscan.io/",
              ticker: "ETH",
              tickerName: "Ethereum",
            }
          : {
              chainNamespace: CHAIN_NAMESPACES.EIP155,
              chainId: "0x13882",
              rpcTarget: chains[chainSelected].providerUrl,
              displayName: "Polygon Amoy",
              blockExplorer: "https://www.oklink.com/amoy/",
              ticker: "MATIC",
              tickerName: "Polygon Matic",
            };

      // //Creating web3auth instance
      const web3auth = new Web3Auth({
        clientId: web3authClient, // Get your Client ID from the Web3Auth Dashboard https://dashboard.web3auth.io/
        web3AuthNetwork: "sapphire_devnet", // Web3Auth Network
        chainConfig,
        uiConfig: {
          appName: "Biconomy X Web3Auth",
          mode: "dark", // light, dark or auto
          loginMethodsOrder: ["apple", "google", "twitter"],
          logoLight: "https://web3auth.io/images/web3auth-logo.svg",
          logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
          defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl
          loginGridCol: 3,
          primaryButton: "socialLogin", // "externalLogin" | "socialLogin" | "emailLogin"
        },
      });

      await web3auth.initModal();
      const web3authProvider = await web3auth.connect();
      const ethersProvider = new ethers.providers.Web3Provider(
        web3authProvider as unknown as providers.ExternalProvider
      );
      const web3AuthSigner = ethersProvider.getSigner();

      const config = {
        biconomyPaymasterApiKey: chains[chainSelected].biconomyPaymasterApiKey,
        bundlerUrl: `https://bundler.biconomy.io/api/v2/${chains[chainSelected].chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
      };

      const smartWallet = await createSmartAccountClient({
        signer: web3AuthSigner,
        biconomyPaymasterApiKey: config.biconomyPaymasterApiKey,
        bundlerUrl: config.bundlerUrl,
        rpcUrl: chains[chainSelected].providerUrl,
        chainId: chains[chainSelected].chainId,
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

  // minting
const mintNFT = async () => {
  const tokenURI = "ipfs://sample";

  const mintData = new ethers.utils.Interface(erc721ABI[0].abi)
    .encodeFunctionData("mintToken", [tokenURI]);
  const mintTx = {
    to: chains[chainSelected].erc721Contract,
    data: mintData,
    from: smartAccountAddress,
    gasLimit: 300000,
  };

  if (smartAccount) {
    const userOpResponse = await smartAccount.sendTransaction(mintTx, {
      paymasterServiceData: { mode: PaymasterMode.SPONSORED}
    });
    const { transactionHash } = await userOpResponse.waitForTxHash();
    console.log("Mint Transaction Hash:", transactionHash);
    setTxnHash(transactionHash || null);
  } else {
    console.error("Smart account is not initialized.");
  }
};

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-8 p-24">
      <div className="text-[4rem] font-bold text-orange-400">
        Biconomy-Web3Auth
      </div>
      {!smartAccount && (
        <>
          <ChainSelector chainSelected={chainSelected} setChainSelected={setChainSelected} />
          <button
            className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
            onClick={connect}
          >
            Web3Auth Sign in
          </button>
        </>
      )}

      {smartAccount && (
        <>
          <SmartAccountInfo smartAccountAddress={smartAccountAddress} chainName={chains[chainSelected].name} />
          <TransactionButtons
            txnHash={txnHash}
            explorerUrl={chains[chainSelected].explorerUrl}
			      mint={mintNFT}
          />
          <span className="text-white">Open console to view console logs.</span>
        </>
      )}
    </main>
  );
}
