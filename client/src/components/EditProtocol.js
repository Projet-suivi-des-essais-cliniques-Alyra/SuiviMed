import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from './Header';
import Home from "../pages/Home";
import ReadDocuments from '../pages/ReadDocuments';
import CreateProject from './CreateProject';
import CollectData from './CollectData';
import EncryptData from '../utils/EncryptData';
import SendToIPFS from '../utils/SendToIPFS';
import FetchFromIPFS from '../utils/FetchFromIPFS';
import "../App.css";

  class EditProtocol extends Component {
    state = {
      protocolCID: '',
      base64data: '',
      filename: '',
      data: '',
      warningMsg: '',
      eventAddress: '',
      eventID: ''
    }

    handleFiles = async files => {
      // encode the file to base64 and save it into state
      this.setState({
          filename: files.fileList[0].name,
          base64data: files.base64,
          warningMsg: files.fileList[0].name,
          eventAddress: '',
          eventID: ''
      })
  }

  onButtonClick = async () => {
    this.setState({ warningMsg: '' });

    // send data to ipfs
    let encryptedData = EncryptData(this.state.base64data, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

    let cid = await SendToIPFS(encryptedData);
    this.setState({ protocoleCID: cid });
    console.log("CID FROM CODE =", this.state.protocoleCID);


    // send cids to ethereum Blockchain  
    const receipt = await this.props.contract.methods.createProtocol(cid, cid)
      .send({ from: this.props.account });
    console.log("RECEIPT =", receipt.events);

    // handling events
    let addr = receipt.events.protocolCreation.returnValues[0];
    let id = receipt.events.protocolCreation.returnValues[1];
    /* console.log("EVENT ADRESS =", receipt.events.protocolCreation.returnValues[0]);
    console.log("EVENT ID =", receipt.events.protocolCreation.returnValues[1]); */
    console.log(`The adress ${addr} has registered the protocol with id ${id}`);

    // Fetch cids from blockchain
    let cids = await this.props.contract.methods.getProtocolCIDs(id)
      .call({ from: this.props.account });
    console.log("cids from Ethereum =", cids);

    
    // Fetch data from ipfs
    let data = FetchFromIPFS(this.state.protocoleCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');    

    this.setState({ data: await data });

    // store event data on state
    this.setState({
      eventAddress:  addr,
      eventID: id
    });
  }


  render() {
    let warning = this.state.warningMsg;
    let eAddr = this.state.eventAddress;
    let eID = this.state.eventID;
    return (
        <div>
            <BrowserRouter>
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/EditProtocol" exact component={EditProtocol} />
                  <Route path="/CreateProject" exact component={CreateProject} />
                  <Route path="/ReadProtocol" exact component={ReadDocuments} />
                  <Route path="/CollectData" exact component={CollectData} />
                </Switch>
            </BrowserRouter>

            <h2 className="head1">Send the protocole to autorithies for validation</h2>

            <div className = "protocol-btn">
              <ReactFileReader fileTypes={[".csv",".pdf",".zip"]} base64={true} handleFiles = {this.handleFiles}>
                
                <button className="ui brown button">
                  Select the protocole file
                </button>
              </ReactFileReader>
            </div>
            {this.state.filename}

            {
              warning === '' ? <p></p> : 
              <div className="send-protocol">
                <div className="ui warning message protocol-warning">
                  <div className="header">
                    Your are about to send the protocole in file
                    {this.state.filename} for validation.
                  </div>
                  Click the button bellow to send.
                </div>
                <p className = "protocol-send-btn">
                  <button className="ui green button" onClick = {this.onButtonClick}>
                    send
                  </button>
                </p>
                <embed src={this.state.base64data}  type="application/pdf" width="50%" height="850px" scrolling = "no"></embed>
              </div>
            }

            {
              (eAddr === '' || eID === 0) ? <p></p> :
              <div className="ui positive message protocol-sent">
                <i className="close icon"></i>
                <div className="header">
                  Protocol sent successfully for validation
                </div>
                <p>Your protocol id is <strong>{eID}</strong>.</p>
              </div>
            }
        </div>
    );
  }
}

export default EditProtocol;
