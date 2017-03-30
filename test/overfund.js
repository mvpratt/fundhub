

contract('Project: Overfunding', function(accounts) {

// boilerplate //

  var proj;
  var fundhub;

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

it("Get Project address", function() {

  fundhub = FundingHub.deployed();

  return fundhub.getProjectAddress.call().then(function(addr) {
    proj = Project.at(addr);
  }).then(function() {
      proj.getCreator.call().then(function(addr) {
      assert.equal(addr, addr, "error: creator not set"); // not really testing anything.  creator unknown (truffle?)
  });
 });
});


it("Check owner", function() {

  return proj.getOwner.call().then(function(own) {
      assert.equal(own, owner, "error: owner not set");
    });
});


it(" Check fundraising goal", function() {

  return proj.getAmountGoal.call().then(function(id) {
      assert.equal(id.valueOf(), web3.toWei(3, "ether"), "error: fundraising goal not 3 ETH");
    });
});


// ============ Overfund  ================================================== //

it("Contributer sends 3 ETH, verify received",function(){
  
  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(3, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(3, "ether"), "error: amount not 3");
    });
  });
}); 

it("Verify Project is fully funded",function(){
  
  return proj.getState.call().then(function(state){
      assert.equal(state, FUNDED, "error: Project state not FUNDED");
  });
});


it("Contributer sends funds to already fully funded project, verify funds returned",function(){

  begin_balance_contrib = web3.eth.getBalance(contrib1).toNumber();
  begin_balance_project = web3.eth.getBalance(proj.address).toNumber();

  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(2, "ether")}).then(function(){
    end_balance_contrib = web3.eth.getBalance(contrib1).toNumber();
    end_balance_project = web3.eth.getBalance(proj.address).toNumber();

    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(3, "ether"), "error: amount not 3");
      assert.equal(begin_balance_contrib, end_balance_contrib, "error: contrib balance should not change");
      assert.equal(begin_balance_project, end_balance_project, "error: project balance should not change");      
    });
  });
}); 


// ============ Payout  ==================================================== //

// TODO - how to check requester received funds, more precisely? (minus gas price)
it("Owner request payout, verify owner received",function(){

  begin_balance = web3.eth.getBalance(owner);

  return proj.payout({from: owner}).then(function(){

      end_balance = web3.eth.getBalance(owner);
      assert.equal(end_balance > begin_balance, true, "error: payout not 3"); 
  });
}); 


it("Verify project funds empty",function(){

  return proj.getAmountRaised.call().then(function(amount){
      assert.equal(amount, web3.toWei(0, "ether"), "error: contract not empty");
  });
}); 

});
