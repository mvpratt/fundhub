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

    // Funding deadline;
    uint deadline;

    // Contract state
    uint constant CREATED          = 0;   
    uint constant FUNDED           = 1;    
    uint constant DEADLINE_REACHED = 2;   
    uint constant ERROR            = 3;     
    uint state;

    // Funding contributions
    mapping(address => uint) public balances;


    // Constructor function
    function Project() {

        creator     = msg.sender;
        owner       = 0;
        amount_goal = 0;
        success     = false;
        deadline    = 0;
        state       = CREATED;
    }


// ---------- Debug only ------------------------------------------- //

    function setOwner(address own) {
    	if (msg.sender == creator)
            owner = own;
    }

// ----------------------------------------------------------------- //


// Change project state

    function fund(address contrib) payable {

    	if (state == CREATED) {
            balances[contrib] += msg.value;

            if (this.balance >= amount_goal){
	            state = FUNDED;
            }
        }
        else if (state == FUNDED || state == DEADLINE_REACHED) {
        	success = msg.sender.send(msg.value);
        }
    }

    function refund() {
    	if (state == CREATED){
            success = msg.sender.send(balances[msg.sender]);
            balances[msg.sender] = 0;
        }
    }

    function payout() {
    	if ((msg.sender == creator || msg.sender == owner) && state == FUNDED){
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
	
	function getState() returns(uint) {
        return state;
    }

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

