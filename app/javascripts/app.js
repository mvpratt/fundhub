var accounts;

var  admin; // contract creator / debug interface
var  contrib1;
var  contrib2;
var  owner;



function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};


function refreshWindow() {

  console.log("accounts[0]: balance (Wei): " + web3.eth.getBalance(accounts[0]));
  console.log("accounts[1]: balance (Wei): " + web3.eth.getBalance(accounts[1]));
  console.log("accounts[2]: balance (Wei): " + web3.eth.getBalance(accounts[2]));
  console.log("accounts[3]: balance (Wei): " + web3.eth.getBalance(accounts[3]));


  var proj = Project.deployed();

  proj.getAmountRaised.call({from: accounts[0]}).then(function(value) {
    var refill_element = document.getElementById("amount_raised");
    refill_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting amount raised; see log.");
  });

  proj.getAmountGoal.call({from: accounts[0]}).then(function(value) {
    var refill_element = document.getElementById("amount_goal");
    refill_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting amount goal; see log.");
  });

  proj.getState.call({from: accounts[0]}).then(function(value) {
    var state_element = document.getElementById("state");
    state_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting state; see log.");
  });

  var fundhub = FundingHub.deployed();

  fundhub.getVersion.call().then(function(value) {
    console.log("version: " + value);
  });

};


function init(){
  var proj = Project.deployed();

   return proj.setOwner(accounts[3], {from: accounts[0]}).then(function(){
    return proj.setAmountGoal(web3.toWei(3, "ether"), {from: accounts[3]}).then(function(){
      setStatus("Initializing contract.  Fundrasing goal: 3 ETH");
    }).catch(function(e) {
    console.log(e);
    setStatus("Error initializing project; see log.");
  });
  });
}


function fund() {
  var proj = Project.deployed();
  proj.fund(accounts[1], {from: accounts[1], value: web3.toWei(1, "ether")}).then(function(){
    setStatus("Contributed 1 ETH!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error sending ETH to project; see log.");
  });
}


function DEBUG_setStateDeadlineReached() {
  var proj = Project.deployed();

  proj.DEBUG_setStateDeadlineReached({from: accounts[0]}).then(function(){
    setStatus("Set state to DEADLINE_REACHED (2)");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error setting contract state; see log.");
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

  });

  logFullyFundedEvents();
  logDeadlineReachedEvents();
  logWarningEvents();
  logErrorEvents();

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

function logDeadlineReachedEvents() {

  var deadlineReachedEvent = Project.deployed().DeadlineReached();

  deadlineReachedEvent.watch(function(error, result) {
    if (!error) {
        console.log("DeadlineReached() event");
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

function logErrorEvents() {

  var errorEvent = Project.deployed().LogError();

  errorEvent.watch(function(error, result) {
    if (!error) {
        console.log("LogError() event");
        return;
    }
    else {
        console.error(error);
        return;
    }
  });
}
