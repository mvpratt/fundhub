

contract('Project: Multiple funders', function(accounts) {

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

  console.log("accounts[0]: address: " + accounts[0] + " balance: " + web3.eth.getBalance(accounts[0]));
  console.log("accounts[1]: address: " + accounts[1] + " balance: " + web3.eth.getBalance(accounts[1]));
  console.log("accounts[2]: address: " + accounts[2] + " balance: " + web3.eth.getBalance(accounts[2]));
  console.log("accounts[3]: address: " + accounts[3] + " balance: " + web3.eth.getBalance(accounts[3]));

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


// ============ Fund  ====================================================== //

it("Contributer1 sends 1 ETH, verify received",function(){

  proj = Project.deployed();
  
  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(1, "ether")}).then(function(){
    proj.getAmountContributed.call(contrib1).then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
    });
  });
}); 


it("Contributer2 sends 1 ETH, verify received",function(){

  proj = Project.deployed();
  
  return proj.fund(contrib2, {from: contrib2}, {value: web3.toWei(1, "ether")}).then(function(){
    proj.getAmountContributed.call(contrib2).then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
    });
  });
}); 


// ============ Refund  ==================================================== //

it("Contributer1 requests refund, verify received",function(){

  proj = Project.deployed();
  
  return proj.refund({from: contrib1}).then(function(){
    proj.getAmountContributed.call(contrib1).then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(0, "ether"), "error: amount not 0 for contrib1");
    });
  });
}); 

it("Contributer2 requests refund, verify received",function(){

  proj = Project.deployed();
  
  return proj.refund({from: contrib2}).then(function(){
    proj.getAmountContributed.call(contrib2).then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(0, "ether"), "error: amount not 0 for contrib2");
    });
  });
}); 

// ============ Closeout  ================================================== //



it("Verify project funds empty",function(){

  proj = Project.deployed();

  return proj.getAmountRaised.call().then(function(amount){
      assert.equal(amount, web3.toWei(0, "ether"), "error: contract not empty");
  });
}); 

});
