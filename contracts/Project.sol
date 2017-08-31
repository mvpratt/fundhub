pragma solidity ^0.4.15;


contract Project {

    struct Info {
      address owner; 
      uint amount_goal;  // in units of Wei
      uint duration;
      uint deadline;     // in units of seconds
    }

    Info public info;
    mapping(address => uint) public balances;    // Funding contributions
    address public creator;
    uint public bal;          // temp balance variable

    event OnFund(uint timestamp, address contrib, uint amount);

    function Project(address own, uint amt, uint dur) {

        creator     = msg.sender;
        info        = Info(own, amt, dur, (now+dur));
    }

    function fund(address contrib) payable public {

        if (this.balance <= info.amount_goal && now < info.deadline) {    // not reached goal yet
            balances[contrib] += msg.value;
        }

        else {                                 // project either fully funded or deadline reached
            if (!contrib.send(msg.value)) revert();
        }
        OnFund(now, contrib, msg.value);
    }

    function refund() public {
    	if (now >= info.deadline && this.balance < info.amount_goal){ // only refund if deadline reached before fully funded
            bal = balances[msg.sender];
            balances[msg.sender] = 0;
            if (!msg.sender.send(bal)) revert();
        }
    }

    function payout() public {
        if (msg.sender == info.owner && this.balance == info.amount_goal){ 
            if (!info.owner.send(this.balance)) revert();
        }
    }

// Get Functions
	
    function getAmountRaised() constant returns(uint) {
        return this.balance;
    }
	
	function getAmountContributed(address contrib) constant returns(uint) {
        return balances[contrib];
    }
}
