import React from 'react';

interface TransactionButtonsProps {
  getCountId: () => void;
  incrementCount: () => void;
  txnHash: string | null;
  explorerUrl: string;
  count: string | null;
}

const TransactionButtons: React.FC<TransactionButtonsProps> = ({ getCountId, incrementCount, txnHash, explorerUrl, count }) => {
  return (
    <div className="flex flex-row justify-between items-start gap-8">
      <div className="flex flex-col justify-center items-center gap-4">
        <button
          className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
          onClick={getCountId}
        >
          Get Count Id
        </button>
		<span>{count !== null ? `Current Count: ${count}` : 'Count not available'}</span>
        <span>{txnHash}</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <button
          className="w-[10rem] h-[3rem] bg-orange-300 text-black font-bold rounded-lg"
          onClick={incrementCount}
        >
          Increment Count
        </button>
        {txnHash && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${explorerUrl}${txnHash}`}
          >
            <span className="text-white font-bold underline">
              Txn Hash
            </span>
          </a>
        )}
      </div>
    </div>
  );
};

export default TransactionButtons;
