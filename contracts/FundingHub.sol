
pragma solidity ^0.4.15;

import "./Project.sol";

contract FundingHub {
      
  uint public num_projects = 0;
  mapping(uint => address) public myProjects;  
  event LogContribute(uint _timestamp, address _contrib, uint _amount);
  event LogCreateProject(uint _timestamp, address _project_address);

	function FundingHub() {}

  // project owner can be an account other than the creator
  function createProject(uint _funding_goal, uint _duration) {

    require(_funding_goal > 0);
    require(_duration > 0);

    num_projects = num_projects + 1;
    myProjects[num_projects] = new Project(_funding_goal, _duration);
    LogCreateProject(now, myProjects[num_projects]); 
  }

  // Contributer is an account (external account, or contract account)
  function contribute(address _project_address) payable {
    
    Project proj = Project(_project_address);
    proj.fund.value(msg.value)(msg.sender); // note: fund() can cause a revert() 
    LogContribute(now, msg.sender, msg.value);
  }
}
