# FundingHub

FundingHub is a crowdfunding platform that allows users to browse, create and contribute to projects.  There are two Solidity smart contracts named FundingHub.sol and Project.sol 


## FUNDINGHUB

FundingHub is the registry of all Projects to be funded. FundingHub should have a constructor and the following functions:

`createProject()` - This function should allow a user to add a new project to the FundingHub. The function should deploy a new Project contract and keep track of its address. The `createProject()` function should accept all constructor values that the Project contract requires.

`contribute()` - This function allows users to contribute to a Project identified by its address. contribute calls the `fund()` function in the individual Project contract and passes on all Ether value attached to the function call.


## PROJECT

Project is the contract that stores all the data of each project. Project should have a constructor and a struct to store the following information:

* the address of the owner of the project
* the amount to be raised (eg 100000 wei)
* the deadline, i.e. the time before which the amount has to be raised
* Please also implement the following functions:

`fund()` - This is the function called when the FundingHub receives a contribution. The function must keep track of each contributor and the individual amounts contributed. If the contribution was sent after the deadline of the project passed, or the full amount has been reached, the function must return the value to the originator of the transaction and, left to your own decision, call none or one of the two other functions. If the full funding amount has been reached, the function must either call `payout()` or make it possible to do so. If the deadline has passed without the funding goal being reached, the function must either call `refund()` or make it possible to do so.

`payout()` - This is the function that sends all funds received in the contract to the owner of the project.

`refund()` - This function sends part or all individual contributions back to the respective contributors, or lets all contributors retrieve their contributions.


## INTERFACE

A simple web interface allows users to do the following:

* browse active Projects
* create their own Project
* contribute to a Project


## TESTS

An automated test that covers the refund function in the Project contract using the Truffle testing framework. 


## Installation

1. Install and run the dapp like so.


Tool versions:

 * Tuffle 2.1.1
 * Node.js 6.9.5
 * Solidity 0.4.2   (0.4.9??)
 * TestRPC 3.0.3
 * geth 1.5.8-stable-f58fb322
 * Tested with Google Chrome browser

### Application Usage

The web interface works like so.

### Automated Tests

How to run tests here


### Known Bugs:

1. N/A


### TODO:

1. N/A


### Release 1.0 Changelog:

* Initial release


### Author info:

mvpratt
