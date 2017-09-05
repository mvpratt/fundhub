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

    event Fund(uint _timestamp, address _contrib, uint _amount);

    //access control
    modifier onlyOwner { 
        if (msg.sender != info.owner)  revert();
        _; 
    } 

    // constructor
    function Project(uint _amt, uint _dur) {
        info = Info(tx.origin, _amt, _dur, (now + _dur));
    }


    // fund() must specify the contributer (which is not necessarily the message sender)
    function fund(address _contrib) payable external {

        // not reached goal yet
        if (this.balance <= info.amount_goal && now < info.deadline) {    
            balances[_contrib] += msg.value;
        }

        // project either fully funded or deadline reached
        else {                                 
            if (!_contrib.send(msg.value)) revert();
        }
        Fund(now, _contrib, msg.value);
    }

    // only refunds to contributers
    function refund() external {

        // only refund if deadline reached before fully funded
        // zero out balance before sending funds - to prevent DAO style recursive attack
    	if (now >= info.deadline && this.balance < info.amount_goal){ 
            bal = balances[msg.sender];
            balances[msg.sender] = 0;
            if (!msg.sender.send(bal)) revert();
        }
    }

    // only pays out to the owner
    function payout() external {
        if (msg.sender == info.owner && this.balance == info.amount_goal){ 
            if (!info.owner.send(this.balance)) revert();
        }
    }
}
