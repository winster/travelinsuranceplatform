pragma solidity ^0.4.24;

import "./ConvertLib.sol";
import "./Mortal.sol";


contract LostBaggageClaim is Mortal{
	
	mapping(address => Permission) public myAddressMapping;
	address[] public addressList;
    
    struct Permission {
        string contractName;
        uint permissionLevel;
    }
    

	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		//balances[tx.origin] = 10000;
	}

	function requestClaim(string baggageId, string recordLocator) public returns(bool sufficient) {
		//if (balances[msg.sender] < amount) return false;
		//balances[msg.sender] -= amount;
		//balances[receiver] += amount;
		//emit Transfer(msg.sender, receiver, amount);
		return true;
	}

	/*function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}*/

	function addAddressToNetwork(address addr, string contractName, uint permissionLevel) onlyowner {
		myAddressMapping[addr] = Permission(contractName, permissionLevel); 
		addressList.push(addr);
	}

	// Requires a public getter for array size
	function size() public returns (uint) {
	    return addressList.length;
	}
}
