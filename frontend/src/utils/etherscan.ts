export function createSepoliaEtherscanLink(address: string) {
  const baseUrl = 'https://sepolia.etherscan.io/tx/';
  return `${baseUrl}${address}`;
}