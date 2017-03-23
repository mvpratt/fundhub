

// accounts[0] = doctor
// accounts[1] = patient
// accounts[2] = pharmacy


contract('FundingHub', function(accounts) {

  // Prescription state
  const CREATED = 0;   
  const SIGNED = 1;    
  const SUBMITTED = 2; 
  const REFILL_REQUESTED = 3;
  const FILLED = 4;    
  const EXPIRED = 5;   
  const ERROR = 6;     



it("Doctor sets Medication ID to 42", function() {
  arx = FundingHub.deployed();
  arx.setMedicationID(42, {from: accounts[0]});

  return arx.getMedicationID.call().then(function(id) {
      assert.equal(id.valueOf(), 42, "error: med id not 42");
    });
});


it("Doctor sets Patient address", function() {
  arx = FundingHub.deployed();
  arx.setPatient(accounts[1], {from: accounts[0]});

  return arx.getPatient.call().then(function(addr) {
      assert.equal(addr, accounts[1], "error: patient address incorrect");
    });
});


it("Doctor changes prescription state to SIGNED", function() {
  arx = FundingHub.deployed();
  arx.signRx({from: accounts[0]});

  return arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, SIGNED, "error: Rx state not SIGNED");
    });
});


it("Patient sets Pharmacy address",function(){
  arx = FundingHub.deployed();
  
  return arx.setPharmacy(accounts[2], {from: accounts[1]}).then(function(){
    arx.getPharmacy.call().then(function(pharm) {
      assert.equal(pharm, accounts[2], "error: pharmacy address incorrect");
    });
  });
}); 


it("Patient submits Rx to pharmacy", function() {
  arx = FundingHub.deployed();
  arx.submitRx({from: accounts[1]});

  return arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, SUBMITTED, "error: Rx state not SUBMITTED");
    });
});

// ============ First Refill ================================================== //

it("Patient requests 1st refill",function(){
  arx = FundingHub.deployed();
  
  return arx.reqRefillRx({from: accounts[1]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, REFILL_REQUESTED, "error: Rx state not REFILL_REQUESTED");
    });
  });
}); 


it("Pharmacy changes prescription state to FILLED", function() {
  arx = FundingHub.deployed();
  
  return arx.fillRx({from: accounts[2]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, FILLED, "error: Rx state not FILLED");
    });
  });  
});


it("Patient checks refills left",function(){
  arx = FundingHub.deployed();
  
  return arx.getRefillsLeft.call().then(function(refill) {
      assert.equal(refill, 2, "error: refills left not decremented");
  });
}); 


// ============ Second Refill ================================================== //

it("Patient requests 2nd refill",function(){
  arx = FundingHub.deployed();
  
  return arx.reqRefillRx({from: accounts[1]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, REFILL_REQUESTED, "error: Rx state not REFILL_REQUESTED");
    });
  });
}); 


it("Pharmacy changes prescription state to FILLED", function() {
  arx = FundingHub.deployed();
  
  return arx.fillRx({from: accounts[2]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, FILLED, "error: Rx state not FILLED");
    });
  });  
});


it("Patient checks refills left",function(){
  arx = FundingHub.deployed();
  
  return arx.getRefillsLeft.call().then(function(refill) {
      assert.equal(refill, 1, "error: refills left not decremented");
  });
}); 


// ============ Third Refill ================================================== //

it("Patient requests 2nd refill",function(){
  arx = FundingHub.deployed();
  
  return arx.reqRefillRx({from: accounts[1]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, REFILL_REQUESTED, "error: Rx state not REFILL_REQUESTED");
    });
  });
}); 


it("Pharmacy changes prescription state to EXPIRED", function() {
  arx = FundingHub.deployed();
  
  return arx.fillRx({from: accounts[2]}).then(function(){
    arx.getPrescriptionState.call().then(function(state) {
      assert.equal(state, EXPIRED, "error: Rx state not EXPIRED");
    });
  });  
});


it("Patient checks refills left",function(){
  arx = FundingHub.deployed();
  
  return arx.getRefillsLeft.call().then(function(refill) {
      assert.equal(refill, 0, "error: refills left not decremented");
  });
});


});
