// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
	<=== HOW TO USE ===>
	1. コントラクトをデプロイする際,初期供給量を指定(value * 18.)
	2. トークンを他のアドレスに送信するには,transfer関数を使用.
	3. 他のアドレスにトークンを移動させるために,allowanceを設定しapprove関数を使用.
	4. approveされたアドレスからトークンを転送するには,transferFrom関数を使用.
	5. 新しいトークンを発行するには,mint関数を使用（onlyOwner).
	6. トークンを焼却するには,burn関数を使用します.
*/
contract ft_MintableERC20Token {
	string public name = "FT_MINTABLE_TOKEN";
	string public symbol = "FMT";
	uint8 public decimals = 18;
	uint256 public totalSupply;

	mapping(address => uint256) public balanceOf;
	mapping(address => mapping(address => uint256)) public allowance;

	event Transfer(address indexed from, address indexed to, uint256 value);
	event Approval(address indexed owner, address indexed spender, uint256 value);

	address public owner;

	modifier onlyOwner() {
		require(msg.sender == owner, "Caller is not the owner");
		_;
	}

	constructor(uint256 _initialSupply) {
		owner = msg.sender;
		mint(msg.sender, _initialSupply);
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value, "Insufficient balance");
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	function approve(address _spender, uint256 _value) public returns (bool success) {
		allowance[msg.sender][_spender] = _value;
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
		require(_value <= balanceOf[_from], "Insufficient balance");
		require(_value <= allowance[_from][msg.sender], "Allowance exceeded");
		balanceOf[_from] -= _value;
		balanceOf[_to] += _value;
		allowance[_from][msg.sender] -= _value;
		emit Transfer(_from, _to, _value);
		return true;
	}

	function mint(address _to, uint256 _amount) public onlyOwner returns (bool success) {
		totalSupply += _amount;
		balanceOf[_to] += _amount;
		emit Transfer(address(0), _to, _amount);
		return true;
	}

	function burn(uint256 _amount) public returns (bool success) {
		require(balanceOf[msg.sender] >= _amount, "Insufficient balance");
		totalSupply -= _amount;
		balanceOf[msg.sender] -= _amount;
		emit Transfer(msg.sender, address(0), _amount);
		return true;
	}
}
