pragma solidity ^0.4.15;

import "./Project.sol";


contract FundingHub {

  address[4] public myProjects;       // Array of projects 
  address    public projectDeployed;  // Last project deployed

  Project proj;

  uint8 public num_projects     = 0;

  event OnContribute(uint timestamp, address contrib, uint amount);

	function FundingHub() {
	}

  function createProject(address owner, uint funding_goal, uint duration) {

    projectDeployed = new Project(owner, funding_goal, duration);
    num_projects = num_projects + 1;
    myProjects[num_projects] = projectDeployed;
  }

  function contribute(uint index, address contrib) payable {

    proj = Project(myProjects[index]);
    proj.fund.value(msg.value)(contrib); 
    OnContribute(now, contrib, msg.value);
  }

  function getProjectAddress(uint8 index) constant returns(address) {
    return myProjects[index];
  }

  function getAddressLastDeployedProject() constant returns(address) {
    return myProjects[num_projects];
  }
}
