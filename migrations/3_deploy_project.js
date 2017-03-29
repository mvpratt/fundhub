module.exports = function(deployer) {
 
  FundingHub.deployed().createProject(web3.eth.accounts[3], web3.toWei(3, "ether"));

};
