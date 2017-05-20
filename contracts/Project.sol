pragma solidity ^0.4.2;


contract Project {

    // Stakeholders
    address public creator;
    address public owner;

    // Project info
    uint public amount_goal;  // amount in Wei

    // Get status sucess/fail when send money
    bool success = false;

    // Funding deadline;
    //uint deadline;
    //uint duration; 
    //uint creation_time;


    // Contract state
    uint constant CREATED          = 0;   
    uint constant FUNDED           = 1;    
    uint constant DEADLINE_REACHED = 2;
    uint constant PAID_OUT         = 3;   
    //uint constant ERROR            = 4;     
    uint public state;


    // Funding contributions
    mapping(address => uint) public balances;


    // Events to help with debugging
    //event OnFund(address sender, uint amount);
    //event DeadlineReached ();
    //event FullyFunded ();
    //event LogWarning ();


    // Constructor function, run when the project is deployed
    function Project(address own, uint amt) {

        creator     = msg.sender;
        owner       = own;
        amount_goal = amt;
        state       = CREATED;
        //duration    = 1 day;
        //deadline    = now + duration;
        //creation_time = now;
    }

/*
    modifier onlyBy(address _account)
    {
        if (msg.sender != _account)
            throw;
        _;
    }
*/

// ---------- Debug only ------------------------------------------- //
/*
    function setOwner(address own) onlyBy(creator) {
        owner = own;
    }

    function DEBUG_setStateDeadlineReached() onlyBy(creator) {
    	state = DEADLINE_REACHED;
    	//DeadlineReached();
    }

    function setAmountGoal(uint num) {
    	if (msg.sender == owner && state == CREATED){
            amount_goal = num;
        }
        else {
            LogWarning();
        }
    }
*/
// ----------------------------------------------------------------- //


// Change project state

    function fund(address contrib) payable {

    	if (state == CREATED) {
            balances[contrib] += msg.value;

            if (this.balance >= amount_goal){
	            state = FUNDED;
	    //        FullyFunded();
            }
        }
        else if (state == FUNDED || state == DEADLINE_REACHED) {
        	success = msg.sender.send(msg.value);
        }
        //else {
        //    LogWarning();
        //}
        //OnFund(msg.sender, msg.value);
    }

    function refund() {
    	if (state == CREATED || state == DEADLINE_REACHED){
            success = msg.sender.send(balances[msg.sender]);
            balances[msg.sender] = 0;
        }
//        else {
//            LogWarning();
//        }
    }

    function payout() {
    	if ((msg.sender == creator || msg.sender == owner) && state == FUNDED){
            state = PAID_OUT;
            success = owner.send(this.balance);
        }
//        else {
//            LogWarning();
//        }
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

