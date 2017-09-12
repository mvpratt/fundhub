AUTHOR: <mvpratt>


IN PROGRESS:

*****
Bug - early refund and early payout dont print error, seem to take a long time to refresh
*****


UI improvements:
Fix buttons
  1. Cleanup setStatus() messages 
  2. Error message when try to create too many projects

  Project name is user configurable variable --- stored in contract??  /// maybe switch to project id??
  Add scrollable table for projects
  Change format so can view all status in one page

  Should payout do a self destruct???
  Install scripts (using npm)


UI Testing:

  Verify invalid transactions are reverted
    Overfund 
    Fund after deadline
    Refund request early
    Refund request from non-contributer
    Payout request from non-owner

  Verify nominal transactions pass
    Create project
    Contribute
    Payout after fully funded
    Refund after deadline

=============================================

BACKLOG: 
    autopayout
    
  Error handling:
    Catch all revert() and require() errors in tests --- verify that they can be triggered
    Detect attempt to create project by non external account??
    Error message When transaction fails for another reason

  Automated testing features:
    Verify amounts of payouts, refunds, contributions, etc (minus gas cost) 
    Check account balances for required funds at the beginning of each test
    Make tests more modular
    Make app more modular

  Contract improvements:
    choose size of struct elements to stack and save space

    autorefund()
    selfdestruct()
