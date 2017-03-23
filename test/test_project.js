

// accounts[0] = coinbase / admin
// contrib1 = contributer 1
// contrib2 = contributer 2
// owner = owner


contract('Project', function(accounts) {

admin = accounts[0];
contrib1 = accounts[1];
contrib2 = accounts[2];
owner = accounts[3];

it("[ADMIN] Set owner", function() {

  proj = Project.deployed();
  proj.setOwner(owner);

  return proj.getOwner.call().then(function(own) {
      assert.equal(own, owner, "error: owner not set");
    });
});


it("Owner sets ammount to be raised (fundraising goal)", function() {

  proj = Project.deployed();
  proj.setAmountGoal(3, {from: owner});

  return proj.getAmountGoal.call().then(function(id) {
      assert.equal(id.valueOf(), 3, "error: fundraising goal not 3");
    });
});



// ============ First Contribute ================================================== //

it("Contributer sends 1 ETH, verify received",function(){

  proj = Project.deployed();
  
  return proj.fund({from: contrib1}, {value: web3.toWei(1, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(1, "ether"), "error: amount not 1");
    });
  });
}); 


it("Contributer requests refund",function(){

  proj = Project.deployed();

  return proj.refund({from: contrib1}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(0, "ether"), "error: did not refund");
    });
  });
});


it("Contributer sends 3 ETH, verify received",function(){
  proj = Project.deployed();
  
  return proj.fund({from: contrib1}, {value: web3.toWei(3, "ether")}).then(function(){
    proj.getAmountRaised.call().then(function(amount) {
      assert.equal(amount.valueOf(), web3.toWei(3, "ether"), "error: amount not 3");
    });
  });
}); 


it("[ADMIN] Send payout to owner, verify owner received",function(){

  proj = Project.deployed();
  begin_balance = web3.eth.getBalance(owner);

  return proj.payout({from: accounts[0]}).then(function(){

      end_balance = web3.eth.getBalance(owner);
      assert.equal(end_balance - begin_balance, web3.toWei(3, "ether"), "error: payout not 3");
  });


}); 


});
