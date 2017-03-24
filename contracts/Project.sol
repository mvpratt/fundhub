pragma solidity ^0.4.2;

import "ConvertLib.sol"; 


contract Project {

    uint constant version_major = 0;
    uint constant version_minor = 1;

    // Stakeholders
    address creator;
    address owner;

    // Project info
    uint amount_goal;  //amount in Wei

    // Project Status
    bool success;

    // Contract state
    uint constant CREATED          = 0;   
    uint constant FUNDED           = 1;    
    uint constant EXPIRED          = 2;   
    uint constant ERROR            = 3;     
    uint state;

    mapping(address => uint) public balances;


    // Constructor function
    function Project() {

        creator     = msg.sender;
        owner       = 0;
        amount_goal = 0;
        success     = false;
        state       = CREATED;
    }



// ---------- Debug only ------------------------------------------- //

    function setOwner(address own) {
    	if (msg.sender == creator)
            owner = own;
    }

// ----------------------------------------------------------------- //


// Change project state

    function getState() returns(uint) {
        return state;
    }

    function fund(address contrib) payable {

        balances[contrib] = msg.value;

        if (this.balance >= amount_goal){
	        state = FUNDED;
        }
    }

    function refund(address contrib) {
    	if (state != FUNDED){
            success = contrib.send(balances[contrib]);
        }
    }

    function payout() {
    	if (msg.sender == creator && state == FUNDED){
            success = owner.send(this.balance);
        }
    }


// Set Functions

    function setAmountGoal(uint num) {
    	if (msg.sender == owner && state == CREATED){
            amount_goal = num;
        }
    }

// Get Functions
	
    function getAmountGoal() returns(uint) {
        return amount_goal;
    }
	
    function getAmountRaised() returns(uint) {
        return this.balance;
    }
	
	function getAmountContributed(address contrib) returns(uint) {
        return balances[contrib];
    }

    function getOwner() returns(address) {
        return owner;
    }
	
	function getCreator() returns(address) {
        return creator;
    }

}

