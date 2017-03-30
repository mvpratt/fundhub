pragma solidity ^0.4.2;


import "Project.sol";

contract FundingHub {

  // List of projects created
  address projectDeployed;

  uint version = 1;

    // Define events
    //event OnDeployed(address deployed);

	// Constructor function
	function FundingHub() {

	}

    function createProject(address owner, uint funding_goal) {

        projectDeployed = new Project(owner, funding_goal);
        //OnDeployed(projectDeployed);
    }

    //function contribute(address project, uint amount){
//
//    }

    function getProjectAddress() returns(address) {
        return projectDeployed;
    }

    function getVersion() returns (uint) {
        return version;
    }
}
