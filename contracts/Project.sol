pragma solidity ^0.4.15;

/*
9/6/17
Contract size: 1612 bytes
Transaction cost: 481282 gas. 
Execution cost: 324426 gas.


9/7/17

*/

contract Project {

    struct Info {
      address owner; 
      uint amount_goal;  // in Wei
      uint deadline;     // in seconds
    }

    Info public info;
    mapping(address => uint) public balances;  // Funding contributions

    event Fund(uint _timestamp, address _contrib, uint _amount);

    //access control
    modifier onlyOwner { 
        if (msg.sender != info.owner)  revert();
        _; 
    } 

    // constructor
    function Project(uint _funding_goal, uint _duration) {

        info = Info({ owner       : tx.origin, 
                      amount_goal : _funding_goal, 
                      deadline    : (now + _duration)
                   });
    }

    // fund() must specify the contributer (which is not necessarily the message sender)
    function fund(address _contrib) payable external {

        require(this.balance < info.amount_goal);
        require(now < info.deadline);

        balances[_contrib] += msg.value;
        Fund(now, _contrib, msg.value);
    }

    // only pays out to the owner
    function payout() external onlyOwner() {

        require(this.balance == info.amount_goal);
        if ( !info.owner.send(this.balance) ) revert();
    }

    // only refunds to contributers
    // only refund if deadline reached before fully funded
    // zero out balance before sending funds - to prevent re-entrancy attack

    function refund() external {

        uint bal;

        require(now >= info.deadline);
        require(this.balance < info.amount_goal);

        bal = balances[msg.sender];
        balances[msg.sender] = 0;
        if (!msg.sender.send(bal)) revert();
    }
}
