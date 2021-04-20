import React, { Component } from "react";
import SuiviMedContract from "./contracts/SuiviMed.json";
import getWeb3 from "./getWeb3";
// import Header from "./components/Header";
import Promoter from "./components/Promoter";
import Authority from "./components/Authority";
import EncryptData from "./utils/EncryptData";
import RoleContext from './contexts/RoleContext';
import AccountContext from './contexts/AccountContext';
import ProtocolsContext from './contexts/ProtocolsContext';
import ContractContext from './contexts/ContractContext';

import "./App.css";

const ENCRYPTION_KEY = 'fpbyr4386v8hpxdruppijkt3v6wayxmi';
const IV_LENGTH = 16;

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    role: null,
    contract: null,
    balance: null,
    currentAccount: null,
    protocolDescription: null,
    CIDs: null,
    protocols:null,
    done:false
    // cidFromIPFS: null,
    // cidFromEthereum: null,
    // data: null,
    // encodedData: null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SuiviMedContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SuiviMedContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Get balance of cutrent account
      await web3.eth.getBalance(accounts[0], (err, balance) => {
        if (!err) {
          this.setState({ balance: web3.utils.fromWei(balance, 'ether') });
        }
      });

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState(
        {
          web3,
          accounts,
          contract: instance,
          currentAccount: accounts[0],
          protocols:[]
        },
        this.runExample
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { currentAccount, contract, done } = this.state;

    // store the current account
    this.setCurrentAccount();

    // if (done===false){
    // await contract.methods.createProtocol("protocolDescriptionCID","protocolTreatmentsListID").send({from:currentAccount});
    // this.setState({done:true});
    // }
    // recupere la liste des protocols
    const protocols = await contract.methods.getProtocols().call();
    console.log(protocols);
    this.setState({ protocols: protocols });
  };


  //=============== setting the curent account ===============
  setCurrentAccount = async () => {

    await window.ethereum.on('accountsChanged', (accounts) => {
      this.setState({ currentAccount: accounts[0] });

      this.state.web3.eth.getBalance(accounts[0], (err, balance) => {
        if (!err) {
          this.setState({ balance: this.state.web3.utils.fromWei(balance, 'ether') });
        }
      });
    });

    this.setState({role: await this.state.contract.methods.getRole(this.state.currentAccount).call()})
  }

  onProtocolDescriptionUpload = event => {
    console.log("THE FILE =", event.target.files[0]);

    //this.setState({ protocolDescription: event.target.files[0] });
    //console.log(this.state.protocolDescription);

    let encryptedData = EncryptData(event.target.files[0], IV_LENGTH, ENCRYPTION_KEY);
    console.log(encryptedData);

  }

  onProtocoleButtonClick = async (protocolDescriptionCID, protocolTreatmentsListID) => {
    const { contract, currentAccount } = this.state;
    console.log("CID PROTOCOL APP =", protocolDescriptionCID);
    console.log("CID LIST APP =", protocolTreatmentsListID);
    await contract.methods.createProtocol(protocolDescriptionCID,protocolTreatmentsListID).send({from:currentAccount});
    this.setState({CIDs: await contract.methods.getProtocolCIDs(0).call({from:currentAccount})});

    console.log("CIDS FROM ETHEREUM", this.state.CIDs);
  }


  render() {
    if (!this.state.web3 || this.state.role===undefined) {
      const ENCRYPTION_KEY = 'fpbyr4386v8hpxdruppijkt3v6wayxmi';
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    else if (this.state.role==="PROMOTER") {
      return (
        <div className="ui container App">
          <ContractContext.Provider value={this.state.contract}>
          <ProtocolsContext.Provider value={this.state.protocols}>
          <AccountContext.Provider value={this.state.currentAccount}>
          <RoleContext.Provider value={this.state.role}>        
            <Promoter
              // balance={this.state.balance}
              cids = {this.state.CIDs}
              onProtocolClick = {this.onProtocoleButtonClick}
            />
          </RoleContext.Provider>
          </AccountContext.Provider>
          </ProtocolsContext.Provider>
          </ContractContext.Provider>
        </div>
      );
    }
    else if (this.state.role==="AUTHORITY") {
      return (
        <div className="ui container App">
          <ContractContext.Provider value={this.state.contract}>
        <ProtocolsContext.Provider value={this.state.protocols}>
        <AccountContext.Provider value={this.state.currentAccount}>
        <RoleContext.Provider value={this.state.role}>
        <Authority />
        </RoleContext.Provider>
        </AccountContext.Provider>
        </ProtocolsContext.Provider>
        </ContractContext.Provider>
        </div>
      );
    }
    else{ return <div> NOTHING </div>}
  }
}

export default App;