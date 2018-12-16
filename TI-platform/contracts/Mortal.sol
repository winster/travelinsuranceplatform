pragma solidity ^0.4.24;

contract Mortal {
    address owner;
    
    modifier onlyowner() {
        if(msg.sender == owner) {
            _;
        } else {
            throw;
        }
    }
    
    function Mortal() public {
        owner = msg.sender;
    }
    
    function kill() public onlyowner{
        selfdestruct(owner);
    }
    
}
