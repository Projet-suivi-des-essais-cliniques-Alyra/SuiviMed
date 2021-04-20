var SuiviMed = artifacts.require("./SuiviMed.sol");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);
const web3 = new Web3(provider);

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts().catch((e) => {console.log(e);});
	const root = "0xF15385DfbDcb355d12B82e36591ed951d86f1d9e";
  const promoterAdmin= "0x140E5624b5af2Ccd9b0843C6F73a3f6761c427Fc";
  const authorityAdmin = "0xc44708a21c31549A2B113eC99DAA42Af03D96618";
  //console.log("promoterAdmin=",promoterAdmin); // to check that accounts are retrieved
  deployer.deploy(SuiviMed, promoterAdmin, authorityAdmin,{from:promoterAdmin});
};
