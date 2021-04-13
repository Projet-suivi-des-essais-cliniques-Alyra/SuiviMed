import React, { Component } from "react";
import SuiviMedContract from "./contracts/SuiviMed.json";
import getWeb3 from "./getWeb3";
import Header from "./components/Header";
import Promoter from "./components/Promoter";
import encryptData from "./utils/encryptData";

import "./App.css";

const ENCRYPTION_KEY = 'fpbyr4386v8hpxdruppijkt3v6wayxmi';
const IV_LENGTH = 16;

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    balance: null,
    currentAccount: null,
    protocolDescription: null
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
          currentAccount: accounts[0]
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
    const { accounts, contract } = this.state;

    // store the current account
    this.setCurrentAccount();

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();

    // Update state with the result.
    //this.setState({ storageValue: response });
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
  }

  onProtocolDescriptionUpload = event => {
    console.log("THE FILE =", event.target.files[0]);

    //this.setState({ protocolDescription: event.target.files[0] });
    //console.log(this.state.protocolDescription);

    let encryptedData = encryptData(event.target.files[0], IV_LENGTH, ENCRYPTION_KEY);
    console.log(encryptedData);

  }



  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="ui container App">
        <Promoter
          balance={this.state.balance}
          account={this.state.currentAccount}
        />
      </div>
    );
  }
}

export default App;
