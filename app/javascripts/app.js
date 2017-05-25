
var  admin;    // contract creator / debug interface
var  contrib1; // Contributer 1
var  owner;    // Project owner

var proj;      // Test project
var proj_index;

var fundhub;   // Main contract

var amount_goal;
var duration; // seconds
var amount_contribute;   


function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}


function showDebugInfo() {

  console.log("admin: balance    : " + web3.fromWei(web3.eth.getBalance(admin), "ether") + " ETH");
  console.log("contrib1: balance : " + web3.fromWei(web3.eth.getBalance(contrib1), "ether") + " ETH");
  console.log("owner: balance    : " + web3.fromWei(web3.eth.getBalance(owner), "ether") + " ETH");
}


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


function createProject () {

  amount_goal = web3.toWei(document.getElementById("i_amount_goal").value, "ether");
  duration = document.getElementById("i_duration").value;

  fundhub.createProject(owner, amount_goal, duration, {from: admin, gas: 4500000})
  .then(function(){
     return fundhub.getAddressLastDeployedProject.call();   
  })
  .then(function(addr){
      console.log("Project address: " + addr);
      var state_element = document.getElementById("project_address");
      state_element.innerHTML = addr;  
      return Project.at(addr);
  })
  .then(function(instance){
      proj = instance;
      return proj.getState.call();      
  })  
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
    return proj.getAmountGoal.call();
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return proj.getDeadline.call();
  })
  .then(function(value) {
    var state_element = document.getElementById("deadline");
    state_element.innerHTML = value.valueOf();
    return proj.getAmountRaised.call();
  })  
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error creating project; see log.");
  });
}

function contribute() {

  amount_contribute = web3.toWei(document.getElementById("contrib_amount").value, "ether");

  fundhub.contribute(proj_index, contrib1, {from: contrib1, value: amount_contribute})
  .then(function(){
    setStatus("Contributed " + web3.fromWei(amount_contribute, "ether") + " ETH!");
    return proj.getAmountRaised.call();
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return proj.getState.call();
  })
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
    return proj.getAmountGoal.call();
  })
  //.then(function(value) {
  //  var refill_element = document.getElementById("amount_goal");
  //  refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
  //  return proj.getDeadline.call();
  //})
  //.then(function(value) {
  //  var state_element = document.getElementById("deadline");
  //  state_element.innerHTML = value.valueOf();
  //})
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
  });
}



function requestPayout() {

  proj.payout({from: owner})
  .then(function(){
    setStatus("Requested payout!");
    return proj.getAmountRaised.call();
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return proj.getState.call();
  })
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting payout; see log.");
  });
}


function requestRefund() {

  proj.refund({from: contrib1})
  .then(function(){
    setStatus("Requested refund");
    return proj.getAmountRaised.call();
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = web3.fromWei(value.valueOf(), "ether");
    return proj.getState.call();
  })
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
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

    proj_index = 1;

    amount_goal       = web3.toBigNumber(web3.toWei(3,"ether")).toNumber();
    duration          = 200;                   // seconds
    amount_contribute = web3.toBigNumber(web3.toWei(1,"ether")).toNumber();  

    admin    = accs[0]; // contract creator / debug interface
    contrib1 = accs[1];
    contrib2 = accs[2];
    owner    = accs[3];

    showDebugInfo();

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

