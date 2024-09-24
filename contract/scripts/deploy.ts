import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
	const initialSupply = ethers.parseUnits("42", 18);
    console.log("Deploying contracts with the account:", deployer.address);

	const ERC721 = await ethers.getContractFactory("ft_ERC721Token");
	const erc721 = await ERC721.deploy(deployer);
	await erc721.waitForDeployment();
	console.log("ERC721 deployed to:", await erc721.getAddress());

	const ERC20 = await ethers.getContractFactory("ft_ERC20Token");
	const erc20 = await ERC20.deploy(initialSupply);
	await erc20.waitForDeployment();
	console.log("ERC20 deployed to:", await erc20.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});