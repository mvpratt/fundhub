/*
9/6/17
FundingHub size: 2995 bytes
Transaction cost: 841337 gas. 
Execution cost: 597029 gas.

9/7/17
Removed getProjectAddress()
FundingHub size: 2791 bytes
Transaction cost: 786827 gas
Execution cost: 556391 gas
*/

pragma solidity ^0.4.15;

import "./Project.sol";

contract FundingHub {
      
  uint public num_projects = 0;
  //Project proj;

  mapping(uint => address) public myProjects;  

  event Contribute(uint _timestamp, address _contrib, uint _amount);
  event CreateProject(uint _timestamp, address _project_address);

	function FundingHub() {
	}

  // project owner can be an account other than the creator
  function createProject(uint _funding_goal, uint _duration) {

    num_projects = num_projects + 1;
    myProjects[num_projects] = new Project(_funding_goal, _duration);
    CreateProject(now, myProjects[num_projects]);
  }

  // Contributer is an account (external account, or contract account)
  function contribute(address _project_address) payable {

    Project proj = Project(_project_address);
    proj.fund.value(msg.value)(msg.sender); // note: fund() could cause revert() 
    Contribute(now, msg.sender, msg.value);
  }
}
