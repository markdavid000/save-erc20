// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.9;

// contract ERC20 {
//     address owner;

//     string name = "MarkToken";

//     string symbol = "MT";

//     uint256 decimals = 18;

//     uint256 totalSupply;

//     mapping (address => uint256) balance;

//     mapping (address => mapping (address => uint256)) allowance;

//     event Transfer(address indexed from, address indexed to, uint256 value);

//     event Approval(address indexed owner, address indexed spender, uint256 value);

//     constructor(address _initialAddress, string memory _name, string memory _symbol ) {
//         owner = _initialAddress;

//         name = _name;

//         symbol = _symbol;

//         totalSupply = 100 * 10 ** 18;
        
//         balance[msg.sender] = totalSupply;
//     }

//     function transferLogic(address _from, address _to, uint _value) internal  {
//         require(_from != address(0), "Can't tranfer from 0 address");
//         require(_to != address(0), "No 0 address call");
//         require(_value > 0, "Can't transfer 0 value");
//         require(balance[msg.sender] >= _value, "Insuffient token");

//         uint256 fee = (balance[_from] * 10) / 100;

//         balance[_from] -= _value;
//         balance[_to] += _value;
//         totalSupply = fee;

//         emit Transfer(_from, _to, _value);
//     }

//     function transfer (address _to, uint _value) public returns (bool success) {
//         transferLogic(msg.sender, _to, _value);
//         return true;
//     }

//     function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
//         require(_value <= allowance[_from][msg.sender], "You've exceeded your allowance");

//         allowance[_from][msg.sender] -= _value;

//         transferLogic(_from, _to, _value);


//         return true;
//     }

//     function balanceOf (address _owner) public view returns (uint256 _balance) {
//         return balance[_owner];
//     } 

//     function approval(address _spender, uint256 _value) public returns (bool success) {
//         allowance[msg.sender][_spender] = _value;

//         emit Approval(msg.sender, _spender, _value);

//         return true;
//     }

//     function allowedBalance(address _owner, address _spender) public view returns (uint256 _allowedBalance) {
//         return allowance[_owner][_spender];
//     }
// }


pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Token is ERC20, Ownable {
    constructor(address initialAddress, string memory tokenName, string memory symbol)
        ERC20(tokenName, symbol)
        Ownable(initialAddress)
    {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}