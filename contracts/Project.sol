pragma solidity ^0.4.15;


contract Project {

    struct Info {
      address owner; 
      uint amount_goal;  // in Wei
      uint duration;
      uint deadline;     // in seconds
    }

    Info public info;
    mapping(address => uint) public balances;  // Funding contributions
    uint public bal;                           // temp balance variable

    event Fund(uint timestamp, address contrib, uint amount);

    //access control
    modifier onlyOwner { 
        if (msg.sender != info.owner)  revert();
        _; 
    } 

    // constructor
    function Project(address own, uint amt, uint dur) {
        info = Info(own, amt, dur, (now+dur));
    }


    // fund() must specify the contributer (which is not necessarily the message sender)
    function fund(address contrib) payable public {

        // not reached goal yet
        if (this.balance <= info.amount_goal && now < info.deadline) {    
            balances[contrib] += msg.value;
        }

        // project either fully funded or deadline reached
        else {                                 
            if (!contrib.send(msg.value)) revert();
        }
        Fund(now, contrib, msg.value);
    }

    // only refunds to contributers
    function refund() public {

        // only refund if deadline reached before fully funded
        // zero out balance before sending funds - to prevent DAO style recursive attack
    	if (now >= info.deadline && this.balance < info.amount_goal){ 
            bal = balances[msg.sender];
            balances[msg.sender] = 0;
            if (!msg.sender.send(bal)) revert();
        }
    }

    // only pays out to the owner
    function payout() {
        if (msg.sender == info.owner && this.balance == info.amount_goal){ 
            if (!info.owner.send(this.balance)) revert();
        }
    }

// Get Functions
	function getAmountContributed(address contrib) constant returns(uint) {
        return balances[contrib];
    }
}
