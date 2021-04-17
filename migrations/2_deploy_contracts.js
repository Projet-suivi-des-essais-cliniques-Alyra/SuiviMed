var SuiviMed = artifacts.require("./SuiviMed.sol");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);
const web3 = new Web3(provider);

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts().catch((e) => {console.log(e);});
	// const root = "0x5612951Caf1Ab7b46eed71045448A8f98695E901";
  const promoterAdmin= "0x78B5DEE8e17D82d318Bd4a9e7d68DCc202f1E61d";
  const authorityAdmin = "0x5E37d1a8cB272f241710c4F5D921c672BafE44ed";
  //console.log("promoterAdmin=",promoterAdmin); // to check that accounts are retrieved
  deployer.deploy(SuiviMed, promoterAdmin, authorityAdmin,{from:promoterAdmin});
};
