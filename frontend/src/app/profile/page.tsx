'use client';

import React, { useState } from 'react';
import { User, Clock, MapPin, Package, MessageSquare, Percent, Wallet, Award, Leaf } from 'lucide-react';
import { ethers } from 'ethers';
import { PaymasterMode } from '@biconomy/account';
import { erc721ABI } from '@/contract/erc721ABI';
import { chains } from '@/conf/chains';
import { shortenWalletAddress } from '@/utils/shorten';
import { useWeb3Auth } from '@/context/web3AuthContext';
import { createSepoliaEtherscanLink } from '@/utils/etherscan'

const DeliveryProfile = () => {

  const { smartAccount, connect, smartAccountAddress } = useWeb3Auth()
  const [txStatus, setTxnStatus] = useState("not yet");

  const getButtonLabel = () => {
    switch (txStatus) {
        case "not yet":
            return "Issue Eco-Driver NFT";
        case "process":
            return "Tx Processing...";
        case "done":
            return "Issued Successfully";
        default:
            return "Unknown Status";
    }
  };


  const mintNFT = async () => {
    const tokenURI = 'ipfs://sample'; // Replace with your actual token URI
    const chainSelected = 0; // Update if you have chain selection logic

    setTxnStatus("process");

    const mintData = new ethers.utils.Interface(erc721ABI[0].abi).encodeFunctionData(
      'mintToken',
      [tokenURI]
    );

    const mintTx = {
      to: chains[chainSelected].erc721Contract,
      data: mintData,
      from: smartAccountAddress,
      gasLimit: 300000,
    };

    if (smartAccount) {
      try {
        const userOpResponse = await smartAccount.sendTransaction(mintTx, {
          paymasterServiceData: { mode: PaymasterMode.SPONSORED },
        });
        const { transactionHash } = await userOpResponse.waitForTxHash();
        setTxnStatus("done")
        // @ts-expect-error: this is any type
        console.log(createSepoliaEtherscanLink(transactionHash));
        // Optionally, you can update the UI or notify the user
      } catch (error) {
        console.error('Minting failed:', error);
      }
    } else {
      console.error('Smart account is not initialized.');
    }
  };
  return (
    <div className="h-screen flex flex-col bg-white relative">
      <div className="absolute top-4 right-4 flex items-center">
        <Wallet className="w-5 h-5 mr-2 text-gray-600" />
        <span className="text-sm text-gray-600">
        <span className="text-sm text-gray-600">
          {smartAccountAddress ? shortenWalletAddress(smartAccountAddress) : 'Not Connected'}
        </span>

        </span>
      </div>
      <div className="absolute top-4 left-4">
        <button
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          onClick={mintNFT}
          disabled={!smartAccount}
        >
          <Leaf className="w-5 h-5 mr-2" />
          <span className="text-sm font-semibold">{getButtonLabel()}</span>
        </button>
      </div>
      <div className="flex-grow flex flex-col justify-between p-4 text-center mr-5 ml-5 mt-16">
        <div>
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <div className="inline-block bg-blue-100 text-[#D70F64] px-2 py-1 rounded-full text-xs font-semibold mb-2">
            Platinum
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[#D70F64]">JODI</h2>
          <p className="text-gray-600 text-sm mb-4">174 Deliveries since May 2023</p>
          <div className="flex justify-between items-stretch w-full mb-6">
            <StatItem value="174" label="Deliveries" />
            <StatItem value="1000" label="$CBT Tokens" />
            <StatItem value="4.8" label="Safe Driving Level" />
            <StatItem value="100%" label="Satisfaction rate" />
          </div>
        </div>
        <div>
          <div className='flex justify-between items-center mb-2'>
            <h3 className="text-left text-lg font-semibold text-[#D70F64]">Coupons</h3>
            <div className="flex justify-center">
              <button className="px-6 py-2 bg-[#D70F64] text-white text-sm rounded-lg font-semibold hover:bg-[#B80D54] transition-colors">
                Exchange $CBT for Coupon
              </button>
            </div>
          </div>
          <div className="flex gap-4 mb-4 overflow-x-auto">
            <CouponBadge icon={Percent} discount="10%" description="10% off your next delivery" />
            <CouponBadge icon={Percent} discount="Free" description="Free delivery" />
            <CouponBadge icon={Percent} discount="15%" description="15% off on weekends" />
            <CouponBadge icon={Percent} discount="5%" description="5% off for regular customers" />
          </div>
        </div>
        <div>
          <h3 className="text-left text-lg font-semibold mb-4 text-[#D70F64]">Customer compliments</h3>
          <div className="flex justify-between mb-4">
            <ComplimentBadge icon={Clock} count={10} text="Quick and efficient" />
            <ComplimentBadge icon={MapPin} count={10} text="Great navigation" />
            <ComplimentBadge icon={Package} count={9} text="Careful with items" />
            <ComplimentBadge icon={MessageSquare} count={5} text="Great communication" />
          </div>
        </div>
      </div>
    </div>
  );
};

// @ts-expect-error: this is any type
const StatItem = ({ value, label }) => (
  <div className="flex flex-col items-center text-center flex-1 px-2">
    <p className="text-3xl font-bold text-[#D70F64]">{value}</p>
    <p className="text-gray-600 text-sm mt-1">{label}</p>
  </div>
);

// @ts-expect-error: this is any type
const CouponBadge = ({ icon: Icon, discount, description }) => (
  <div className="flex flex-col items-center text-center border p-4 rounded-lg shadow-sm min-w-[120px]">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
      <Icon className="w-6 h-6 text-[#D70F64]" />
    </div>
    <p className="text-lg font-semibold text-[#D70F64]">{discount}</p>
    <p className="text-gray-600 text-xs">{description}</p>
  </div>
);

// @ts-expect-error: this is any type
const ComplimentBadge = ({ icon: Icon, count, text }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#D70F64]" />
      </div>
      <div className="absolute -top-1 -right-1 bg-[#D70F64] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
        {count}
      </div>
    </div>
    <p className="text-xs text-gray-600 mt-1 max-w-[60px] text-center">{text}</p>
  </div>
);

export default DeliveryProfile;