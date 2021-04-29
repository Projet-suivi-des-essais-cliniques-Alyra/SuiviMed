import React, { Component } from 'react';
import Header from '../../components/Header';
import MenuPromoter from "../../components/MenuPromoter";
import ReactFileReader from 'react-file-reader';
import EncryptData from '../../utils/EncryptData';
import SendToIPFS from '../../utils/SendToIPFS';
import FetchFromIPFS from '../../utils/FetchFromIPFS';
import AccountContext from '../../contexts/AccountContext';

import "../../App.css";

  class ProtocolPage extends Component {

    static contextType = AccountContext;

    state = {
      descriptionCID: '',
      treatmentListCID:'',
      base64data: '',
      filename: '',
      base64dataList: '',
      filenameList: '',
      warningMsg: '',
      eventAddress: '',
      eventID: '',
      descDone:false,
      currentfile:''
    }

    handleFilesDesc = async files => {
      // encode the file to base64 and save it into state
      this.setState({
          filename: files.fileList[0].name,
          base64data: files.base64,
          descDone:true,
          currentfile:files.base64
      })
    }
    handleFilesList = async files => {
      // encode the file to base64 and save it into state
      this.setState({
          filenameList: files.fileList[0].name,
          base64dataList: files.base64,
          currentfile:files.base64,
          warningMsg: files.fileList[0].name,
          eventAddress: '',
          eventID: ''
      })
    }



  onButtonClick = async () => {
    this.setState({ warningMsg: '' });

    // send data to ipfs
    let encryptedDescriptionData = EncryptData(this.state.base64data, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
    let encryptedTreatmentListData = EncryptData(this.state.base64dataList, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
    let descriptionCID = await SendToIPFS(encryptedDescriptionData);
    let treatmentListCID = await SendToIPFS(encryptedTreatmentListData);
    // this.setState({ descriptionCID: descriptionCID, treatmentListCID:treatmentListCID });
    console.log("descriptionCID =", descriptionCID);
    console.log("treatmentListCID =", treatmentListCID);

    // send CIDs to Blockchain  
    const receipt = await this.props.contract.methods.createProtocol(descriptionCID, treatmentListCID).send({ from: this.context });
    console.log("RECEIPT =", receipt.events);

    // handling events
    let addr = receipt.events.protocolCreation.returnValues[0];
    let id = receipt.events.protocolCreation.returnValues[1];
    /* console.log("EVENT ADRESS =", receipt.events.protocolCreation.returnValues[0]);
    console.log("EVENT ID =", receipt.events.protocolCreation.returnValues[1]); */
    console.log(`The address ${addr} has registered the protocol with id ${id}`);

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
            <div>
            <Header />
            </div>
            <div className="editProtocol">
            <MenuPromoter />
            </div>

            <h2 className="head1">Send Protocol Files for validation</h2>

            <div className = "protocol-btn">
              <ReactFileReader fileTypes={[".csv",".pdf",".zip"]} base64={true}  handleFiles = {this.handleFilesDesc}>
                <button className="ui brown button">
                  Select the Protocol Description File
                </button>
              </ReactFileReader>
              {this.state.filename}
            </div>

            {!this.state.descDone ? 
            <p></p>
            : 
            <div className = "protocol-btn">
              <ReactFileReader fileTypes={[".csv",".pdf",".zip"]} base64={true}  handleFiles = {this.handleFilesList}>
                <button className="ui brown button">
                  Select the Protocol Treatments List File
                </button>
              </ReactFileReader>
              {this.state.filenameList}
            </div>
            }

            {
              warning === '' ? <p></p> : 
              <div className="send-protocol">
                <div className="ui warning message protocol-warning">
                  <div className="header">
                    <p>You are about to send these protocol files:<br></br>
                    {this.state.filename}, <br></br>
                    {this.state.filenameList}</p>
                  </div>
                  Click the button below to send.
                </div>
                <p className = "protocol-send-btn">
                  <button className="ui green button" onClick = {this.onButtonClick}>
                    Send
                  </button>
                </p>    
              </div>
            }

            {
              (eAddr === '' || eID === 0) ? <p></p> :
              <div className="ui positive message protocol-sent">
                <i className="close icon"></i>
                <div className="header">
                  Protocol sent successfully for validation
                </div>
                <p>Your protocol ID is <strong>{eID}</strong>.</p>
              </div>
            }

        
         {/* <embed src={this.state.currentfile}  type="application/pdf" width="50%" height="850px" scrolling = "no"></embed> */}
      </div>
    );
  }
}

export default ProtocolPage;