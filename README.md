# FundingHub

FundingHub is a crowdfunding platform that allows users to browse, create and contribute to projects.  There are two Solidity smart contracts named FundingHub.sol and Project.sol 

Git Repository:
https://git.academy.b9lab.com/ETH-8-exam-projects/mvpratt/tree/master

## FUNDINGHUB 

FundingHub is the registry of all Projects to be funded. FundingHub should have a constructor and the following functions:

`createProject()` - This function allows a user to add a new project to the FundingHub. The function deploys a new Project contract and keeps track of its address. The `createProject()` function accepts all constructor values that the Project contract requires.

`contribute()` - This function allows users to contribute to a Project identified by its address. `contribute()` calls the `fund()` function in the individual Project contract and passes on all Ether value attached to the function call.


## PROJECT 

Project is the contract that stores all the data of each project. Project has a constructor and a struct to store the following information:

* the address of the owner of the project
* the amount to be raised (eg 100000 wei)
* the deadline, i.e. the time before which the amount has to be raised
* Please also implement the following functions:

`fund()` - This is the function called when the FundingHub receives a contribution. The function must keep track of each contributor and the individual amounts contributed. 
Rules: 
* If the contribution was sent after the deadline of the project passed, or the full amount has been reached, the function returns the value to the originator of the transaction 
* If the full funding amount has been reached, the owner may call `payout()` to retrieve funds. 
* If the deadline has passed without the funding goal being reached, contributers may get their money back by calling `refund()`.

`payout()` - This is the function that sends all funds received in the contract to the owner of the project.  Only the owner may receive the payout.

`refund()` - This function sends funds back to the contributer that requests them.  This is only permitted if deadline is reach and project is not fully funded.


## INTERFACE

A simple web interface allows users to do the following:

* Browse active Projects
* Create their own Project
* Contribute to a Project


## TESTS

`fund_refund.js` - An automated test that covers the refund function in the Project contract using the Truffle testing framework. 


## Installation

Install and run the dapp like so:
1. Run `testrpc` or `geth`  You must have web3.eth.accounts[0,1,2,3] unlocked, with a balance of ETH
2. truffle compile 
3. truffle migrate --reset --network development 
4. truffle build --reset --network development
5. In the build directory, run this command: `php -S 0.0.0.0:8000`
6. Connect to the page in Chrome

## Tool Versions Supported

 * Tuffle 2.1.1
 * Node.js 6.9.5
 * Solidity ^0.4.2   
 * TestRPC 3.0.3
 * geth 1.5.8-stable-f58fb322
 * Tested with Google Chrome browser

### Application Usage

The web interface works like so.

### Automated Tests

* truffle test

### Known Issues/bugs

* When contribution puts over the goal amount, the project accepts all the funds, the balance isn't capped automatically.  Contributers should be careful not to send funds more than the goal.


### Author:

mvpratt
