// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
	<=== HOW TO USE ===>
	1. コントラクトをデプロイ,デプロイヤーがオーナーとして登録.
	2. mintTokenを呼び出し,任意のトークンURIを渡して新しいトークンをmint(onlyOwner).
	3. totalSupplyを使用して,ミントされたトークンの総数を取得.
*/
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ft_ERC721Token is ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIdCounter;

	constructor() ERC721("42_NFT_SAMPLE", "4NS") {}

	function mintToken(string memory tokenURI) public onlyOwner {
		uint256 tokenId = _tokenIdCounter.current();
		_mint(msg.sender, tokenId);
		_setTokenURI(tokenId, tokenURI);
		_tokenIdCounter.increment();
	}

	function totalSupply() public view returns (uint256) {
		return _tokenIdCounter.current();
	}
}
