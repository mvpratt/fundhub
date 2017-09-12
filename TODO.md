AUTHOR: <mvpratt>


IN PROGRESS:


UI improvements:
  Read up on error handling promises and how to use .catch
  Error message when try to create too many projects
  When contribute, show the user name that contributed in the status window
  Clean up createProject(), returns index of created project, break into sub functions

Bonus:
  Project name is user configurable variable --- stored in contract??  /// maybe switch to project id??
  Add scrollable table for projects
  self destruct after payout.
  Install scripts (using npm)


UI Testing:

  Verify invalid transactions are reverted
    Overfund 
    y Fund after deadline
    y Refund request early
    Refund request from non-contributer
    Payout request from non-owner

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
