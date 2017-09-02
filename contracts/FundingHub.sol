pragma solidity ^0.4.15;

import "./Project.sol";


contract FundingHub {

  address[4] public myProjects;        
  uint public num_projects = 0;
  Project proj;

  event Contribute(uint _timestamp, address _contrib, uint _amount);
  event CreateProject(uint _timestamp, address _project_address);

	function FundingHub() {
	}

  // project owner can be an account other than the creator
  function createProject(address _owner, uint _funding_goal, uint _duration) {

    num_projects = num_projects + 1;
    myProjects[num_projects] = new Project(_owner, _funding_goal, _duration);
    CreateProject(now, myProjects[num_projects]);
  }

  // Contributer is an account (external account, or contract account)
  function contribute(uint _index) payable {

    proj = Project(myProjects[_index]);
    proj.fund.value(msg.value)(msg.sender); 
    Contribute(now, msg.sender, msg.value);
  }

  function getProjectAddress(uint8 _index) constant returns(address) {
    return myProjects[_index];
  }

}
