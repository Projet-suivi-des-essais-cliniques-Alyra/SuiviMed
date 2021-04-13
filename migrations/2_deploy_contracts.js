var SuiviMed = artifacts.require("./SuiviMed.sol");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);
const web3 = new Web3(provider);

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts().catch((e) => {console.log(e);});
	const root = "0x55A8449027A739eee9D0592Ed4A3577D6e91D7f8";
  const promoterAdmin = "0x2428718DC0F275082b4cEDEd7Ecc994543120Af8";
  const authorityAdmin = "0x3AE865867073ec8167e382019E1c59C7daAa3D42";
  //console.log("promoterAdmin=",promoterAdmin); // to check that accounts are retrieved
  deployer.deploy(SuiviMed, root, promoterAdmin, authorityAdmin, {from:root});
};
