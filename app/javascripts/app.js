var accounts;


function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};


function refreshWindow() {
  var arx = ARX_Prescription.deployed();

  arx.getRefillsLeft.call({from: accounts[0]}).then(function(value) {
    var refill_element = document.getElementById("refills");
    refill_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting state; see log.");
  });

  arx.getPrescriptionState.call({from: accounts[0]}).then(function(value) {

    var rxstate_element = document.getElementById("rxstate");
    rxstate_element.innerHTML = value.valueOf();
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting state; see log.");
  });
};

function resetRx(){
  var arx = ARX_Prescription.deployed();

  arx.reset({from: accounts[0]});
}

function init(){
  var arx = ARX_Prescription.deployed();

  arx.setMedicationID(42, {from: accounts[0]}).then(function(){
    arx.setPatient(accounts[1], {from: accounts[0]}).then(function(){
      arx.signRx({from: accounts[0]}).then(function(){
        arx.setPharmacy(accounts[2], {from: accounts[1]}).then(function(){
          arx.submitRx({from: accounts[1]});
        });
      });
    });
  });
}


function requestRefill() {
  var arx = ARX_Prescription.deployed();

  arx.reqRefillRx({from: accounts[1]}).then(function(){
    setStatus("Refill requested!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error requesting refill; see log.");
  });
}


function fillRx() {
  var arx = ARX_Prescription.deployed();

  arx.fillRx({from: accounts[2]}).then(function(){
    setStatus("Filled Rx!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error filling Rx; see log.");
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
}
