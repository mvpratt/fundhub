pragma solidity ^0.4.2;

import "ConvertLib.sol"; 


contract Project {

	uint constant version_major = 0;
	uint constant version_minor = 1;

	// Stakeholders
	address creator;
    address owner;
    address contributer;

	// Project info
    uint amount_goal;

    // Project Status
    bool success;


	// Constructor function
	function Project() {

        creator		    = msg.sender;
        owner           = 0;
        amount_goal     = 0;
        success         = false;
	}



// ---------- Debug only ------------------------------------------- //

	//function reset() {

    //    amount_goal     = 0;
	//}
	
	function setOwner(address own) {
		owner = own;
	}

// ----------------------------------------------------------------- //


	function fund() payable {

		contributer = msg.sender;
	}

	function refund() {

		success = contributer.send(this.balance);
	}

	function payout() {

		success = owner.send(this.balance);
	}

// Data 

	function setAmountGoal(uint num) {
	    amount_goal = num;
	}
	
	function getAmountGoal() returns(uint) {
		return amount_goal;
	}
	
	function getAmountRaised() returns(uint) {
		return this.balance;
	}
	


// Stakeholders

	function getOwner() returns(address) {
		return owner;
	}
	
}

