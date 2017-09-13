// AUTHOR: <mvpratt>

var fundhub;   // Main contract

const gasLimit = 4500000;
const max_projects_displayed = 4; 
const max_users = 3;
const user_names = ['Coinbase', 'Alice', 'Bob', 'Carol'];

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function logTimestamp(message) {
    console.log("Log Timestamp: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp + "  Log: " + message);
}


function showUserBalances() {
  for (var i = 0; i < user_names.length; i++) {
    console.log(user_names[i] + "\t: balance : " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[i]), "ether") + " ETH");  
  }
}


function ProjectInfo(i) {
   var result = {};
   result.owner = i[0];
   result.amount_goal = parseInt(i[1]);
   result.deadline = parseInt(i[2]);
   return result;
};


// myProject struct / function
/*
function myProject() {
  var myProject = {
    owner: '',
    address: '', 
    amount_goal: 0,
    deadline: 0,
    instance: 0,
    index: 0
  }
}
*/

/*
var errorHandler = function (error,result) {
    console.log("payout() exception");
    console.log(error);
    setStatus("Error getting payout; see log.");
    return;
}
*/

function getProjectAddress(index) {

  return new Promise(function(resolve,reject){
    resolve(fundhub.myProjects.call(index));
  });
}

function createProject() {

  return new Promise(function(resolve,reject){

  const default_amount_goal = web3.toWei(10, "ether");
  const default_duration = 200;

  var success = true;
  var myProject = {};
  var info;
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = web3.eth.accounts[user_index];  
  var amount_goal = document.getElementById("i_amount_goal").value;
  var duration = document.getElementById("i_duration").value;

  if (amount_goal === undefined || amount_goal === null || amount_goal === ""){
    amount_goal = default_amount_goal;
  }
  else {
    amount_goal = web3.toWei(amount_goal, "ether");
  }

  if (duration === undefined || duration === null || duration === ""){
    duration = default_duration;
  }

  fundhub.createProject(amount_goal, duration, {from: user_addr, gas: gasLimit})
    .catch(function(e) {
      success = false;
      console.log("createProject() exception");
      console.log(e);
      setStatus("Error creating project; see log.");
      return;
    })
    .then(function(){
      return fundhub.num_projects.call();
    })
    .then(function(value) {
      myProject.index = value;
      return getProjectAddress(myProject.index);
    })
    .then(function(value) {    
      myProject.address = value.toString();
      return Project.at(myProject.address);
    })
    .then(function(value) {
      myProject.instance = value;      
      return myProject.instance.info.call();
    })
    .then(function(value){
      info = new ProjectInfo(value);
      myProject.owner = info.owner;
      myProject.amount_goal = info.amount_goal;
      myProject.deadline = info.deadline;
      console.log("-----------------------------");
      console.log("New project created:");
      console.log("project owner: " + myProject.owner);
      console.log("project address: " + myProject.address);
      console.log("project goal: " + myProject.amount_goal);
      console.log("project deadline: " + myProject.deadline);
      console.log("current time: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp);
      console.log("-----------------------------");
  })
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    if(success) {
      setStatus("New project, Project " + myProject.index + " created by " + user_names[user_index] + "!");
    }
    resolve();
  })
  })
}

function refreshProjectTableByIndex(index){

  return new Promise(function(resolve,reject){

  var myProject = {};
  var info;
  var project_state;
  var project_balance;
  var current_time;
  var refill_element;
  var state_element;

  myProject.index = index;

  getProjectAddress(myProject.index)
    .then(function(value) {
      myProject.address = value.toString();
      return Project.at(myProject.address);
    })
    .then(function(value) {
      myProject.instance = value;      
      return myProject.instance.paid_out.call();
    })
    .then(function(value) {
      myProject.paid_out = value;      
      return myProject.instance.info.call();
    })    
    .then(function(value){
      info = new ProjectInfo(value);
      myProject.owner = info.owner;
      myProject.amount_goal = info.amount_goal;
      myProject.deadline = info.deadline;

      project_balance = web3.eth.getBalance(myProject.address).valueOf();
      current_time = web3.eth.getBlock(web3.eth.blockNumber).timestamp;

      refill_element = document.getElementById("owner_address_"+myProject.index);
      refill_element.innerHTML = getUserName(myProject.owner);

      state_element = document.getElementById("project_address_"+myProject.index);
      state_element.innerHTML = (myProject.address.substring(0,6) + "...." + myProject.address.substring(38,42));

      refill_element = document.getElementById("amount_goal_"+myProject.index);
      refill_element.innerHTML = web3.fromWei(myProject.amount_goal, "ether");
     
      refill_element = document.getElementById("amount_raised_"+myProject.index);
      refill_element.innerHTML = web3.fromWei(project_balance, "ether");

      refill_element = document.getElementById("deadline_"+myProject.index);
      refill_element.innerHTML = myProject.deadline - current_time;

      if(myProject.paid_out == true) {
        project_state = "Paid out!";
      }
      else if(project_balance == myProject.amount_goal) {
        project_state = "Fully Funded! (Request your payout)";
      }
      else if(current_time > myProject.deadline && web3.eth.getBalance(myProject.address).valueOf() > 0) {
        project_state = "Deadline Expired (Request your refund)";
      }
      else if(current_time > myProject.deadline && web3.eth.getBalance(myProject.address).valueOf() == 0) {
        project_state = "All refunds issued";
      }
      else {
        project_state = "Accepting Funds";
      }

      refill_element = document.getElementById("state_"+myProject.index);
      refill_element.innerHTML = project_state;
      resolve();
  })
  })
}

function getUserName(user_address) {

for (var i = 0; i <= user_names.length; i++) {
  if (user_address == web3.eth.accounts[i]) {
    return user_names[i];
  }
}
  return false;
}

function refreshProjectTableAll() {

  return new Promise(function(resolve,reject){

  fundhub.num_projects.call()
  .then(function(value) {

    var promises = [];
    var num_projects_displayed;

    if (value > max_projects_displayed) {
      num_projects_displayed = max_projects_displayed;
    }
    else {
      num_projects_displayed = value;
    }

    for (i = 1; i <= num_projects_displayed; i++) { 
      promises.push(refreshProjectTableByIndex(i));
    }
    return Promise.all(promises);
  })
  .then(function(){
    resolve();
  })
  })
}

function refreshUserTableByIndex(index){

  return new Promise(function(resolve,reject){

    var user_address =  web3.eth.accounts[index];
    var refill_element = document.getElementById("user_address_"+index);
    refill_element.innerHTML = (user_address.substring(0,6) + "...." + user_address.substring(38,42)).toString();

    var refill_element = document.getElementById("user_balance_"+index);
    refill_element.innerHTML = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[index]), "ether");

    resolve();
  })
}

function refreshUserTable(){

  return new Promise(function(resolve,reject){

  var num_users = 3;
  var promises = [];

    for (i = 1; i <= num_users; i++) { 
      promises.push(refreshUserTableByIndex(i));
    }

    Promise.all(promises).then(function(){
      resolve();
    })  
  })
}

function contribute() {

  return new Promise(function(resolve,reject){

  const default_amount_contribute = web3.toWei(1, "ether");

  var success = true;
  var myProject = {};
  var info;
  var amount_contribute = document.getElementById("contrib_amount").value;
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = web3.eth.accounts[user_index];

  myProject.index = Number(document.getElementById("i_project_num").value);

  if (amount_contribute === undefined || amount_contribute === null || amount_contribute === ""){
    amount_contribute = default_amount_contribute;
  }
  else {
    amount_contribute = web3.toWei(amount_contribute, "ether");
  }

  getProjectAddress(myProject.index)
  .then(function(value){
    return fundhub.contribute(value.toString(), {from: user_addr, value: amount_contribute, gas: gasLimit});
  }) 
  .catch(function(error){
    success = false;
    console.log("contribute() exception");
    console.log(error);
    setStatus("Error funding project; see log.");
    return;
  })
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    if(success) {
      setStatus(user_names[user_index] + " contributed " + web3.fromWei(amount_contribute, "ether") + " ETH to Project " + myProject.index + "!" );
    }
    resolve();
  })  
  })
}



function requestPayout() {

  return new Promise(function(resolve,reject){

  var success = true;
  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = web3.eth.accounts[user_index];

  getProjectAddress(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    return instance.payout({from: user_addr});//, errorHandler);
  })
  .catch(function(error){
    success = false;
    console.log("payout() exception");
    console.log(error);
    setStatus("Error getting payout; see log.");
    return;
  }) 
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    if(success) {
      setStatus("Payout sent to " + user_names[user_index] + "!");
    }
    resolve();
  })       
  })
}

function requestRefund() {

  return new Promise(function(resolve,reject){

  var success = true;
  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = web3.eth.accounts[user_index];

  getProjectAddress(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){   
    return instance.refund({from: user_addr});
  })
  .catch(function(error){
    success = false;
    console.log("refund() exception");
    console.log(error);
    setStatus("Error getting refund; see log.");
    return;
  })   
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    if(success) {
      setStatus("Refund sent to " + user_names[user_index] + "!");
    }
    resolve();
  })     
  })
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

  FundingHub.deployed().then(function(value) {
    fundhub = value;
    showUserBalances();
    console.log("FundingHub deployed!");
    return;  
  })
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  })
}
/*
window.addEventListener('unhandledrejection', event => {
    // Can prevent error output on the console:
    event.preventDefault();

    // Send error to log server
    log('Reason: ' + event.reason);
});
*/

/*
function LogContribute() {  
  fundhub.Contribute()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
    });
}    
*/
