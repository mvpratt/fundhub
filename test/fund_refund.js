

contract('Project: Basic fund and refund, single contributer', function(accounts) {
  

  coinbase  = accounts[0]; 
  alice     = accounts[1];
  bob       = accounts[2];
  carol     = accounts[3];

  // Contract state
  //const CREATED = 0;   
  //const FULLY_FUNDED  = 1;       
  //const PAID_OUT = 2;   
 
/*
Tests:
get reference to project instance
contribute 1 ETH
request refund - rejected
deadline reached 
request refund - allowed
*/
 
  it("FundingHub version should match", function(done) {
    
    FundingHub.new({from: coinbase}).then(
      function(fundhub) {
        fundhub.getVersion.call().then(
          function(version) { 
            assert.equal(version, 1, "Version doesn't match!"); 
            done();
        })
        .catch(done);
    }).catch(done);
  });


  it("Project version should match", function(done) {

  var proj_index = 1;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var amount_goal = web3.toWei(10, "ether");
  var duration = 50;    

    FundingHub.new({from: coinbase}).then(
      function(fundhub) {
        fundhub.createProject(user_addr, amount_goal, duration, {from: user_addr, gas: 4500000})
        .then(function(){
          return fundhub.getNumProjects.call();
        })
        .then(function(num){
          console.log("num projects " + num);
          return fundhub.getProjectAddress.call(proj_index);
        })
          .then(function(addr){
            return Project.at(addr);
          })
          .then(function(instance){
            proj = instance;  
            return proj.getVersion.call();
          })
          .then(function(version){
            assert.equal(version, 2, "Version doesn't match!"); 
            done();
        })
        .catch(done);
    }).catch(done);
  });


//Note: Alice is the creator and owner of the project contract
/*
it("Contribute and request Refund", function() {

  var fundhub = FundingHub.deployed();
  var proj = Project.deployed();
  var proj_index = 1;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");

  fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
  .then(function(){
    return proj.getAmountRaised.call();
  })
  .then(function(value) {
      assert.equal(value, amount_contribute, "error: contribution amount failed"); 
  });
});
*/

/*

it("[ADMIN] Check owner", function() {
  return proj.getOwner.call().then(function(own) {
      assert.equal(own, owner, "error: owner not set");
    });
});

it("Owner sets amount to be raised (fundraising goal)", function() {
  return proj.getAmountGoal.call().then(function(id) {
      assert.equal(id.valueOf(), web3.toWei(3, "ether"), "error: fundraising goal not 3 ETH");
    });
});


// ============ Fund & Refund ============================================== //

it("Contributer sends 1 ETH, verify received",function(){

  

  return proj.fund(contrib1, {from: contrib1}, {value: web3.toWei(1, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
    });
  });
}); 


it("Contributer requests refund 1 ETH",function(){

  

  return proj.refund({from: contrib1}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(0, "ether"), "error: did not refund");
    });
  });
});


// ============ Payout  ==================================================== //

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
*/

});
