
var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");

var gasLimit = 4500000;
contract('Test: Project contract', function(accounts) {

  var coinbase  = accounts[0]; 
  var alice     = accounts[1];
  var bob       = accounts[2];
  var carol     = accounts[3];

var templateProject = {
  instance: 0,
  address: '',
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 50,
  deadline: 0,
  index: 1
}

var blankProject = {
  instance: 0,
  address: '',
  owner: '',
  amount_goal: 0,
  duration: 0,
  deadline: 0,
  index: 0
}

function ProjectInfo(i) {
   var result = {};
   result.owner = i[0];
   result.amount_goal = parseInt(i[1]);
   result.duration = parseInt(i[2]);
   result.deadline = parseInt([3]);
   return result;
};


  it("Create Project, verify constructor", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  //
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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
      assert.equal(templateProject.owner, myProject.owner, "Owner doesn't match!"); 
      assert.equal(templateProject.amount_goal, myProject.amount_goal, "Amount goal doesn't match!"); 
      assert.equal(templateProject.duration, myProject.duration, "Duration doesn't match!");  
      done();
    })
    .catch(done);
  });


  it("Project can receive a contribution", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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
      //console.log("project index: " + myProject.index);
      //console.log("project address: " + myProject.address);
      //console.log("balance: project" + web3.eth.getBalance(myProject.address.toString()));
      return;
// Reuse for every test //  
    })
    .then( function() {
      return fundhub.contribute(myProject.index, {from: user_addr, value: amount_contribute, gas: gasLimit});
    })
    .then(function(){
      //console.log("project index: " + myProject.index);
      //console.log("project address: " + myProject.address);
      //console.log("balance: project " + web3.eth.getBalance(myProject.address.toString()));
      //console.log("balance bob: " + web3.eth.getBalance(bob));      
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Amount doesn't match!"); 
      done();
    })
    .catch(done);
  });


  it("Payout requested, denied when project not fully funded", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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
      return fundhub.contribute(myProject.index, {from: user_addr, value: amount_contribute, gas: 4500000});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), amount_contribute, "Contribution unsuccessful!"); 
    })
    .then( function() {
      return myProject.instance.payout({from: myProject.owner});
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

/* CAUSES REVERT()
  it("Payout request from non-owner is denied", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(10, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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




  it("Refund request from non-contributer denied", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      assert.equal(amount.valueOf(), amount_contribute, "Contribution unsuccessful!"); 
    })
    .then(function(){
      return myProject.instance.refund({from: alice});
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


  it("Refund request denied when deadline not reached yet", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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
    .then(function(){
      return myProject.instance.refund({from: user_addr});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), amount_contribute, "Invalid refund allowed!"); 
      done();
    })
    .catch(done);

  });

  

/*
  it("Project refund should be allowed after deadline reached and project not fully funded", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  
  var fundhub; 
  var info;

// Reuse for every test //
    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
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



/*
function createProject() {

var templateProject = {
  //instance: 0,
  address: '',
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 50,
  deadline: 0,
  index: 1
}

var myProject = {};
var fundhub;


    FundingHub.new()
    .then( function(instance) {
       fundhub = instance;
       return fundhub.createProject(templateProject.owner, templateProject.amount_goal, templateProject.duration); 
    })
    .then( function() {
      return fundhub.num_projects.call();
    })
    .then( function(value) {
      myProject.index = value;
      return fundhub.getProjectAddress(templateProject.index);
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
    })  
    return myProject;
}
*/


/*


function LogFund(proj) {  
  myProject.instance.OnFund()
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
