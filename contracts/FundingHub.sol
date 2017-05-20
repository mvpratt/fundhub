pragma solidity ^0.4.2;

import "Project.sol";


contract FundingHub {

  address public projectDeployed; 
  address[3] public myProjects;       // Array of projects created
  
  Project proj;

  uint8 public num_projects = 0;
  uint8 public version      = 1;


	// Constructor function
	function FundingHub() {
	}


    function createProject(address owner, uint funding_goal) {

        projectDeployed = new Project(owner, funding_goal);
        num_projects = num_projects + 1;
        myProjects[num_projects] = projectDeployed;
    }


    function contribute(uint index, address contrib) payable {
      //address.func.value(amount)(arg1, arg2, arg3)
      proj = Project(myProjects[index]);
      proj.fund.value(msg.value)(contrib);
    }


    function getProjectAddress(uint8 index) returns(address) {
        return myProjects[index];
    }


    function getNumProjects() returns(uint8) {
        return num_projects;
    }


    function getIndexLastDeployedProject() returns(uint8) {
        return num_projects;
    }


    function getAddressLastDeployedProject() returns(address) {
        return myProjects[num_projects];
    }


    function getVersion() returns (uint8) {
        return version;
    }
}
