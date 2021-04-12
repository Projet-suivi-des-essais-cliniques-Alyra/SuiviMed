// import getWeb3 from "./getWeb3";
var SuiviMed = artifacts.require("./SuiviMed.sol");
// const web3 = await getWeb3();

module.exports = async function (deployer) {
	// const accounts = await web3.eth.getAccounts();
  // const accounts = await ethereum.request({ method: 'eth_accounts' });
	const root =  "0x9B982626b7eD1e38461A6Ad162bDF15696E308eB"; //accounts[0];
  const promoterAdmin = "0xa7AdE92c92AD60aE2514E4d3e2eaAF1C318b2031";// accounts[1]; 
  const authorityAdmin =  "0xCE1d2cA10d1c4B8c458D8AB4462Fa198979B5e0F";//accounts[2];
  console.log("promoterAdmin=",promoterAdmin);
  deployer.deploy(SuiviMed,root,promoterAdmin,authorityAdmin,{from:root});
};
