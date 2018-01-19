pragma solidity ^0.4.15;
import "./Project.sol";

contract FundingHub {
      
  uint public num_projects = 0;  // valid project numbers: (1..numProjects)
  mapping(uint => address) public myProjects; 

  event LogContribute(uint _timestamp, address _contrib, uint _amount);
  event LogCreateProject(uint _timestamp, address _projectAddress);

	function FundingHub() {}

  // project owner can be an account other than the creator
  function createProject(uint _fundingGoal, uint _duration) {

    require(_fundingGoal > 0);
    require(_duration > 0);

    num_projects = num_projects + 1;
    myProjects[num_projects] = new Project(msg.sender, _fundingGoal, _duration); // owner is the account that created the project
    LogCreateProject(now, myProjects[num_projects]); 
  }

  // Contributer is an account (external account, or contract account)
  function contribute(address _projectAddress) payable {
    bool _projectExists;

    Project proj = Project(_projectAddress);

    // verify the project exists
    for (uint i = 1; i <= num_projects; i++) {
      if (myProjects[i] == _projectAddress) { _projectExists = true; }
    }
    require(_projectExists);

    proj.fund.value(msg.value)(msg.sender); // note: fund() can cause a revert() 
    LogContribute(now, msg.sender, msg.value);
  }
}
