

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

    FundingHub.new({from: coinbase})
      .then(function(fundhub){
        return createProject(fundhub);
      })
      .then(function(proj){
        return proj.getVersion.call();
      })
      .then(function(version){
          assert.equal(version.valueOf(), 2, "Version doesn't match!"); 
          done();
      })
      .catch(done);
  });


  it("Project contribution should match", function(done) {

  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var proj;
  var fundhub; 
  var instance; 


    FundingHub.new({from: coinbase})
      .then(function(instance){
        fundhub = instance;
        return createProject(fundhub);
      })
      .then(function(instance){
        proj = instance;
        return fundhub.getNumProjects.call();
      })
      .then(function(proj_index){
        return fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
      })
      .then(function(){
        return proj.getAmountRaised.call();
      })  
      .then(function(amount){
          assert.equal(amount.valueOf(), amount_contribute, "Amount doesn't match!"); 
          done();
      })
      .catch(done);
  });



function createProject(fundhub){

  var user_addr = alice;
  var amount_goal = web3.toWei(10, "ether");
  var duration = 50;
  var proj;  

  return new Promise(function(resolve,reject){

      fundhub.createProject(user_addr, amount_goal, duration, {from: user_addr, gas: 4500000})
        .then(function(){
          return fundhub.getNumProjects.call();
        })
        .then(function(num){
          return fundhub.getProjectAddress.call(num);
        })
        .then(function(addr){
          return Project.at(addr);
        })
        .then(function(proj){
          resolve(proj);
        })
        .catch(function(e) {
          console.log(e);
        });

  });
} // function

}); // contract
