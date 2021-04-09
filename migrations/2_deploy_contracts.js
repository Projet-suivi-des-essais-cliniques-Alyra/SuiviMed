var SuiviMed2 = artifacts.require("./SuiviMed2.sol");

module.exports = async function (deployer) {
	const accounts = await web3.eth.getAccounts();
	const root = accounts[0];
  const promoterAdmin = accounts[1];
  const authorityAdmin = accounts[2];
  deployer.deploy(SuiviMed2,root,promoterAdmin,authorityAdmin);
};
