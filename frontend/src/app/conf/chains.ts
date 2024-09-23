export interface Chain {
	chainId: number;
	name: string;
	providerUrl: string;
	incrementCountContractAdd: string;
	biconomyPaymasterApiKey: string;
	explorerUrl: string;
  }

export const chains: Chain[] = [
	{
	  chainId: 11155111,
	  name: "Ethereum Sepolia",
	  providerUrl: "https://eth-sepolia.public.blastapi.io",
	  incrementCountContractAdd: "0xd9ea570eF1378D7B52887cE0342721E164062f5f",
	  biconomyPaymasterApiKey: "gJdVIBMSe.f6cc87ea-e351-449d-9736-c04c6fab56a2",
	  explorerUrl: "https://sepolia.etherscan.io/tx/",
	},
	{
	  chainId: 80002,
	  name: "Polygon Amoy",
	  providerUrl: "https://rpc-amoy.polygon.technology/",
	  incrementCountContractAdd: "0xfeec89eC2afD503FF359487967D02285f7DaA9aD",
	  biconomyPaymasterApiKey: "TVDdBH-yz.5040805f-d795-4078-9fd1-b668b8817642",
	  explorerUrl: "https://www.oklink.com/amoy/tx/",
	},
  ];