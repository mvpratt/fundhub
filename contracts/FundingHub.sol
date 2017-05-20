pragma solidity ^0.4.2;


import "Project.sol";

contract FundingHub {

  // List of projects created
  address projectDeployed; 
  address[3] myProjects;
  uint8 num_projects = 0;
  uint8 version = 1;

    // Define events
    //event OnDeployed(address deployed);

	// Constructor function
	function FundingHub() {

	}

    function createProject(address owner, uint funding_goal) {

        projectDeployed = new Project(owner, funding_goal);
        num_projects = num_projects + 1;
        myProjects[num_projects] = projectDeployed;

        //OnDeployed(projectDeployed);
    }


    //function contributeToProject(uint proj_index, uint amt) payable {
    //
    //}


    function getProjectAddress(uint8 index) returns(address) {
        return projectDeployed;//myProjects[index];
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
