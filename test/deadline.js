

contract('Project: Deadline reached', function(accounts) {

// boilerplate //

  admin    = accounts[0]; // contract creator / debug interface
  contrib1 = accounts[1];
  contrib2 = accounts[2];
  owner    = accounts[3];

  // Contract state
  const CREATED = 0;   
  const FUNDED  = 1;       
  const DEADLINE_REACHED = 2;   
  const ERROR   = 3;   

  //console.log("accounts[0]: address: " + accounts[0] + " balance: " + web3.eth.getBalance(accounts[0]));
  //console.log("accounts[1]: address: " + accounts[1] + " balance: " + web3.eth.getBalance(accounts[1]));
  //console.log("accounts[2]: address: " + accounts[2] + " balance: " + web3.eth.getBalance(accounts[2]));
  //console.log("accounts[3]: address: " + accounts[3] + " balance: " + web3.eth.getBalance(accounts[3]));

// boilerplate //

// ============ Setup ====================================================== //

it("[ADMIN] Check creator", function() {

  proj = Project.deployed();

  return proj.getCreator.call().then(function(addr) {
      assert.equal(addr, admin, "error: creator not set");
    });
});


it("[ADMIN] Set owner", function() {

  proj = Project.deployed();
  proj.setOwner(owner, {from: admin});

  return proj.getOwner.call().then(function(own) {
      assert.equal(own, owner, "error: owner not set");
    });
});


it("Owner sets amount to be raised (fundraising goal)", function() {

  proj = Project.deployed();
  proj.setAmountGoal(web3.toWei(3, "ether"), {from: owner});

  return proj.getAmountGoal.call().then(function(id) {
      assert.equal(id.valueOf(), web3.toWei(3, "ether"), "error: fundraising goal not 3 ETH");
    });
});


// ============ Contributions  ============================================= //

it("Contributer sends 1 ETH, verify received",function(){
  proj = Project.deployed();
  
  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(1, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 3");
    });
  });
}); 


it("[DEBUG] Set state to DEADLINE_REACHED",function(){
  proj = Project.deployed();
  
  return proj.DEBUG_setStateDeadlineReached({from: admin}).then(function(){
    proj.getState.call().then(function(state) {
      assert.equal(state, DEADLINE_REACHED, "error: Project state not DEADLINE_REACHED");
    });
  });
});


it("Contributer sends funds to expired project, verify funds returned",function(){
  proj = Project.deployed();

  begin_balance_contrib = web3.eth.getBalance(contrib1).toNumber();
  begin_balance_project = web3.eth.getBalance(proj.address).toNumber();

  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(2, "ether")}).then(function(){
    end_balance_contrib = web3.eth.getBalance(contrib1).toNumber();
    end_balance_project = web3.eth.getBalance(proj.address).toNumber();

    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
      assert.equal(begin_balance_contrib, end_balance_contrib, "error: contrib balance should not change");
      assert.equal(begin_balance_project, end_balance_project, "error: project balance should not change");      
    });
  });
}); 


// ============ Payout fails & Refunds  ==================================== //


it("[ADMIN] Request payout to owner, verify payout fails",function(){

  proj = Project.deployed();
  begin_balance_owner = web3.eth.getBalance(owner).toNumber();
  begin_balance_project = web3.eth.getBalance(proj.address).toNumber();

  return proj.payout({from: admin}).then(function(){

    end_balance_project = web3.eth.getBalance(proj.address).toNumber();
    end_balance_owner = web3.eth.getBalance(owner).toNumber();

    assert.equal(begin_balance_owner, end_balance_owner, "error: owner balance should not change");
    assert.equal(begin_balance_project, end_balance_project, "error: project balance should not change");
  });
}); 


it("Contributer requests refund 1 ETH",function(){

  proj = Project.deployed();

  return proj.refund({from: contrib1}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(0, "ether"), "error: did not refund");
    });
  });
});


it("Verify project funds empty",function(){

  proj = Project.deployed();

  return proj.getAmountRaised.call().then(function(amount){
      assert.equal(amount, web3.toWei(0, "ether"), "error: contract not empty");
  });
}); 

});
