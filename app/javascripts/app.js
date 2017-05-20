
var  admin;    // contract creator / debug interface
var  contrib1; // Contributer 1
var  contrib2; // Contributer 2
var  owner;    // Project owner

var proj;      // Test project
var fundhub;   // Main contract


function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}


function showDebugInfo() {

  console.log("admin: balance (Wei): "    + web3.eth.getBalance(admin));
  console.log("contrib1: balance (Wei): " + web3.eth.getBalance(contrib1));
  console.log("conrib2: balance (Wei): "  + web3.eth.getBalance(contrib2));
  console.log("owner: balance (Wei): "    + web3.eth.getBalance(owner));
}


function reset() {

}


function printError () {
  console.log("error");
}


function printSuccess () {
  console.log("success!");
}


function getAmountRaised () {

  proj.getAmountRaised.call({from: admin})
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting amount raised; see log.");
  });
}


function getAmountGoal () {

  proj.getAmountGoal.call({from: admin})
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting amount goal; see log.");
  });
}


function getState () {

  proj.getState.call({from: admin})
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error getting state; see log.");
  });
}


function createProject () {

  fundhub = FundingHub.deployed();

  fundhub.getProjectAddress.call(1)
  .then(function(addr){
      console.log("Project address: " + addr);
      proj = Project.at(addr);    
  });
}

function contribute() {

  fundhub.contribute(1, contrib1, {from: contrib1, value: web3.toWei(1, "ether")})
  .then(function(){
    setStatus("Contributed 1 ETH!");
    return proj.getAmountRaised.call({from: admin});
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
    return proj.getState.call({from: admin});
  })
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
    return proj.getAmountGoal.call({from: admin});
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
  });
}


function fund() {

  proj.fund(contrib1, {from: contrib1, value: web3.toWei(1, "ether")})
  .then(function(){
    setStatus("Contributed 1 ETH!");
    return proj.getAmountRaised.call({from: admin});
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
    return proj.getState.call({from: admin});
  })
  .then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
    return proj.getAmountGoal.call({from: admin});
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = value.valueOf();
  })
  .catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
  });
}


function requestPayout() {

  proj.payout({from: owner})
  .then(function(){
    setStatus("Requested payout!");
    return proj.getAmountRaised.call({from: admin});
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
    return proj.getState.call({from: admin});
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
    return proj.getAmountRaised.call({from: admin});
  })
  .then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
    return proj.getState.call({from: admin});
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

    admin    = accs[0]; // contract creator / debug interface
    contrib1 = accs[1];
    contrib2 = accs[2];
    owner    = accs[3];

    showDebugInfo();

    fundhub = FundingHub.deployed();
  
    fundhub.getVersion.call()
    .then(function(value) {
      console.log("FundingHub version: " + value);
    })
    .catch(function(e) {
      console.log(e);
      setStatus("Error getting version; see log.");
    });
  });
}


/*
function createProject () {

  fundhub.createProject(owner, web3.toWei(4, "ether"), {from: admin, gas: 4500000})
    .then(function () {
      setStatus("Creating new project.");
    })
    .catch(function printError(e) {
      console.log(e);
      setStatus("Error creating project; see log.");
    })
    .then(function getIndex() {
      fundhub.getIndexLastDeployedProject.call();
    })
    .then(function printIndex(index) {
      console.log("Project index: " + index);
      fundhub.getProjectAddress(index);
    })
    .then(function printAddress(addr) {
      console.log("Project address: " + addr);
      //return proj = Project.at(addr);
    });    
    //.then(function(){
    //  return refreshWindow();
    //});     
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

