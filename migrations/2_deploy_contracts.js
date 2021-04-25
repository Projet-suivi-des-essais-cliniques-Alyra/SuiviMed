var SuiviMed = artifacts.require("./SuiviMed.sol");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);
const web3 = new Web3(provider);

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts().catch((e) => {console.log(e);});
	// const root = "0x5612951Caf1Ab7b46eed71045448A8f98695E901";
  const promoterAdmin= "0x2A1e593DD0272A56dd8bFD3eCE50e5b11e68e875";
  const authorityAdmin = "0x493507E0a1b9DDF1a36e99789f707f568a31460e";
  // ropsten,rinkeby:
  // const promoterAdmin= "0x48dF73d1AaAb29241DDeC590B68FaFfb365Ec68E";
  // const authorityAdmin = "0x2885d4dd73deB10B54C5c6dbeb2AD945e56008A0";
  //console.log("promoterAdmin=",promoterAdmin); // to check that accounts are retrieved
  deployer.deploy(SuiviMed, promoterAdmin, authorityAdmin,{from:promoterAdmin});
};
