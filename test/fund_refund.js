
var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");

var gasLimit = 4500000;

contract('Project: Basic fund and refund, single contributer', function(accounts) {
  
  coinbase  = accounts[0]; 
  alice     = accounts[1];
  bob       = accounts[2];
  carol     = accounts[3];

/*
Tests:
done - verify constructor
done - get reference to project instance
done - contribute 1 ETH
done - request refund - rejected
done - deadline reached 
done - request refund - allowed
*/

templateProject = {
  //instance: 0,
  address: '',
  owner: alice,
  amount_goal: web3.toWei(10, "ether"),
  duration: 50,
  deadline: 0,
  index: 1
}

blankProject = {
  //instance: 0,
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
  var proj;
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
      proj = value;      
      return proj.info.call();
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


  it("Project contribution should match", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var proj;
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
      proj = value;      
      return proj.info.call();
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
      return fundhub.contribute(myProject.index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000});
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


  it("Project payout allowed when fundraising goal reached", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(10, "ether");
  var proj;
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
      proj = value;      
      return proj.info.call();
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
      return fundhub.contribute(myProject.index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), myProject.amount_goal, "Amount raised doesn't match!"); 
    })
    .then( function() {
      return proj.payout({from: myProject.owner});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), 0, "Amount raised doesn't match!"); 
      done();
    })
    .catch(done);
  });



  it("Project refund request should be rejected before deadline reached", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var proj;
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
      proj = value;      
      return proj.info.call();
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
      return fundhub.contribute(myProject.index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
    })
    .then(function(){
      return proj.refund({from: user_addr});
    })
    .then(function(){
      return web3.eth.getBalance(myProject.address.toString());
    })          
    .then( function(amount) {
      //console.log("amount raised: " + amount);
      assert.equal(amount.valueOf(), amount_contribute, "Amount doesn't match!"); 
      done();
    })
    .catch(done);

  });

  

/*
  it("Project refund should be allowed after deadline reached and project not fully funded", function(done) {

  var myProject = blankProject;
  var user_addr = bob;
  var amount_contribute = web3.toWei(1, "ether");
  var proj;
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
      proj = value;      
      return proj.info.call();
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
      return fundhub.contribute(myProject.index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
    })
    .then(function(value){
      console.log("deadline: " + myProject.deadline);   //TODO - fix magic number
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
    .then(function(value){
      console.log("deadline: " + myProject.deadline);   //TODO - fix magic number
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
      return proj.refund({from: user_addr});
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
var proj;

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
      proj = value;      
      return proj.info.call();
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
