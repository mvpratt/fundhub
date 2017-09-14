/*
Automated Test status 9/15/2017:

  Project Creation:
  PASS - Project created, constructor loads default values

  Project Contributions:
  PASS - Contribute from user account

  Project Refunds:
  PASS - Refund request denied when deadline not reached yet
  PASS - Refund request from non-contributer denied (AND deadline reached and project not fully funded) 
  PASS - Refund request denied if deadline reached and project is fully funded
  PASS - Refund request fullfilled if deadline reached and project not fully funded 

  Project Payouts:
  PASS - Payout request fullfilled when fundraising goal reached
  PASS - Payout request denied when project not fully funded
  PASS - Payout request from non-owner is denied 

  Other:
  N/A - Test in UI - Create multiple projects
  N/A - Test in UI - Contribute from multiple accounts
  
*/


var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");


contract('Test: Project contract', function(accounts) {

  const gasLimit = 4500000;
  const user_names = ['Coinbase', 'Alice', 'Bob', 'Carol'];
  const required_user_balance = [1,1,4,1]; // units of ETH

  const coinbase  = accounts[0]; 
  const alice     = accounts[1];
  const bob       = accounts[2];
  const carol     = accounts[3];


  checkForLowBalances();



function showUserBalances() {
  for (var i = 0; i < user_names.length; i++) {
    console.log(user_names[i] + ": balance : " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[i]), "ether") + " ETH");  
  }
}

function checkForLowBalances() {

  var balance;

  for (var i = 0; i < user_names.length; i++) {
    balance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[i]));
    
    if (balance < required_user_balance[i]) {
          console.log("WARNING: " + user_names[i] + "'s balance is below required minimum for this test : " + required_user_balance[i] + " ETH");
    }
  }
}


function increaseTime(seconds){

  return new Promise(function(resolve,reject){

    web3.currentProvider.sendAsync({jsonrpc: "2.0", method: "evm_increaseTime", params: [seconds], id: 0 },
      function(err, result) {
        resolve(true);
    }
    );
  });    
}

function mineBlock(){

  return new Promise(function(resolve,reject){

    web3.currentProvider.sendAsync({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0 },
      function(err, result) {
        resolve(true);
    }
    );
  });    
}


// Project "struct"
function ProjectTemplate() {
  var project = {}
    project.owner = '';
    project.address = ''; 
    project.amount_goal = 0;
    project.deadline = 0;
    project.instance = 0;
    project.index = 0;
    return project;
}


function logProjectDetails(project) {

    console.log("-----------------------------");
    console.log("New project created:");
    console.log("project owner: " + project.owner);
    console.log("project address: " + project.address);
    console.log("project goal: " + project.amount_goal);
    console.log("project deadline: " + project.deadline);
    console.log("project index: " + project.index);
    console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
    console.log("-----------------------------");
    return;
}


function getProjectAddress(fundhub,index) {

  return new Promise(function(resolve,reject){
    resolve(fundhub.myProjects.call(index));
  });
}


function createProject(fundhub, owner, amount_goal, duration){

  var myProject = new ProjectTemplate();

  return new Promise(function(resolve,reject){

    fundhub.createProject(amount_goal, duration, {from: owner, gas: gasLimit})
    .then(function(){
      return fundhub.num_projects.call();
    })
    .catch(function(error){
      console.log("fundhub.createProject() exception");
      return;
    })
    .then(function(value) {
      myProject.index = value;
      return getProjectAddress(fundhub, myProject.index);
    })
    .then(function(value) {
      myProject.address = value;
      return Project.at(myProject.address);
    })
    .then(function(value) {
      myProject.instance = value;      
      return myProject.instance.info.call();
    })
    .then(function(value){
      myProject.owner = value[0];
      myProject.amount_goal = parseInt(value[1]);
      myProject.deadline = parseInt(value[2]);
      logProjectDetails(myProject);
      resolve(myProject);
  })
  .catch(function(e) {
    console.log(e);
    console.log("Error creating project; see log.");
  })
  })
}


it("Create Project, verify constructor", function(done) {

var testParams = {
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 5,
  user_addr: bob,
  amount_contribute: 0
};

  var myProject = {};
  var myFundHub; 

  FundingHub.new().then(function(value) {
    myFundHub = value;
    return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
  })
  .then(function(value) { 
    myProject = value;
    assert.equal(testParams.owner, myProject.owner, "Owner doesn't match!"); 
    assert.equal(testParams.amount_goal, myProject.amount_goal, "Amount goal doesn't match!"); 
    done();
  })
  .catch(done);
});




it("Project can receive a contribution", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(10, "ether"),
    duration: 5,
    contributer: bob,
    amount_contribute: web3.toWei(1, "ether")
  };

  var myProject = {};
  var myFundHub;

  var gasUsed; 

  FundingHub.new().then(function(value) {
    myFundHub = value;
    return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
  })
  .catch(function(error){
      console.log("createProject() exception");
      return;
  })
  .then(function(value) {
    myProject = value;
    return myFundHub.contribute(myProject.address, {from: testParams.contributer, value: testParams.amount_contribute, gas: gasLimit});
  })
  .catch(function(error){
      console.log("contribute() exception");
      return;
  })
  .then(function(value){    
    return web3.eth.getBalance(myProject.address.toString());
  })          
  .then(function(amount) {
    assert.equal(amount.valueOf(), testParams.amount_contribute, "Amount doesn't match!"); 
    done();
  })
  .catch(done);
  
});


  it("Payout requested, denied when project not fully funded", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(10, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(0.1, "ether")
  };

  var myProject = {};
  var myFundHub; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.address, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Contribution unsuccessful!"); 
    })
    .then( function() {
      return myProject.instance.payout({from: myProject.owner});
    })
    .catch(function(error){
      console.log("payout() request denied");
      return;
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Invalid payout allowed!"); 
      done();
    })
    .catch(done);
  });


  it("Project payout allowed when fundraising goal reached", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(0.1, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(0.1, "ether")
  };

  var myProject = {};
  var myFundHub; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.address, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), myProject.amount_goal, "Contribution unsuccessful!"); 
    })
    .then( function() {
      return myProject.instance.payout({from: myProject.owner});
    })
    .catch(function(error){
      console.log("payout() request denied");
      return;
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), 0, "Payout failed!"); 
      done();
    })
    .catch(done);
  });



  it("Refund request denied when project is fully funded", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(1, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(1, "ether")
  };

  var myProject = {};
  var myFundHub; 

    // create project and contribute some funds
    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .catch(function(error){
      console.log("createProject() exception");
      return;
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.address, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .catch(function(error){
      console.log("contribute() exception");
      return;
    })
    // verify contribution
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })
    .catch(function(error){
      console.log("getBalance() exception");
      return;
    })
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Contribution unsuccessful!"); 
      assert.equal(amount.valueOf(), testParams.amount_goal, "Funding goal not reached!");
      return;
    })

    // request a refund, should be denied
    .then(function(){
      return myProject.instance.refund({from: testParams.user_addr});
    })
    .catch(function(error){
      console.log("refund() exception");
      return;
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })
    .catch(function(error){
      console.log("getBalance() exception");
      return;
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Invalid refund allowed!"); 
      done();
    })
    .catch(done);

  });


  it("Refund request denied when deadline not reached yet -AND- Refund request allowed when deadline reached and project not fully funded", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(1, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(0.1, "ether")
  };

  var myProject = {}; 
  var myFundHub;

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.address, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Contribution unsuccessful!"); 
      return;
    })

    // Refund request should be denied at first
    .then(function(){
      return myProject.instance.refund({from: testParams.user_addr});
    })
    .catch(function(error){
      console.log("refund() exception");
      return;
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Invalid refund allowed!"); 
      return;
    })

    // advance time
    .then( function() {    
      return increaseTime(10000);
    })
    .then(function() {
      return mineBlock();
    })

    // Now refund request should be granted
    .then(function(){
      return myProject.instance.refund({from: testParams.user_addr});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), 0, "Refund request failed!"); 
      done();
    })    
    .catch(done);

  });


  it("Refund request from non-contributer denied", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(1, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(0.1, "ether")
  };

  var myProject = {}; 
  var myFundHub;

    // create project
    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })

    // contribute funds
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.address, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Contribution unsuccessful!"); 
      return;
    })

    // advance time past deadline
    .then( function() {    
      return increaseTime(10000);
    })
    .then(function() {
      return mineBlock();
    })

    // Normally refund() would be allowed, but should be denied from non-contributers.
    .then(function(){
      return myProject.instance.refund({from: testParams.owner});
    })
    .catch(function(error){
      console.log("refund() exception");
      return;
    })    
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Invalid refund allowed!"); 
      done();
    })    
    .catch(done);

  });


  it("Payout request from non-owner is denied", function(done) {

    var testParams = {
      owner: alice,
      amount_goal: web3.toWei(1, "ether"),
      duration: 5,
      user_addr: bob,
      amount_contribute: web3.toWei(1, "ether")
    };

    var myProject = {}; 
    var myFundHub;

    // create project
    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })

    // contribute funds
    .then(function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.address, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then(function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Contribution unsuccessful!"); 
      return;
    })

    // Request payout, should be denied.
    .then(function(){
      return myProject.instance.payout({from: testParams.user_addr});
    })
    .catch(function(error){
      console.log("payout() request denied");
      return;
    })    
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then(function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Invalid payout allowed!"); 
      done();
    })    
    .catch(done);

  });

}); // contract
