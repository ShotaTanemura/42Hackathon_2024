"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useWeb3Auth } from "@/context/web3AuthContext";
import { erc20ABI } from "@/contract/erc20ABI";
import { PaymasterMode } from "@biconomy/account";
import { createSepoliaEtherscanLink } from "@/utils/etherscan";

export default function ResultPage() {
  const [amount, setAmount] = useState(0);
  const [coins, setCoins] = useState<number[]>([]);
  const [isMinted, setIsMinted] = useState(false);
  const router = useRouter();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const response = localStorage.getItem("response");

    if (response) {
      try {
        const parsedResponse = JSON.parse(response);
        const fetchedScore = parsedResponse?.score ?? 0;
        setScore(fetchedScore);

        if (fetchedScore < 0) {
          setAmount(0);
        } else {
          setAmount(fetchedScore);
        }
      } catch (error) {
        console.error("Failed to parse localStorage response:", error);
        setScore(0);
        setAmount(0);
      }
    }
  }, []);

  const handleMint = async () => {
    if (!smartAccount || !smartAccountAddress) {
      alert("Smart account is not initialized.");
      return;
    }

    // Move generateCoins function here
    const generateCoins = () => {
      const newCoins: number[] = [];
      for (let i = 0; i < 20; i++) {
        newCoins.push(i);
      }
      setCoins(newCoins);

      setTimeout(() => {
        setCoins([]);
      }, 3000);
    };

    setTxnStatus("process");
    console.log("$CBT has been minted!");
    console.log("Smart Account Address:", smartAccountAddress);

    try {
      const erc20ContractAddress = process.env.NEXT_PUBLIC_SEPOLIA_ERC20_CONTRACT || "";
      const mintAmount = ethers.utils.parseUnits(amount.toString(), 18);
      const mintData = new ethers.utils.Interface(erc20ABI[0].abi).encodeFunctionData("mint", [
        smartAccountAddress,
        mintAmount,
      ]);
      const mintTx = {
        to: erc20ContractAddress,
        data: mintData,
        from: smartAccountAddress,
        gasLimit: 300000,
      };
      const userOpResponse = await smartAccount.sendTransaction(mintTx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });
      const { transactionHash } = await userOpResponse.waitForTxHash();
       // @ts-expect-error: this is any type
      console.log(createSepoliaEtherscanLink(transactionHash));
      setTxnStatus("done");
      setIsMinted(true);
      generateCoins(); // Now it's called after declaration
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } catch (error) {
      console.error("Mint failed:", error);
    }
  };

  const ecoAdvice = () => {
    if (amount === 0) {
      return (
        <div className="text-white font-bold text-xl mt-4">
          Your driving score is low, but don't worry! Here are some tips for eco-friendly driving:
          <ul className="mt-2">
            <li>🚗 Accelerate gently to reduce fuel consumption.</li>
            <li>🛑 Maintain a steady speed instead of frequently stopping and starting.</li>
            <li>🌍 Reduce idling time by turning off your engine when stopped for long periods.</li>
            <li>💨 Anticipate traffic flow to avoid sudden braking and acceleration.</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  const handleProfileRedirect = () => {
    router.push("/profile");
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#D70F64] relative">
      {/* 運転スコアを表示 */}
      <div className="text-white font-bold text-2xl mb-4 bg-black p-4 rounded-lg">
        Your Driving Score: {score}
      </div>

      <div className="text-white font-bold text-3xl mb-4">
        Thank you for your Delivery!
      </div>
      
      <div className="text-white font-bold text-xl mb-20 text-center">
        You can get {amount} $CBT <br /> for your eco-friendly drive
      </div>

      {ecoAdvice()} {/* エコ運転のアドバイスを表示 */}

      {/* amount > 0の場合のみミントボタンを表示 */}
      {amount > 0 ? (
        <button
          onClick={handleMint}
          className="px-6 py-3 bg-white text-[#D70F64] font-bold rounded-lg hover:bg-gray-200 transition"
          disabled={isMinted}
        >
          {isMinted ? "Minted Successfully" : `Mint ${amount} $CBT`}
        </button>
      ) : (
        <button
          onClick={handleProfileRedirect}
          className="px-6 py-3 bg-white text-[#D70F64] font-bold rounded-lg hover:bg-gray-200 transition"
        >
          Go to Profile
        </button>
      )}

      {/* コインアニメーション */}
      <div className="coin-container absolute w-full h-full top-0 left-0 pointer-events-none">
        {coins.map((coin, index) => (
          <div
            key={index}
            className="coin"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `translateY(${Math.random() * 300 + 100}%)`,
            }}
          >
            <span className="dollar">$</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .coin-container {
          overflow: hidden;
        }
        .coin {
          position: absolute;
          bottom: 0;
          width: 80px;
          height: 80px;
          background: radial-gradient(
            circle,
            #ffd700,
            #ffa500
          );
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          animation: floatUp 3s ease-in-out forwards;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-weight: bold;
          font-size: 30px;
          opacity: 0;
        }
        .dollar {
          color: #fff700;
        }
        @keyframes floatUp {
          0% {
            opacity: 1;
          }
          100% {
            transform: translateY(-300%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
