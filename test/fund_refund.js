

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

  createProject()
        .then(function(myproj){
          return myproj.getVersion.call();
        })
        .then(function(version){
          assert.equal(version.valueOf(), 2, "Version doesn't match!"); 
          done();
        })
        .catch(done);
  });



function createProject(){

  var user_addr = alice;
  var amount_contribute = web3.toWei(1, "ether");
  var amount_goal = web3.toWei(10, "ether");
  var duration = 50;
  var proj;
  var fundhub;    

  return new Promise(function(resolve,reject){

    FundingHub.new({from: coinbase})
        .then(function(instance) {
          fundhub = instance;
          fundhub.createProject(user_addr, amount_goal, duration, {from: user_addr, gas: 4500000});
        })  
        .then(function(){
          return fundhub.getNumProjects.call();
        })
        .then(function(num){
          //console.log("num projects " + num);
          return fundhub.getProjectAddress.call(num);
        })
        .then(function(addr){
          //console.log("address: "+addr);
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
