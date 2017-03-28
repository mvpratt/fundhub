var accounts;


function logEvents() {

  var fundEvent = Project.deployed().Fund({_from: web3.eth.coinbase});

  fundEvent.watch(function(error, result) {
    if (!error) {
        console.log("saw a fund() event");
        //console.log(result);
        return;
    }
    else {
        console.error(error);
        return;
    }
  });
}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};


function refreshWindow() {

  //console.log("accounts[0]: address: " + accounts[0] + " balance (Wei): " + web3.eth.getBalance(accounts[0]));
  //console.log("accounts[1]: address: " + accounts[1] + " balance (Wei): " + web3.eth.getBalance(accounts[1]));
  //console.log("accounts[2]: address: " + accounts[2] + " balance (Wei): " + web3.eth.getBalance(accounts[2]));
  //console.log("accounts[3]: address: " + accounts[3] + " balance (Wei): " + web3.eth.getBalance(accounts[3]));

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
  proj.fund(accounts[0], {from: accounts[0], value: web3.toWei(1, "ether")}).then(function(){
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
  });

  logEvents();

  //console.log("web3 default account " + web3.eth.defaultAccount);
}
