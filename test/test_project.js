

// accounts[0] = creater/owner
// accounts[1] = contributer 1
// accounts[2] = contributer 2


contract('Project', function(accounts) {


it("Owner sets ammount to be raised", function() {
  arx = Project.deployed();
  arx.setAmountGoal(3, {from: accounts[0]});

  return arx.getAmountGoal.call().then(function(id) {
      assert.equal(id.valueOf(), 3, "error: ammount goal not 3");
    });
});




// ============ First Refill ================================================== //

it("Contributer sends 1 ETH",function(){
  arx = Project.deployed();
  
  return arx.fund({from: accounts[1]}, {value: web3.toWei(1, "ether")}).then(function(){
    arx.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
    });
  });
}); 


/*
it("Pharmacy changes prescription state to FILLED", function() {
  arx = Project.deployed();
  
  return arx.fillRx({from: accounts[2]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, FILLED, "error: Rx state not FILLED");
    });
  });  
});


it("Patient checks refills left",function(){
  arx = Project.deployed();
  
  return arx.getRefillsLeft.call().then(function(refill) {
      assert.equal(refill, 2, "error: refills left not decremented");
  });
}); 


// ============ Second Refill ================================================== //

it("Patient requests 2nd refill",function(){
  arx = Project.deployed();
  
  return arx.reqRefillRx({from: accounts[1]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, REFILL_REQUESTED, "error: Rx state not REFILL_REQUESTED");
    });
  });
}); 


it("Pharmacy changes prescription state to FILLED", function() {
  arx = Project.deployed();
  
  return arx.fillRx({from: accounts[2]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, FILLED, "error: Rx state not FILLED");
    });
  });  
});


it("Patient checks refills left",function(){
  arx = Project.deployed();
  
  return arx.getRefillsLeft.call().then(function(refill) {
      assert.equal(refill, 1, "error: refills left not decremented");
  });
}); 


// ============ Third Refill ================================================== //

it("Patient requests 2nd refill",function(){
  arx = Project.deployed();
  
  return arx.reqRefillRx({from: accounts[1]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, REFILL_REQUESTED, "error: Rx state not REFILL_REQUESTED");
    });
  });
}); 


it("Pharmacy changes prescription state to EXPIRED", function() {
  arx = Project.deployed();
  
  return arx.fillRx({from: accounts[2]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, EXPIRED, "error: Rx state not EXPIRED");
    });
  });  
});


it("Patient checks refills left",function(){
  arx = Project.deployed();
  
  return arx.getRefillsLeft.call().then(function(refill) {
      assert.equal(refill, 0, "error: refills left not decremented");
  });
});
*/

});
