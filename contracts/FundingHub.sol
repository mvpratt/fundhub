pragma solidity ^0.4.2;

import "ConvertLib.sol"; 

/*
contract Test {

	uint num;
	function Test(){
		num = 1;
	}
}
*/

contract FundingHub {

	uint constant version_major = 0;
	uint constant version_minor = 1;

	// Stakeholders
    address creator;
	address doctor;
	address patient; 
	address pharmacy;

	// Medication info
	uint medication_id;   // ID in a shared registry of medications
	uint refills_left;

	// Prescription state
	uint constant CREATED          = 0;   
	uint constant SIGNED           = 1;    
	uint constant SUBMITTED        = 2; 
	uint constant REFILL_REQUESTED = 3;
	uint constant FILLED           = 4;    
	uint constant EXPIRED          = 5;   
	uint constant ERROR            = 6;     
	uint rxstate;

	uint constant MAX_REFILLS = 3;


    // Define events
    //event OnDeployed(address indexed deployed);

    //event maxRefillsReached();
    event changedRefillsLeft(uint refills);


	// Constructor function
	function FundingHub() {

        creator 		= msg.sender;
        doctor 			= msg.sender;
        patient 		= 0;
        pharmacy 		= 0;
		medication_id 	= 0;
		refills_left 	= 3;
		rxstate 		= CREATED;
	}
/*
	function testDeploy() {
		address deployed = new Test();
		OnDeployed(deployed);
		return;
	}
*/


// ---------- Debug only ------------------------------------------- //

	function reset() {

        patient 		= 0;
        pharmacy 		= 0;
		medication_id 	= 0;
		refills_left 	= 3;
		rxstate 		= CREATED;
	}



// Prescription state 

	function signRx() {
		if (msg.sender == doctor && rxstate == CREATED) {
			rxstate = SIGNED;
		}
		else {
			rxstate = ERROR;
		}
	}

	function submitRx() {
		if (msg.sender == patient && rxstate == SIGNED) {
			rxstate = SUBMITTED;
		}
		else {
			rxstate = ERROR;
		}
	}

	function reqRefillRx() {
		if (msg.sender == patient && refills_left != 0 && (rxstate == SUBMITTED || rxstate == FILLED)) {
			rxstate = REFILL_REQUESTED;
		}
		else {
			rxstate = ERROR;
		}
	}

	function fillRx() {
		if (msg.sender == pharmacy && rxstate == REFILL_REQUESTED) {

			if (refills_left == 1) {
		    	refills_left = 0;
		    	rxstate = EXPIRED;
        		changedRefillsLeft(refills_left);
        	}
        	else if (refills_left > 0) {
        		refills_left = refills_left - 1;
        		rxstate = FILLED;
        		changedRefillsLeft(refills_left);
        	}
        	else {}
		}
		else {
			rxstate = ERROR;
		}
	}

	function getPrescriptionState() returns(uint) {
		return rxstate;
	}


// Medication 

	function setMedicationID(uint num) {
		if (msg.sender == doctor && rxstate == CREATED) {
			medication_id = num;
		}
	}
	
	function getMedicationID() returns(uint) {
		return medication_id;
	}
	
	function getRefillsLeft() returns(uint) {
		return refills_left;
	}
	


// Stakeholders

	function setPatient(address addr) {
		if (msg.sender == doctor && rxstate == CREATED) {
			patient = addr;
		}
	}
	
	function getPatient() returns(address) {
		return patient;
	}

	function setDoctor(address addr) {
		if (msg.sender == doctor && rxstate == CREATED) {
			doctor = addr;
		}
	}
	
	function getDoctor() returns(address) {
		return doctor;
	}

	function setPharmacy(address addr) {
		if (msg.sender == patient && rxstate == SIGNED) {
			pharmacy = addr;
		}
	}
	
	function getPharmacy() returns(address) {
		return pharmacy;
	}

	function getCreator() returns(address) {
		return creator;
	}
	
}




