/*
Automated Test status:

  Project Creation:
  DONE - Project created, constructor loads default values

  Project Contributions:
       - Contribute from multiple users

  Project Refunds:
  DONE - Refund request denied when deadline not reached yet
       - Refund request from non-contributer denied when deadline reached and project not fully funded 
  DONE - Refund request denied when project is fully funded
       - Refund request fullfilled when deadline reached and project not fully funded 

  Project Payouts:
  DONE - Payout request fullfilled when fundraising goal reached
  DONE - Payout request denied when project not fully funded
       - Payout request from non-owner is denied -- WILL CAUSE REVERT()

  FundHub:
       - Create multiple projects
*/



var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");

var gasLimit = 4500000;


contract('Test: Project contract', function(accounts) {

var coinbase  = accounts[0]; 
var alice     = accounts[1];
var bob       = accounts[2];
var carol     = accounts[3];

var templateProject = {
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 5
}



function ProjectInfo(i) {
   var result = {};
   result.owner = i[0];
   result.amount_goal = parseInt(i[1]);
   result.duration = parseInt(i[2]);
   result.deadline = parseInt(i[3]);
   return result;
};


function createProject(fundhub, owner, amount_goal, duration){

  var myProject = {};
  var info;

  return new Promise(function(resolve,reject){

    fundhub.createProject(amount_goal, duration, {from: owner}).then( function() {
      return fundhub.num_projects.call();
    })
    .then( function(value) {
      myProject.index = value;
      return fundhub.getProjectAddress(myProject.index);
    })
    .then( function(value) {
      myProject.address = value;
      return Project.at(myProject.address);
    })
    .then( function(value) {
      myProject.instance = value;      
      return myProject.instance.info.call();
    })
    .then(function(value){
      info = new ProjectInfo(value);
      myProject.owner = info.owner;
      myProject.amount_goal = info.amount_goal;
      myProject.duration = info.duration;
      myProject.deadline = info.deadline;
      console.log("-----------------------------");
      console.log("New project created:");
      console.log("project owner: " + myProject.owner);
      console.log("project address: " + myProject.address);
      console.log("project goal: " + myProject.amount_goal);
      console.log("project duration: " + myProject.duration);
      console.log("project deadline: " + myProject.deadline);
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
      console.log("-----------------------------");
      resolve(myProject);
  })
  .catch(function(e) {
    console.log(e);
    console.log("Error creating project; see log.");
  });

  });
}


/*
  it("Refund request from non-contributer denied", function(done) {  // TODO -- make sure deadline is reached!!

  var myProject = {};
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var myFundHub;
  var current_time; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub,templateProject.amount_goal, templateProject.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.index, {from: user_addr, value: amount_contribute, gas: 4500000});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Contribution unsuccessful!"); 
    })
    .then(function(){
      console.log("project duration: " + myProject.duration);
      console.log("project deadline: " + myProject.deadline);
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);      
      return myProject.instance.refund({from: alice}); // should fail
    })
    // Advance time until deadline reached
    //current_time = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    //  while(current_time < myProject.deadline) {
      
    //  }

    //  for (var i = 0; i < result.logs.length; i++) {
     // var log = result.logs[i];

     // if (log.event == "Transfer") {
        // We found the event!
    //    break;
    //  }
   // }

    .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: alice}); // should fail
    })

    
        .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: alice}); // should fail
    })
            .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: alice}); // should fail
    })
                .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: alice}); // should fail
    })
                    .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: bob}); // should fail
    })
    .then(function(){

      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      console.log("project balance: " + amount);
      assert.equal(amount.valueOf(), amount_contribute, "Invalid refund allowed!"); 
      done();
    })
    .catch(done);

  });
*/


it("Create Project, verify constructor", function(done) {

var testParams = {
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 5,
  user_addr: bob,
  amount_contribute: web3.toWei(1, "ether")
};

  var myProject = {};
  var myFundHub; 
  var my_deadline;

  FundingHub.new().then(function(value) {
    myFundHub = value;
    return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
  })
  .then(function(value) { 
    myProject = value;
    assert.equal(testParams.owner, myProject.owner, "Owner doesn't match!"); 
    assert.equal(testParams.amount_goal, myProject.amount_goal, "Amount goal doesn't match!"); 
    assert.equal(testParams.duration, myProject.duration, "Duration doesn't match!");
    //assert.equal(my_deadline, myProject.deadline, "Deadline doesn't match!");   
    done();
  })
  .catch(done);
});


  it("Project can receive a contribution", function(done) {

var testParams = {
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 5,
  user_addr: bob,
  amount_contribute: web3.toWei(1, "ether")
};

  var myProject = {};
  var myFundHub; 

  FundingHub.new().then( function(value) {
    myFundHub = value;
    return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
  })
  .then( function(value) {
    myProject = value;
    //LogContribute(myFundHub);
    //LogFund(myProject);
    return myFundHub.contribute(myProject.index, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
  })
  .then(function(value){    
    return web3.eth.getBalance(myProject.address.toString());
  })          
  .then( function(amount) {
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
    amount_contribute: web3.toWei(1, "ether")
  };

  var myProject = {};
  var myFundHub; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.index, {from: testParams.user_addr, value: testParams.amount_contribute, gas: 4500000});
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
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Invalid payout allowed!"); 
      done();
    })
    .catch(done);
  });

/* CAUSES REVERT()
  it("Payout request from non-owner is denied", function(done) {

  var myProject = {};
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.amount_goal, templateProject.duration); 
    })
    .then( function() {
      return fundhub.num_projects.call();
    })
    .then( function(value) {
      myProject.index = value;
      return fundhub.getProjectAddress(myProject.index);
    })
    .then( function(value) {
      myProject.address = value;
      return Project.at(myProject.address);
    })
    .then( function(value) {
      myProject.instance = value;      
      return myProject.instance.info.call();
    })
    .then(function(value){
      info = new ProjectInfo(value);
      myProject.owner = info.owner;
      myProject.amount_goal = info.amount_goal;
      myProject.duration = info.duration;
      myProject.deadline = info.deadline;
      return;
// Reuse for every test //  
    })

    .then( function() {
      return fundhub.contribute(myProject.index, {from: user_addr, value: amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), amount_contribute, "Contribution unsuccessful!"); 
    })
    .then( function() {
      return myProject.instance.payout({from: user_addr});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), amount_contribute, "Invalid payout allowed!"); 
      done();
    })
    .catch(done);
  });
*/

  it("Project payout allowed when fundraising goal reached", function(done) {

  var testParams = {
    owner: alice,
    amount_goal: web3.toWei(10, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(10, "ether")
  };

  var myProject = {};
  var myFundHub; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.index, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
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
    amount_goal: web3.toWei(10, "ether"),
    duration: 5,
    user_addr: bob,
    amount_contribute: web3.toWei(10, "ether")
  };

  var myProject = {};
  var myFundHub; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, testParams.owner, testParams.amount_goal, testParams.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.index, {from: testParams.user_addr, value: testParams.amount_contribute, gas: gasLimit});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), testParams.amount_contribute, "Contribution unsuccessful!"); 
    })
    .then(function(){
      return myProject.instance.refund({from: testParams.user_addr});
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
/*


  it("Refund request denied when deadline not reached yet", function(done) {

  var myProject = {};
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var myFundHub; 

    FundingHub.new().then( function(value) {
      myFundHub = value;
      return createProject(myFundHub, templateProject.amount_goal, templateProject.duration);
    })
    .then( function(value) {
      myProject = value;
      return myFundHub.contribute(myProject.index, {from: user_addr, value: amount_contribute, gas: 4500000});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Contribution unsuccessful!"); 
    })    
    .then(function(){
      return myProject.instance.refund({from: user_addr});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Invalid refund allowed!"); 
      done();
    })
    .catch(done);

  });

*/  

/*
  it("Project refund should be allowed after deadline reached and project not fully funded", function(done) {

  var myProject = {};
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject( templateProject.amount_goal, templateProject.duration); 
    })
    .then( function() {
      return fundhub.num_projects.call();
    })
    .then( function(value) {
      myProject.index = value;
      return fundhub.getProjectAddress(myProject.index);
    })
    .then( function(value) {
      myProject.address = value;
      return Project.at(myProject.address);
    })
    .then( function(value) {
      myProject.instance = value;      
      return myProject.instance.info.call();
    })
    .then(function(value){
      info = new ProjectInfo(value);
      myProject.owner = info.owner;
      myProject.amount_goal = info.amount_goal;
      myProject.duration = info.duration;
      myProject.deadline = info.deadline;
      return;
// Reuse for every test //  
    })
    .then( function() {      
      return fundhub.contribute(myProject.index, {from: user_addr, value: amount_contribute, gas: gasLimit})
    })
    .then(function(value){
      console.log("deadline: " + myProject.deadline);   //TODO - fix magic number
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);

      /// TODO - ADVANCE TIME UNTIL DEADLINE REACHED
      /// run with "testrpc -s 1" to pass (1 block/second).  would be better to manually advance time
      return myProject.instance.refund({from: user_addr});
    })
    .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: user_addr});
    })
    .then(function(){ // call second time, to give time for testrpc to mine new block (one block per transaction)
      return myProject.instance.refund({from: user_addr});
    })
    .then(function(value){
      console.log("deadline: " + myProject.deadline);   //TODO - fix magic number
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
      return myProject.instance.refund({from: user_addr});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })  
    .then(function(amount){
      assert.equal(amount.valueOf(), 0, "Refund didnt work!"); 
      done();
    })
    .catch(done);
  });
*/




// DEBUG Event Logs
/*
function LogFund(myProject) {  
  myProject.instance.Fund()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
    });
} 

function LogContribute(fundhub) {  
  fundhub.Contribute()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
    });
}  
*/

}); // contract
