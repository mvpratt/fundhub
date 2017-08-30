
var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");

contract('Project: Basic fund and refund, single contributer', function(accounts) {
  

  coinbase  = accounts[0]; 
  alice     = accounts[1];
  bob       = accounts[2];
  carol     = accounts[3];

/*
Tests:
get reference to project instance
contribute 1 ETH
request refund - rejected
deadline reached 
request refund - allowed
*/


  it("Project contribution should match", function(done) {

  var owner = alice;
  var user_addr = bob;
  var amount_goal = web3.toWei(10, "ether");
  var duration = 50;
  var amount_contribute = web3.toWei(1, "ether");

  var proj;
  var fundhub; 
  var proj_index;


// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(coinbase, amount_goal, duration); 
    })
    .then( function() {
      return fundhub.num_projects.call()
    })
    .then( function(value) {
      proj_index = value;
      return fundhub.getProjectAddress(value);
    })
    .then( function(addr) {
      return Project.at(addr);
    })
    .then( function(value) {
      proj = value;      
    })
// Reuse for every test //  

    .then( function(value) {
      fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
    })
    .then(function(){
      return proj.getAmountRaised.call();
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Amount doesn't match!"); 
      done();
    })
    .catch(done);
  });



  it("Project refund should be rejected when deadline not reached", function(done) {

  var owner = alice;
  var user_addr = bob;
  var amount_goal = web3.toWei(10, "ether");
  var duration = 50;
  var amount_contribute = web3.toWei(1, "ether");
  var proj;
  var fundhub; 
  var proj_index; 

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(coinbase, amount_goal, duration); 
    })
    .then( function() {
      return fundhub.num_projects.call()
    })
    .then( function(value) {
      proj_index = value;
      return fundhub.getProjectAddress(value);
    })
    .then( function(addr) {
      return Project.at(addr);
    })
    .then( function(value) {
      proj = value;      
    })
// Reuse for every test //  
    .then( function() {      
      fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
    })
    .then(function(){
      return proj.refund({from: user_addr});
    })
    .then(function(){
      return proj.getAmountRaised.call();
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Amount doesn't match!"); 
      done();
    })
    .catch(done);

  });


  it("Project refund should be allowed after deadline reached and project not fully funded", function(done) {

  var owner = alice;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var amount_goal = web3.toWei(10, "ether");
  var duration = 1;  // TODO - make longer
  var proj;
  var fundhub; 
  var proj_index;


// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(coinbase, amount_goal, duration); 
    })
    .then( function() {
      return fundhub.num_projects.call()
    })
    .then( function(value) {
      proj_index = value;
      return fundhub.getProjectAddress(value);
    })
    .then( function(addr) {
      return Project.at(addr);
    })
    .then( function(value) {
      proj = value;      
    })
// Reuse for every test //  
    .then( function() {      
      fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
    })
    .then(function(){
      return proj.getDeadline.call();
    })
    .then(function(value){

      console.log("deadline: " + value);
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);

      /// TODO - ADVANCE TIME UNTIL DEADLINE REACHED
      /// run with "testrpc -s 1" to pass (1 block/second).  would be better to manually advance time
      return proj.refund({from: user_addr});
    })
    .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return proj.refund({from: user_addr});
    })
    .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return proj.refund({from: user_addr});
    })
    .then(function(){
      return proj.getDeadline.call();
    })
    .then(function(value){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      console.log("deadline: " + value);
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
      return proj.refund({from: user_addr});
    })
    .then(function(){
      return proj.getAmountRaised.call();
    })  
    .then(function(amount){
      assert.equal(amount.valueOf(), 0, "Refund didnt work!"); 
      done();
    })

    .catch(done);
  });


/*

function createProject(fundhub, owner, amount_goal, duration){

  var proj;  

  return new Promise(function(resolve,reject){

      fundhub.createProject(owner, amount_goal, duration, {from: owner, gas: 4500000})
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


function LogFund(proj) {  
  proj.OnFund()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
    });
} 

function LogContribute(fundhub) {  
  fundhub.OnContribute()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
    });
}  
*/
}); // contract
