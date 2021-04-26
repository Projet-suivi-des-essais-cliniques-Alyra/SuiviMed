var SuiviMed = artifacts.require("./SuiviMed.sol");

const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider(
  "http://127.0.0.1:7545"
);
const web3 = new Web3(provider);

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts().catch((e) => {console.log(e);});
	// const root = "0x5612951Caf1Ab7b46eed71045448A8f98695E901";
  const promoterAdmin= "0xEB3Af624119cb3C8f447F61C1592b023b663CdC5";
  const authorityAdmin = "0x1F74CC3C67593da2C2a9ED50Fef13C3A7e9Faa8b";
  // ropsten,rinkeby:
  // const promoterAdmin= "0x48dF73d1AaAb29241DDeC590B68FaFfb365Ec68E";
  // const authorityAdmin = "0x2885d4dd73deB10B54C5c6dbeb2AD945e56008A0";
  //console.log("promoterAdmin=",promoterAdmin); // to check that accounts are retrieved
  deployer.deploy(SuiviMed, promoterAdmin, authorityAdmin,{from:promoterAdmin});
};
