var SuiviMed = artifacts.require("./SuiviMed.sol");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);
const web3 = new Web3(provider);

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts().catch((e) => {console.log(e);});
	// const root = "0x5612951Caf1Ab7b46eed71045448A8f98695E901";
  const promoterAdmin= "0x2aCA9325D1f08cAcaa4A3Ca76b35af36E95e9393";
  const authorityAdmin = "0xD5BA648d216F914C61bA613058da25AB7250Ab7f";
  //console.log("promoterAdmin=",promoterAdmin); // to check that accounts are retrieved
  deployer.deploy(SuiviMed, promoterAdmin, authorityAdmin,{from:promoterAdmin});
};
