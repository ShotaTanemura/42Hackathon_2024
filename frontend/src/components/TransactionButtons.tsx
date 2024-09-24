import React from 'react';

interface TransactionButtonsProps {
  mint: () => void;
  txnHash: string | null;
  explorerUrl: string;
}

const TransactionButtons: React.FC<TransactionButtonsProps> = ({ mint, txnHash, explorerUrl }) => {
  return (
    <div className="flex flex-row justify-between items-start gap-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <button
          className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
          onClick={mint}
        >
          mint
        </button>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        {txnHash && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${explorerUrl}${txnHash}`}
          >
            <span className="text-white font-bold underline">
              Tx Hash
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TransactionButtons;
