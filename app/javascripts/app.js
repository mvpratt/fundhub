
var accounts;  // array of all accounts

var admin;    // contract creator / debug interface
var contrib1; // Contributer 1
var contrib2;
var owner;    // Project owner

var proj;      // Test project
var fundhub;   // Main contract
 

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}


function showUserBalances() {

  console.log("admin: balance    : " + web3.fromWei(web3.eth.getBalance(admin), "ether") + " ETH");
  console.log("contrib1: balance : " + web3.fromWei(web3.eth.getBalance(contrib1), "ether") + " ETH");
  console.log("contrib2: balance : " + web3.fromWei(web3.eth.getBalance(contrib2), "ether") + " ETH");
  console.log("owner: balance    : " + web3.fromWei(web3.eth.getBalance(owner), "ether") + " ETH");
}


function createProject () {

  var amount_goal = web3.toWei(document.getElementById("i_amount_goal").value, "ether");
  var duration = document.getElementById("i_duration").value;

  fundhub.createProject(owner, amount_goal, duration, {from: admin, gas: 4500000})
  .then(function(){
    return fundhub.getNumProjects.call();
  })
  .then(function(num){
    console.log("Num projects: " + num);
    return refreshProjectTable(num);    
  })
  .then(function(){
    setStatus("Finished creating project");
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating project; see log.");
  });
}

function refreshProjectTable(index){

  return new Promise(function(resolve,reject){

  fundhub.getProjectAddress.call(index)
  .then(function(addr){
    console.log("Project index: " + index);
    console.log("Project address: " + addr);   
    var state_element = document.getElementById("project_address_"+index);
    state_element.innerHTML = addr;
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.getState.call();
  })    
  .then(function(value) {
    var state_element = document.getElementById("state_"+index);
    state_element.innerHTML = value.valueOf();
    return proj.getAmountGoal.call();
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal_"+index);
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return proj.getDeadline.call();
  })
  .then(function(value) {
    var state_element = document.getElementById("deadline_"+index);
    state_element.innerHTML = value.valueOf();
    return proj.getAmountRaised.call();
  })  
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised_"+index);
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return;
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating project; see log.");
  });

  resolve(true);

  });
}


function refreshUserTable(index){

  return new Promise(function(resolve,reject){

    var refill_element = document.getElementById("user_address_"+index);
    refill_element.innerHTML = accounts[index];

    var refill_element = document.getElementById("user_balance_"+index);
    refill_element.innerHTML = web3.fromWei(web3.eth.getBalance(accounts[index]), "ether");

    resolve(true);

  })
}

function contribute() {

  var amount_contribute = web3.toWei(document.getElementById("contrib_amount").value, "ether");
  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute})
  .then(function(){
    setStatus("Contributed " + web3.fromWei(amount_contribute, "ether") + " ETH from user " + user_index + "!" );
    return refreshProjectTable(proj_index);    
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })  
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
  });
}


function requestPayout() {

  var proj_index = Number(document.getElementById("i_project_num").value);

  fundhub.getProjectAddress.call(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.payout({from: owner})
  })
  .then(function(){
    setStatus("Payout sent!");
    return refreshProjectTable(proj_index); 
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting payout; see log.");
  });
}


function requestRefund() {

  var proj_index = Number(document.getElementById("i_project_num").value);

  fundhub.getProjectAddress.call(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.refund({from: contrib1, gas: 4500000})
  })
  .then(function(){
    setStatus("Refund sent!");
    return refreshProjectTable(proj_index); 
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting refund; see log.");
  });
}


window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    } 

    admin    = accs[0]; // contract creator / debug interface
    contrib1 = accs[1];
    contrib2 = accs[2];
    owner    = accs[3];

    accounts = accs;

    showUserBalances();

    fundhub = FundingHub.deployed();
  
    fundhub.getVersion.call()
    .then(function(value) {
      console.log("FundingHub version: " + value);
      console.log("FundingHub address: " + fundhub.address);
    })
    .catch(function(e) {
      console.log(e);
      setStatus("Error getting version; see log.");
    });
  });
}


/*
function getAmountRaised () {

  proj.getAmountRaised.call()
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting amount raised; see log.");
  });
}


function getAmountGoal () {

  proj.getAmountGoal.call()
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting amount goal; see log.");
  });
}


function getState () {

  proj.getState.call()
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting state; see log.");
  });
}

function getDeadline () {

  proj.getDeadline.call()
  .then(function(value) {
    var state_element = document.getElementById("deadline");
    state_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting deadline; see log.");
  });
}
*/


/*function LogFund() {  
  proj.OnFund()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log(web3.fromWei(value.args.amount, "ether") + " ethers sent from " + WhoFromAddr(value.args.sender));
    });
}*/

/*
function logFullyFundedEvents() {

  var fullyFundedEvent = Project.deployed().FullyFunded();

  fullyFundedEvent.watch(function(error, result) {
    if (!error) {
        console.log("FullyFunded() event");
        return;
    }
    else {
        console.error(error);
        return;
    }
  });
}


function logWarningEvents() {

  var warningEvent = Project.deployed().LogWarning();

  warningEvent.watch(function(error, result) {
    if (!error) {
        console.log("LogWarning() event");
        return;
    }
    else {
        console.error(error);
        return;
    }
  });
}
*/

