AUTHOR: <mvpratt>
===================================================================


IN PROGRESS:
Bug --- Project allows contributions after payout complete!!!!

  Createproject returns index (id) of created project, --- broken.  invalid number of arguments.
  contribute -- require that project address is in the index
      Non contributer --- what happens when access mapping with no entry for this address?
  Verify amounts of payouts, refunds, contributions, etc (minus gas cost) 
  Add scrollable table for projects
  Check account balances for required funds at the beginning of each test

Truffle seems not to regenerate build/contracts/Project.json every time
  workaround: delete /build directory and recompile

  
Tests:
nominal.js
exceptions.js
attacks.js


Solidity:
  Error message when try to interact with non existant project

Javascript:
  Process solidty events
  Manual refresh error:
    Unhandled rejection Error: Invalid JSON RPC response: ""
  Warning message when try to create too many projects
  Read up on error handling promises and how to use .catch


===================================================================

FUTURE IMPROVEMENTS: 

  Error handling:
    Catch all revert() and require() errors in tests --- verify that they can be triggered
    Error message when attempt to create project by non external account

  Contract improvements:
    Choose size of struct elements to stack and save space
    Add a terminate function that calls selfdestruct() -- good steward of the ecosystem - remove old code - only fundhub can call selfdestruct?

  Project name is user configurable - stored in contract?
  Install scripts (using npm)
  Bug - looks like crashing testrpc when click too fast on next thing during a refresh - add spinning wheel?
