pragma solidity ^0.4.2;

import "ConvertLib.sol"; 


contract Project {

	uint constant version_major = 0;
	uint constant version_minor = 1;

	// Stakeholders
    address owner;
    address contributer;

	// Project info
    uint amount_goal;
    uint amount_raised;


	// Constructor function
	function Project() {

        owner 		    = msg.sender;
        amount_goal     = 0;
        amount_raised   = 0;
	}



// ---------- Debug only ------------------------------------------- //

	function reset() {

        amount_goal     = 0;
        amount_raised   = 0;
	}

// ----------------------------------------------------------------- //


	function fund() payable {

		contributer = msg.sender;
		amount_raised += msg.value;
	}


// Data 

	function setAmountGoal(uint num) {
	    amount_goal = num;
	}
	
	function getAmountGoal() returns(uint) {
		return amount_goal;
	}
	
	function getAmountRaised() returns(uint) {
		return amount_raised;
	}
	


// Stakeholders

	function getOwner() returns(address) {
		return owner;
	}
	
}

