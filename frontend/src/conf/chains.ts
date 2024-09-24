export interface Chain {
	chainId: number;
	name: string;
	providerUrl: string;
	erc721Contract: string;
	biconomyPaymasterApiKey: string;
	explorerUrl: string;
  }

export const chains: Chain[] = [
	{
	  chainId: 11155111,
	  name: "Ethereum Sepolia",
	  providerUrl: "https://eth-sepolia.public.blastapi.io",
	  erc721Contract: process.env.NEXT_PUBLIC_SEPOLIA_ERC721_CONTRACT || "0x5Fc68661918C7E31Df71d2F774A19B99184cBd29",
	  biconomyPaymasterApiKey: process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY || "",
	  explorerUrl: "https://sepolia.etherscan.io/tx/",
	},
	{
	  chainId: 80002,
	  name: "Polygon Amoy",
	  providerUrl: "https://rpc-amoy.polygon.technology/",
	  erc721Contract: "",
	  biconomyPaymasterApiKey: "",
	  explorerUrl: "https://www.oklink.com/amoy/tx/",
	},
  ];