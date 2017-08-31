pragma solidity ^0.4.15;

import "./Project.sol";


contract FundingHub {

  address[4] public myProjects;       // Array of projects 
  uint8 public num_projects     = 0;

  Project proj;

  event OnContribute(uint timestamp, address contrib, uint amount);
  event OnCreateProject(uint timestamp, address project_address);

	function FundingHub() {
	}

  function createProject(address owner, uint funding_goal, uint duration) {

    num_projects = num_projects + 1;
    myProjects[num_projects] = new Project(owner, funding_goal, duration);

    OnCreateProject(now, myProjects[num_projects]);
  }

  function contribute(uint index, address contrib) payable {

    proj = Project(myProjects[index]);
    proj.fund.value(msg.value)(contrib); 
    OnContribute(now, contrib, msg.value);
  }

  function getProjectAddress(uint8 index) constant returns(address) {
    return myProjects[index];
  }

}
