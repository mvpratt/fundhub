

pragma solidity ^0.4.15;

contract Project {

    struct Info {
      address owner; 
      uint amountGoal;  // in Wei
      uint deadline;     // in seconds
    }

    Info public info;
    mapping(address => uint) public balances;  // Funding contributions
    bool public paidOut; // true if project is fully funded and paid out

    event LogFund(uint _timestamp, address _contrib, uint _amount);
    event LogRefund(uint _timestamp, address _contrib, uint _amount);


    //access control
    modifier onlyOwner { 
        if (msg.sender != info.owner)  revert();
        _; 
    } 

    // constructor
    function Project(uint _fundingGoal, uint _duration) {

        info = Info({ 
            owner: tx.origin, 
            amountGoal: _fundingGoal, 
            deadline: (now + _duration)
        });

        paidOut = false;
    }

    // Only fund if: deadline not reached AND not already paid out
    // If overfund, return the extra 
    function fund(address _contributer) payable public {

        uint overfunded;
        uint contribution;

        require(now < info.deadline);
        require(paidOut == false);

        if (this.balance > info.amountGoal) {
          overfunded = this.balance - info.amountGoal;
          contribution = msg.value - overfunded;
          balances[_contributer] += contribution;
          if (!_contributer.send(overfunded)) revert();
        }
        else {
          contribution = msg.value;
          balances[_contributer] += contribution; 
        }

        LogFund(now, _contributer, contribution);
    }

    // Only pays out to the owner
    function payout() public onlyOwner() {

        require(this.balance >= info.amountGoal);
        paidOut = true;
        if (!info.owner.send(this.balance)) revert();
    }

    // Only refund if:
    //   valid contributer AND deadline reached AND funding goal not reached
    function refund() public {

        uint bal;
        require(now >= info.deadline);                  
        require(this.balance < info.amountGoal);       

        // zero out balance before sending funds - to prevent re-entrancy attack
        bal = balances[msg.sender];
        require(bal > 0);
        balances[msg.sender] = 0;  
        if (!msg.sender.send(bal)) revert();
        LogRefund(now, msg.sender, bal);
    }
}
