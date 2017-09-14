AUTHOR: <mvpratt>
===================================================================

IN PROGRESS:

  Non contributer --- what happens when access mapping with no entry for this address?
  Createproject returns index (id) of created project, --- broken.  invalid number of arguments.
  Add scrollable table for projects

Solidity:
  Error message when try to interact with non existant project
  Log solidty events
  Warning message when try to create too many projects
  Read up on error handling promises and how to use .catch

Test multiple projects and multiple contributers (constrained random)

  Truffle seems not to regenerate build/contracts/Project.json every time
    workaround: delete /build directory and truffle compile --reset; truffle migrate --reset; truffle build

  Use pending withdrawals?
    http://solidity.readthedocs.io/en/develop/common-patterns.html?highlight=mapping#withdrawal-from-contracts



===================================================================

FUTURE IMPROVEMENTS: 


Tests:
  nominal.js
  exceptions.js
  attacks.js

  Error handling:
    Catch all revert() and require() errors in tests --- verify that they can be triggered
    Error message when attempt to create project by non external account
    FundingHub.sol contribute() -- require that project address is in the index before calling Project.fund()
    Automated test: Verify amounts of payouts, refunds, contributions, etc (minus gas cost) 

  Contract improvements:
    Choose size of struct elements to stack and save space
    Add a terminate function that calls selfdestruct() -- good steward of the ecosystem - remove old code - only fundhub can call selfdestruct?

  Project name is user configurable - stored in contract?
  Install scripts (using npm)

  Bug - looks like crashing testrpc when click too fast on next thing during a refresh - add spinning wheel?
