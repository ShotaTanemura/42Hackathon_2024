"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const amount = 10;
  const [coins, setCoins] = useState<number[]>([]);
  const [isMinted, setIsMinted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const response: string | null = localStorage.getItem("response");
    alert(`response: ${response}`);
  });

  const handleMint = () => {
    console.log("$CBT has been minted!");
    setIsMinted(true);
    generateCoins();

    setTimeout(() => {
      router.push("/profile");
    }, 3000);
  };

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

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#D70F64] relative">
      <div className="text-white font-bold text-3xl mb-4">
        Thank you for your Delivery!
      </div>
      <div className="text-white font-bold text-xl mb-20 text-center">
        You can get {amount} $CBT <br /> for your eco-friendly drive
      </div>
      <button
        onClick={handleMint}
        className="px-6 py-3 bg-white text-[#D70F64] font-bold rounded-lg hover:bg-gray-200 transition"
        disabled={isMinted}
      >
        {isMinted ? "Minted Successfully" : `Mint ${amount} $CBT`}{" "}
        {/* ボタンのテキスト変更 */}
      </button>
      <div className="coin-container absolute w-full h-full top-0 left-0 pointer-events-none">
        {coins.map((coin, index) => (
          <div
            key={index}
            className="coin"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`, // 2秒〜5秒のランダムな時間
              transform: `translateY(${Math.random() * 300 + 100}%)`, // ランダムな距離
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
          width: 80px; /* 大きさを小さく */
          height: 80px;
          background: radial-gradient(
            circle,
            #ffd700,
            #ffa500
          ); /* 金色っぽい配色 */
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
          animation: floatUp 3s ease-in-out forwards;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: bold;
          font-size: 30px;
          opacity: 0;
        }
        .dollar {
          color: #fff700; /* ドル記号を少し明るい色に */
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
