//todo: remove tabs


contract('Project', function(accounts) {

  admin    = accounts[0]; // contract creator / debug interface
  contrib1 = accounts[1];
  contrib2 = accounts[2];
  owner    = accounts[3];

  // Contract state
  const CREATED = 0;   
  const FUNDED  = 1;       
  const EXPIRED = 2;   
  const ERROR   = 3;   

  console.log("accounts[0]: address: " + accounts[0] + " balance: " + web3.eth.getBalance(accounts[0]));
  console.log("accounts[1]: address: " + accounts[1] + " balance: " + web3.eth.getBalance(accounts[1]));
  console.log("accounts[2]: address: " + accounts[2] + " balance: " + web3.eth.getBalance(accounts[2]));
  console.log("accounts[3]: address: " + accounts[3] + " balance: " + web3.eth.getBalance(accounts[3]));


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



// ============ First Contribute ================================================== //

it("Contributer sends 1 ETH, verify received",function(){

  proj = Project.deployed();
  
  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(1, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      //console.log("raised: " + amount)
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
    });
  });
}); 



it("Contributer requests refund 1 ETH",function(){

  proj = Project.deployed();

  return proj.refund(contrib1, {from: contrib1}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(0, "ether"), "error: did not refund");
    });
  });
});


it("Contributer sends 3 ETH, verify received",function(){
  proj = Project.deployed();
  
  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(3, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(3, "ether"), "error: amount not 3");
    });
  });
}); 


it("Verify Project is fully funded",function(){
  proj = Project.deployed();
  
  return proj.getState.call().then(function(state){
      assert.equal(state, FUNDED, "error: Project state not FUNDED");
  });
});

/*

it("[ADMIN] Send payout to owner, verify owner received",function(){

  proj = Project.deployed();
  begin_balance = web3.eth.getBalance(owner);

  return proj.payout({from: admin}).then(function(){

      end_balance = web3.eth.getBalance(owner);
      assert.equal(end_balance - begin_balance, web3.toWei(3, "ether"), "error: payout not 3");
  });
}); 


it("Verify project funds empty",function(){

  proj = Project.deployed();

  return proj.getAmountRaised.call().then(function(amount){
      assert.equal(amount, web3.toWei(0, "ether"), "error: contract not empty");
  });
}); 
*/

});
