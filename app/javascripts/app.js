
var accounts;  // array of all accounts

var proj;      // Test project
var fundhub;   // Main contract
 

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

function logTimestamp(message) {
    console.log("Log Timestamp: " + web3.eth.getBlock(web3.eth.blockNumber).timestamp + "  Log: " + message);
}

function showUserBalances() {
  console.log("Alice (coinbase): balance : " + web3.fromWei(web3.eth.getBalance(accounts[1]), "ether") + " ETH");
  console.log("Bob             : balance : " + web3.fromWei(web3.eth.getBalance(accounts[2]), "ether") + " ETH");
  console.log("Carol           : balance : " + web3.fromWei(web3.eth.getBalance(accounts[3]), "ether") + " ETH");
}

function ProjectInfo(i) {
   var result = {};
   result.owner = i[0];
   result.amount_goal = parseInt(i[1]);
   result.duration = parseInt(i[2]);
   result.deadline = parseInt(i[3]);
   return result;
};

// TODO - promisify
function createProject () {

  var myProject = {};
  var info;

  var amount_goal = web3.toWei(document.getElementById("i_amount_goal").value, "ether");
  var duration = document.getElementById("i_duration").value;
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  fundhub.createProject(user_addr, amount_goal, duration, {from: user_addr, gas: 4500000})
  .then(function(){
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
  })

  .then(function(num){   
    return refreshProjectTable(myProject);
  })
  //.then(function(){
  //  return refreshUserTable(user_index);    
  //}) 
  .then(function(){
    setStatus("Finished creating project");
    logTimestamp("Project creation finished");
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating project; see log.");
  });
}



function refreshProjectTable(myProject){

  return new Promise(function(resolve,reject){

    var state_element = document.getElementById("project_address_"+myProject.index);
    state_element.innerHTML = myProject.address;

    var refill_element = document.getElementById("amount_goal_"+myProject.index);
    refill_element.innerHTML = myProject.amount_goal;

    var refill_element = document.getElementById("deadline_"+myProject.index);
    refill_element.innerHTML = myProject.deadline;

    var state_element = document.getElementById("duration_"+myProject.index);
    state_element.innerHTML = myProject.duration;
  
    //return proj.getAmountRaised.call();
  //})  
  //.then(function(value) {
  //  var refill_element = document.getElementById("amount_raised_"+index);
  //  refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  //  return;
  //})
  //.catch(function(e) {
  //  console.log(e);
  //  setStatus("Error creating project; see log.");
  //});

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

  fundhub.contribute(proj_index, user_addr, {from: user_addr, value: amount_contribute, gas: 4500000})
  .then(function(){
    setStatus("Contributed " + web3.fromWei(amount_contribute, "ether") + " ETH from user " + user_index + "!" );
    return refreshProjectTable(proj_index);    
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })
  .then(function(){
    logTimestamp("Contribution finished");
  })  
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
  });
}


function requestPayout() {

  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  fundhub.getProjectAddress.call(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.payout({from: user_addr})
  })
  .then(function(){
    setStatus("Payout sent!");
    return refreshProjectTable(proj_index); 
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })
  .then(function(){
    logTimestamp("Payout request finished");
  })       
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting payout; see log.");
  });
}


function requestRefund() {

  var proj_index = Number(document.getElementById("i_project_num").value);
  var user_index = Number(document.getElementById("i_user").value);
  var user_addr = accounts[user_index];

  fundhub.getProjectAddress.call(proj_index)
  .then(function(addr){
    return Project.at(addr);
  })
  .then(function(instance){
    proj = instance;  
    return proj.refund({from: user_addr})
  })
  .then(function(){
    setStatus("Refund sent!");
    return refreshProjectTable(proj_index); 
  })
  .then(function(){
    return refreshUserTable(user_index);    
  })
  .then(function(){
    logTimestamp("Request refund finished");
  })     
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting refund; see log.");
  });
}



function LogContribute() {  
  fundhub.OnContribute()
    .watch(function(e, value) {
      if (e)
        console.error(e);
      else
        console.log("@Timestamp: " + value.args.timestamp + "," + web3.fromWei(value.args.amount, "ether") + " ether contributed from " + value.args.contrib);
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

    accounts = accs;
    showUserBalances();

  //var myFundHub;

  FundingHub.deployed().then(function(value) {
    fundhub = value;
    console.log("FundingHub deployed!");
  });

  })
}


