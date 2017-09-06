var FundingHub = artifacts.require("./FundingHub.sol");
var Project = artifacts.require("./Project.sol");

module.exports = function(deployer) {

  // funding goal: 10 ETH, duration: 86400 seconds (1 day)
  FundingHub.deployed()
  .then(function(_fundhub) {
    _fundhub.createProject(web3.toWei(10, "ether"), 86400, {from: web3.eth.coinbase, gas: 4500000});
  });
};
