

pragma solidity ^0.4.15;

contract Project {

    struct Info {
      address owner; 
      uint amount_goal;  // in Wei
      uint deadline;     // in seconds
    }

    Info public info;
    mapping(address => uint) public balances;  // Funding contributions
    bool public paid_out; // true if project is fully funded and paid out

    event Fund(uint _timestamp, address _contrib, uint _amount);
    event Refund(uint _timestamp, address _contrib, uint _amount);


    //access control
    modifier onlyOwner { 
        if (msg.sender != info.owner)  revert();
        _; 
    } 

    // constructor
    function Project(uint _funding_goal, uint _duration) {

        info = Info({ 
            owner: tx.origin, 
            amount_goal: _funding_goal, 
            deadline: (now + _duration)
        });

        paid_out = false;
    }

    // Only fund if: deadline not reached AND not already paid out
    // If overfund, return the extra 
    function fund(address _contributer) payable public {

        uint overfunded;
        uint contribution;

        require(now < info.deadline);
        require(paid_out == false);

        if (this.balance > info.amount_goal) {
          overfunded = this.balance - info.amount_goal;
          contribution = msg.value - overfunded;
          if (!_contributer.send(overfunded)) revert();
        }
        else {
          contribution = msg.value;
        }

        balances[_contributer] += contribution;
        Fund(now, _contributer, contribution);
    }

    // Only pays out to the owner
    function payout() public onlyOwner() {

        require(this.balance == info.amount_goal);

        if (info.owner.send(this.balance)) {
            paid_out = true;
        }
        else {
            revert();
        }
    }

    // Only refund if:
    //   valid contributer AND deadline reached AND funding goal not reached
    function refund() public {

        uint bal;
        require(now >= info.deadline);                  
        require(this.balance < info.amount_goal);       

        // zero out balance before sending funds - to prevent re-entrancy attack
        bal = balances[msg.sender];
        require(bal > 0);
        balances[msg.sender] = 0;  
        if (!msg.sender.send(bal)) revert();
        Refund(now, msg.sender, bal);
    }
}
