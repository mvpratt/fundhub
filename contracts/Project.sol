pragma solidity ^0.4.2;


contract Project {

    struct Info {
      address owner; 
      uint amount_goal;  // in units of Wei
    }

    Info info;

    mapping(address => uint) public balances;      // Funding contributions
    address public creator;
    bool success = false;      // Get status success/fail when send money

    // Funding deadline;
    //uint deadline;
    //uint duration; 
    //uint creation_time;

    // Contract state
    uint constant CREATED          = 0;   
    uint constant FUNDED           = 1;    
    uint constant DEADLINE_REACHED = 2;
    uint constant PAID_OUT         = 3;   
    uint public state;

    // Events to help with debugging
    //event OnFund(address sender, uint amount);
    //event DeadlineReached ();
    //event FullyFunded ();
    //event LogWarning ();


    // Constructor function, run when the project is deployed
    function Project(address own, uint amt) {

        creator     = msg.sender;
        info        = Info(own, amt);
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

    function fund(address contrib) payable public {

    	if (state == CREATED) {
            balances[contrib] += msg.value;

            if (this.balance >= info.amount_goal){
	            state = FUNDED;
            }
        }
        else if (state == FUNDED || state == DEADLINE_REACHED) {
        	success = msg.sender.send(msg.value);
        }
    }

    function refund() public {
    	if (state == CREATED || state == DEADLINE_REACHED){
            success = msg.sender.send(balances[msg.sender]);
            balances[msg.sender] = 0;
        }
    }

    function payout() public {
    	if ((msg.sender == creator || msg.sender == info.owner) && state == FUNDED){
            state = PAID_OUT;
            success = info.owner.send(this.balance);
        }
    }


// Get Functions
	
	function getState() returns(uint) {
        return state;
    }

    function getAmountGoal() returns(uint) {
        return info.amount_goal;
    }
	
    function getAmountRaised() returns(uint) {
        return this.balance;
    }
	
	function getAmountContributed(address contrib) returns(uint) {
        return balances[contrib];
    }

    function getOwner() returns(address) {
        return info.owner;
    }
	
	function getCreator() returns(address) {
        return creator;
    }
}

