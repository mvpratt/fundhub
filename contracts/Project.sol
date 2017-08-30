pragma solidity ^0.4.8;


contract Project {

    struct Info {
      address owner; 
      uint amount_goal;  // in units of Wei
      uint duration;
      uint deadline;     // in units of seconds
    }

    uint8 constant public version = 2;

    Info public info;

    mapping(address => uint) public balances;    // Funding contributions
    address public creator;

    bool public success;      // Get status success/fail when send money
    uint public bal;          // temp balance variable

    // Contract state
    uint constant CREATED          = 0;   
    uint constant FULLY_FUNDED     = 1;    
    uint constant PAID_OUT         = 2;   
    uint public state;


    event OnFund(uint timestamp, address contrib, uint amount);


    // Constructor function, run when the project is deployed
    function Project(address own, uint amt, uint dur) {

        creator     = msg.sender;
        state       = CREATED;
        info        = Info(own, amt, dur, (now+dur));
    }


// Change project state

    function fund(address contrib) payable public {


        if (state == CREATED && this.balance < info.amount_goal && now < info.deadline) {    // not reached goal yet
            balances[contrib] += msg.value;
        }
        else if (state == CREATED && this.balance == info.amount_goal && now < info.deadline) { // reached goal
            balances[contrib] += msg.value;            
            state = FULLY_FUNDED;
        }

        else {                                 // project is either fully funded or deadline reached
            success = contrib.send(msg.value); // return all funds
            if (!success) revert();//throw;
        }
        OnFund(now, contrib, msg.value);
    }

    function refund() public {
    	if (state == CREATED && now >= info.deadline){ // only refund if deadline reached before fully funded
            bal = balances[msg.sender];
            balances[msg.sender] = 0;
            success = msg.sender.send(bal);
            if (!success) revert();//throw;
        }
    }

    function payout() public {
    	if (msg.sender == info.owner && state == FULLY_FUNDED){  
            state = PAID_OUT;
            success = info.owner.send(this.balance);
            if (!success) revert();//throw;
        }
    }


// Get Functions
	
	//function getState() constant returns(uint) {
    //    return state;
    //}

    function getAmountGoal() constant returns(uint) {
        return info.amount_goal;
    }
	
    function getAmountRaised() constant returns(uint) {
        return this.balance;
    }
	
	function getAmountContributed(address contrib) constant returns(uint) {
        return balances[contrib];
    }

    function getOwner() constant returns(address) {
        return info.owner;
    }
	
	//function getCreator() constant returns(address) {
    //    return creator;
    //}

    function getDeadline() constant returns(uint) {
        return info.deadline;
    }

    function getDuration() constant returns(uint) {
        return info.duration;
    }

    //function getVersion() constant returns(uint) {
    //    return version;
    //}
    
}
