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
  console.log("Coinbase : balance : " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), "ether") + " ETH");  
  console.log("Alice    : balance : " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether") + " ETH");
  console.log("Bob      : balance : " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether") + " ETH");
  console.log("Carol    : balance : " + web3.fromWei(web3.eth.getBalance(web3.eth.accounts[3]), "ether") + " ETH");
}

function ProjectInfo(i) {
   var result = {};
   result.owner = i[0];
   result.amount_goal = parseInt(i[1]);
   result.deadline = parseInt(i[2]);
   return result;
};

function getProjectAddress(index) {

  return new Promise(function(resolve,reject){
    resolve(fundhub.myProjects.call(index));
  });
}

function createProject() {

  return new Promise(function(resolve,reject){

  const default_amount_goal = web3.toWei(10, "ether");
  const default_duration = 200;

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
    setStatus("Finished creating project");
    logTimestamp("Project creation finished");
    resolve();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating project; see log.");
    reject();
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
  .catch(function(){
    console.log("contrib exception ");
  })
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    setStatus("Contributed " + web3.fromWei(amount_contribute, "ether") + " ETH from user " + user_index + "!" );
    logTimestamp("Contribution finished");
    resolve();
  })  
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
    reject();
  })
  })
}

function requestPayout() {

  return new Promise(function(resolve,reject){

  var proj;
  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = web3.eth.accounts[user_index];

  getProjectAddress(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.payout({from: user_addr})
  })
  .catch(function(error){
    console.log("payout() exception");
    return;
  }) 
  .then(function(){
    setStatus("Payout sent!");
    return;
  })
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    logTimestamp("Payout request finished");
    resolve();
  })       
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting payout; see log.");
    reject();
  })
  })
}

function requestRefund() {

  return new Promise(function(resolve,reject){

  var proj;
  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = web3.eth.accounts[user_index];

  getProjectAddress(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.refund({from: user_addr})
  })
  .catch(function(error){
    console.log("refund() exception");
    return;
  })   
  .then(function(){
    setStatus("Refund sent!");
    return;
  })
  .then(refreshProjectTableAll)
  .then(refreshUserTable)
  .then(function(){
    logTimestamp("Request refund finished");
    resolve();
  })     
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting refund; see log.");
    reject();
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
