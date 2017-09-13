AUTHOR: <mvpratt>


IN PROGRESS:


Solidity:
  Test terminate() after payout. -- automated testing
  Createproject returns index (id) of created project, 
  Error message when try to interact with non existant project
  Clean up createProject(), break into sub functions
  myProject struct

Javascript:
  Process solidty events
  Manual refresh error:
    Unhandled rejection Error: Invalid JSON RPC response: ""
  Warning message when try to create too many projects
  Read up on error handling promises and how to use .catch


Bonus:
  Project name is user configurable - stored in contract?
  Add scrollable table for projects
  Install scripts (using npm)
  Bug - looks like crashing testrpc when click too fast on next thing during a refresh - add spinning wheel?

UI Testing:

    y Overfund 
    y Fund after deadline
    y Refund request early
    Refund request from non-contributer
    Payout request from non-owner
    Call projects that dont exist

  Verify nominal transactions pass
    y Create project
    y Contribute
    y Payout after fully funded
    y Refund after deadline

=============================================

BACKLOG: 
    autopayout
    
  Error handling:
    Catch all revert() and require() errors in tests --- verify that they can be triggered
    Error message when attempt to create project by non external account
    Error message when transaction fails for another reason

  Automated testing features:
    Verify amounts of payouts, refunds, contributions, etc (minus gas cost) 
    Check account balances for required funds at the beginning of each test
    Make tests more modular
    Make app more modular

  Contract improvements:
    choose size of struct elements to stack and save space

    autorefund()
    selfdestruct()
