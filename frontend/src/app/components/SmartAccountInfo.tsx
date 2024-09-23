import React from 'react';

interface SmartAccountInfoProps {
  smartAccountAddress: string | null;
  chainName: string;
}

const SmartAccountInfo: React.FC<SmartAccountInfoProps> = ({ smartAccountAddress, chainName }) => {
  return (
    <>
      <span>Smart Account Address</span>
      <span>{smartAccountAddress}</span>
      <span>Network: {chainName}</span>
    </>
  );
};

export default SmartAccountInfo;
