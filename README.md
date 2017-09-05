# FundingHub

FundingHub is a crowdfunding platform that allows users to browse, create and contribute to projects.  There are two Solidity smart contracts named FundingHub.sol and Project.sol 

Git Repository:
https://git.academy.b9lab.com/ETH-8-exam-projects/mvpratt/tree/master

## FUNDINGHUB 

FundingHub is the registry of all Projects to be funded. FundingHub should have a constructor and the following functions:

`createProject()` - This function allows a user to add a new project to the FundingHub. The function deploys a new Project contract and keeps track of its address. The createProject() function accepts all constructor values that the Project contract requires.

`contribute()` - This function allows users to contribute to a Project identified by its address. contribute() calls the fund() function in the individual Project contract and passes on all Ether value attached to the function call.


## PROJECT 

Project is the contract that stores all the data of each project. Project has a constructor and a struct to store the following information:

* the address of the owner of the project
* the amount to be raised (eg 100000 wei)
* the deadline, i.e. the time before which the amount has to be raised
* Please also implement the following functions:

`fund()` - This is the function called when the FundingHub receives a contribution. The function must keep track of each contributor and the individual amounts contributed. 
#### Rules: 
* If the contribution was sent after the deadline of the project passed, or the full amount has been reached, the function returns the value to the originator of the transaction 
* If the full funding amount has been reached, the owner may call payout() to retrieve funds.
* If the deadline has passed without the funding goal being reached, contributers may get their money back by calling refund().

`payout()` - This is the function that sends all funds received in the contract to the owner of the project.  Only the owner may receive the payout.

`refund()` - This function sends funds back to the contributer that requests them.  This is only permitted if deadline is reach and project is not fully funded.


## INTERFACE

A simple web interface allows users to browse active projects, create their own project, and dontribute to a project

#### Guidelines
* Deadline and duration are in units of  seconds
* This demonstation Dapp is limited to a maximum of 3 projects and 3 users.
* Whenever you take an action such as create, payout or refund, _make sure that the desired user selected_

#### Test refund (rejected)
1. Create a project with a goal of 10 ETH and duration of 60 (seconds)
2. Contribute 1 ETH to it
3. Request a refund.  It should be rejected, because the deadline has not been reached yet.

#### Test refund (success)
1. Create a project with a goal of 10 ETH and duration of 60 (seconds)
2. Contribute 1 ETH to it
3. Request a refund.  Notice that the refund request is rejected.
4. Wait until 60 seconds have passed since project creating
5. Request refund again, it should be successful

#### Test payout
1. Create project & fully fund it.
7. Request payout

## AUTOMATED TESTS

* `truffle test`

`fund_refund.js` - An automated test that covers the refund function in the Project contract using the Truffle testing framework. 


## Installation

1. `testrpc -i 42`
2. `truffle compile` 
3. `truffle migrate --reset` 
4. `truffle build --reset`
5. In the `/build` directory: `php -S 0.0.0.0:8000`
6. Open `localhost:8000` in Google Chrome

## Tool Versions 

 * Tuffle 3.4.9
 * Node.js 6.11.2
 * Solidity 0.4.15
 * TestRPC 4.1.1
 * geth 1.5.8-stable-f58fb322
 * Google Chrome 


### Errata

* When contribution puts over the goal amount, the project accepts all the funds, the balance isn't capped automatically.  Contributers should be careful not to send funds more than the goal.

* Project creator is the owner -- MUST be an external account (not another contract)

* Project creator can also contribute to the project

### Author:

mvpratt

### Screenshot:

https://git.academy.b9lab.com/ETH-8-exam-projects/mvpratt/blob/master/Screenshot.png


