pragma solidity ^0.4.8;

import "./Project.sol";


contract FundingHub {

// HOW TO: track a bunch of projects
//  And array (address -> index), store array size, project name?
//  A mapping (address -> owner)

// HOW TO: Call a function and send it ETH
//address.func.value(amount)(arg1, arg2, arg3)


  address[4] public myProjects;       // Array of projects 
  address    public projectDeployed;  // Last project deployed

  Project proj;

  uint8 public num_projects     = 0;
  uint8 constant public version = 1;


    event OnContribute(uint timestamp, address contrib, uint amount);

	// Constructor function
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


    //function getNumProjects() constant returns(uint8) {
    //    return num_projects;
    //}


    //function getIndexLastDeployedProject() constant returns(uint8) {
    //    return num_projects;
    //}


    function getAddressLastDeployedProject() constant returns(address) {
        return myProjects[num_projects];
    }


    //function getVersion() constant returns (uint8) {
    //    return version;
    //}
}
