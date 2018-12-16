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
    

	//event ClaimRequested(address indexed _from, string contractName, uint permissionLevel);
	event ClaimRequested(address indexed _from);
	event AddressAdded(address indexed addressAdded, string contractName, uint permissionLevel);

	constructor() public {
		//balances[tx.origin] = 10000;
	}

	function requestClaim(string baggageId, string recordLocator) public returns(bool sufficient) {
		emit ClaimRequested(msg.sender);
		if (myAddressMapping[msg.sender].permissionLevel==1) { //check each contractName and its permissions
			//emit ClaimRequested(msg.sender, myAddressMapping[msg.sender].contractName, myAddressMapping[msg.sender].permissionLevel);
			return true;
		} else {
			return false;
		}
	}

	/*function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}*/

	function addAddressToNetwork(address addressAdded, string contractName, uint permissionLevel) public returns(bool status){
		emit AddressAdded(addressAdded, contractName, permissionLevel);
		myAddressMapping[addressAdded] = Permission(contractName, permissionLevel); 
		addressList.push(addressAdded);
		return true;
	}

	// Requires a public getter for array size
	function size() public returns (uint) {
	    return addressList.length;
	}
}
