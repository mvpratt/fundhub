/*
9/6/17
Contract size: 1612 bytes
Transaction cost: 481282 gas. 
Execution cost: 324426 gas.

9/7/17
Changes:
- Made "bal" a local variable
- use OnlyOwner() modifier
- use "require statements" in fund(), payout(), refund()
Contract size: 1499 bytes
Transaction cost: 450718 gas. 
Execution cost: 301802 gas.
*/

pragma solidity ^0.4.15;

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

   /* // fund() must specify the contributer (which is not necessarily the message sender)
    function fund(address _contrib) payable external {

        require(this.balance < info.amount_goal);
        require(now < info.deadline);

        balances[_contrib] += msg.value;
        Fund(now, _contrib, msg.value);

    }*/


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


    // only pays out to the owner
    function payout() external onlyOwner() {

        require(this.balance == info.amount_goal);
        if ( !info.owner.send(this.balance) ) revert();
    }


    // Only refund if:
    //   valid contributer AND
    //   deadline reached AND
    //   funding goal not reached
    function refund() external {

        uint bal;

        require(now >= info.deadline);                  
        require(this.balance < info.amount_goal);       
        require(balances[msg.sender] > 0);

        // zero out balance before sending funds - to prevent re-entrancy attack
        bal = balances[msg.sender];
        balances[msg.sender] = 0;  
        if (!msg.sender.send(bal)) revert();
    }
}
