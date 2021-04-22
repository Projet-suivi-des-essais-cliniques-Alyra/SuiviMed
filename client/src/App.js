import React, { Component } from "react";
import SuiviMedContract from "./contracts/SuiviMed.json";
import getWeb3 from "./getWeb3";
import Promoter from "./components/Promoter";
import Authority from "./components/Authority";
import Investigator from "./components/Investigator";
import RoleContext from './contexts/RoleContext';
import AccountContext from './contexts/AccountContext';
import ProtocolsContext from './contexts/ProtocolsContext';
import ProjectsContext from './contexts/ProjectsContext';

import "./App.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    role: null,
    contract: null,
    balance: null,
    currentAccount: null,
    protocols:null,
    projects:null
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
        this.run
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  run = async () => {
    const { contract } = this.state;

    // store the current account
    this.setCurrentAccount();

    // recupere la liste des protocols
    const protocols = await contract.methods.getProtocols().call();
    this.setState({ protocols: protocols });

    // recupere la liste des protocols
    const projects = await contract.methods.getProjects().call();
    this.setState({ projects: projects });

  };


  // setting the current account
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

  
  render() {
    if (!this.state.web3 || this.state.role===undefined) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    else if (this.state.role==="PROMOTER") {
      return (
        <div className="ui container App">
          <ProtocolsContext.Provider value={this.state.protocols}>
            <AccountContext.Provider value={this.state.currentAccount}>
              <RoleContext.Provider value={this.state.role}>        
                <Promoter
                  // balance={this.state.balance}
                  contract={this.state.contract}
                />
              </RoleContext.Provider>
            </AccountContext.Provider>
          </ProtocolsContext.Provider>
        </div>
      );
    }
    else if (this.state.role==="AUTHORITY") {
      return (
        <div className="ui container App">     
        <ProtocolsContext.Provider value={this.state.protocols}>
          <AccountContext.Provider value={this.state.currentAccount}>
            <RoleContext.Provider value={this.state.role}>
              <Authority 
                contract={this.state.contract}
              />
            </RoleContext.Provider>
          </AccountContext.Provider>
        </ProtocolsContext.Provider>
        </div>
      );
    }
    else if (this.state.role==="INVESTIGATOR") {
      return (
        <div className="ui container App">   
        <ProjectsContext.Provider value={this.state.projects}>
          <ProtocolsContext.Provider value={this.state.protocols}>
            <AccountContext.Provider value={this.state.currentAccount}>
              <RoleContext.Provider value={this.state.role}>
                <Investigator 
                  contract={this.state.contract}
                />
              </RoleContext.Provider>
            </AccountContext.Provider>
          </ProtocolsContext.Provider>
        </ProjectsContext.Provider>
        </div>
      );
    }
    else{ return <div> NOT PROMOTER, NOR AUTHORITY, NOR INVESTIGATOR </div>}
  }
}

export default App;