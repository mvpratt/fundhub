var accounts;

var  admin;    // contract creator / debug interface
var  contrib1; // Contributer 1
var  contrib2; // Contributer 2
var  owner;    // Project owner

var proj;      // Test project

var fundhub;   // Main contract


function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function showDebugInfo() {

  console.log("accounts[0]: balance (Wei): " + web3.eth.getBalance(accounts[0]));
  console.log("accounts[1]: balance (Wei): " + web3.eth.getBalance(accounts[1]));
  console.log("accounts[2]: balance (Wei): " + web3.eth.getBalance(accounts[2]));
  console.log("accounts[3]: balance (Wei): " + web3.eth.getBalance(accounts[3]));
};


function refreshWindow() {

  proj.getAmountRaised.call({from: admin}).then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting amount raised; see log.");
  });

  proj.getAmountGoal.call({from: admin}).then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting amount goal; see log.");
  });

  proj.getState.call({from: admin}).then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting state; see log.");
  });
  return true;
};



function createProject () {

  fundhub.createProject(owner, web3.toWei(4, "ether"), {from: admin, gas: 4500000}).then(function(){
    setStatus("Creating new project.");
    }).catch(function(e) {
      console.log(e);
      setStatus("Error creating project; see log.");
  }).then(function(){
    fundhub.getProjectAddress.call().then(function(addr) {
      console.log("Project address: " + addr);
      return proj = Project.at(addr);
    }).then(function(){
        return refreshWindow();
    });     
  });    
}


function fund() {

  proj.fund(contrib1, {from: contrib1, value: web3.toWei(1, "ether")}).then(function(){
    setStatus("Contributed 1 ETH!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error funding project; see log.");
  }).then(function(){
      return refreshWindow();
  });
}

function requestPayout() {

  proj.payout({from: owner}).then(function(){
    setStatus("Requested payout!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting payout; see log.");
  }).then(function(){
      return refreshWindow();
  });
}


function requestRefund() {

  proj.refund({from: contrib1}).then(function(){
    setStatus("Requested refund");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting refund; see log.");
  }).then(function(){
      return refreshWindow();
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

    admin    = accounts[0]; // contract creator / debug interface
    contrib1 = accounts[1];
    contrib2 = accounts[2];
    owner    = accounts[3];

    showDebugInfo();

    fundhub = FundingHub.deployed();
  
    fundhub.getVersion.call().then(function(value) {
      console.log("FundingHub version: " + value);
    }).catch(function(e) {
      console.log(e);
      setStatus("Error getting version; see log.");
    });
  });

  //logFullyFundedEvents();
  //logWarningEvents();

}


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


