import React, { Component } from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import ReactFileReader from 'react-file-reader';
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import EncryptData from '../../utils/EncryptData';
import SendToIPFS from '../../utils/SendToIPFS';
import FetchFromIPFS from '../../utils/FetchFromIPFS';
import AccountContext from '../../contexts/AccountContext';
import "../../App.css";

class AddPatient extends Component {

  static contextType = AccountContext;

    state = {
        data: {},
        base64: '',
        projectID: '',
        filename: '',
        patientAddress: '',
        patientName:'',
        eventPatientID: '',
        eventProjectID: ''

    }

    handleFiles = async files => {
        // save file to state
        this.setState({
            base64: files.base64,
            filename: files.fileList[0].name
        })      
    }

    onButtonClick = async e => {
        e.preventDefault();
       
        // encrypt data and patient name
        let encryptedData = EncryptData(this.state.base64, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        let encryptedName = EncryptData(this.state.patientName, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        //send Data to IPFS
        let dataCID = await SendToIPFS(encryptedData);
        let nameCID = await SendToIPFS(encryptedName);

        console.log("CID FROM CODE =", this.state.dataCID);

        // Fetch data from ipfs
        // let dataIPFS = await FetchFromIPFS(dataCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        // this.setState({ dataIPFS: await dataIPFS });
        // console.log("DATA FROM IPFS =", dataIPFS);

        //send CIDs to blockchain
        const receipt = await this.props.contract.methods.addPatient(
            this.state.patientAddress,
            this.state.projectID,
            dataCID,
            nameCID
        ).send( {from: this.context} );
        
        console.log("RECEIPT =", receipt);
        this.setState({
            eventPatientID: receipt.events.patientAdded.returnValues[0],
            eventProjectID: receipt.events.patientAdded.returnValues[1]
        })

    }

    render() {
        return (
            <div>
                <div>
                    <Header />
                </div>
                <div className="editProtocol">
                    <MenuInvestigator />
                </div>
                
                <div className="head-patient">
                    <h2 className="ui dividing header">Add a Patient</h2>
                </div>

                <div className="data-collection">        

                    <form className = "ui form">

                        <div className ="field-addr">
                            <label>Patient's Name</label>
                            <input
                                type="text"
                                name="id"
                                value={this.state.patientName}
                                required
                                onChange = {e => this.setState({ patientName: e.target.value} )}
                            />                            
                        </div>

                        <div className ="field-addr">
                            <label>Patient's address</label>
                            <input
                                type="text"
                                name="id"
                                value={this.state.patientAddress}
                                required
                                onChange = {e => this.setState({ patientAddress: e.target.value} )}
                            />                            
                        </div>

                        <div className ="project-ID-addPatient">
                            <label>Project ID</label>
                            <input
                                type="text"
                                name="id"
                                value={this.state.projectID}
                                required
                                onChange = {e => this.setState({ projectID: e.target.value} )}
                            />                            
                        </div>
                                      
                    </form>  

                    <div className="patient-file">
                        <ReactFileReader fileTypes={[".csv",".pdf",".zip", ".xlsx"]} base64={true} handleFiles = {this.handleFiles}>
                            <button className="positive ui button">
                                Upload Patient's Data File (pdf) to IPFS
                            </button>
                        </ReactFileReader>
                    </div>    

                    <button className="ui primary button" type="submit" onClick = {this.onButtonClick}>
                            Submit
                    </button>

                </div>

                <div className="filereader">
                    <embed src={this.state.base64}  type="application/pdf" width="50%" height="850px" scrolling = "no"></embed>
                </div>
                
            </div>
        );
    }
}

export default AddPatient;