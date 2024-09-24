"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { BiconomySmartAccountV2 } from "@biconomy/account";

interface Web3AuthContextType {
  smartAccount: BiconomySmartAccountV2 | null;
  setSmartAccount: (account: BiconomySmartAccountV2 | null) => void;
  smartAccountAddress: string | null;
  setSmartAccountAddress: (address: string | null) => void;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);

  return (
    <Web3AuthContext.Provider value={{ smartAccount, setSmartAccount, smartAccountAddress, setSmartAccountAddress }}>
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
