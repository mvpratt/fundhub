pragma solidity ^0.4.15;

import "./Project.sol";


contract FundingHub {

  address[4] public myProjects;        
  uint public num_projects = 0;
  Project proj;

  event Contribute(uint timestamp, address contrib, uint amount);
  event CreateProject(uint timestamp, address project_address);

	function FundingHub() {
	}

  // project owner can be an account other than the creator
  function createProject(address owner, uint funding_goal, uint duration) {

    num_projects = num_projects + 1;
    myProjects[num_projects] = new Project(owner, funding_goal, duration);
    CreateProject(now, myProjects[num_projects]);
  }

  // Contributer is an account (external account, or contract account)
  function contribute(uint index) payable {

    proj = Project(myProjects[index]);
    proj.fund.value(msg.value)(msg.sender); 
    Contribute(now, msg.sender, msg.value);
  }

  function getProjectAddress(uint8 index) constant returns(address) {
    return myProjects[index];
  }

}
