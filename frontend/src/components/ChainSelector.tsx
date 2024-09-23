import React from 'react';

interface ChainSelectorProps {
  chainSelected: number;
  setChainSelected: (index: number) => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ chainSelected, setChainSelected }) => {
  return (
    <div className="flex flex-row justify-center items-center gap-4">
      <div
        className={`w-[8rem] h-[3rem] cursor-pointer rounded-lg flex flex-row justify-center items-center text-white ${
          chainSelected === 0 ? "bg-orange-600" : "bg-black"
        } border-2 border-solid border-orange-400`}
        onClick={() => setChainSelected(0)}
      >
        Eth Sepolia
      </div>
      <div
        className={`w-[8rem] h-[3rem] cursor-pointer rounded-lg flex flex-row justify-center items-center text-white ${
          chainSelected === 1 ? "bg-orange-600" : "bg-black"
        } border-2 border-solid border-orange-400`}
        onClick={() => setChainSelected(1)}
      >
        Poly Amoy
      </div>
    </div>
  );
};

export default ChainSelector;
