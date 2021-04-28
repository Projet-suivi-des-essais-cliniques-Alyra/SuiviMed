import React, { Component } from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import ReactFileReader from 'react-file-reader';
import EncryptData from '../../utils/EncryptData';
import SendToIPFS from '../../utils/SendToIPFS';
import FetchFromIPFS from '../../utils/FetchFromIPFS';
import AccountContext from '../../contexts/AccountContext';
import "../../App.css";

class CollectData extends Component {

    static contextType = AccountContext;

    state = {
        base64: '',
        filename: '',
        patientID: '',
        projectID: ''
    }

    // determine patient Index using patient ID in the project 
    patientIDToPatientIndex = (_patientID,_projectID) => {
        if (this.props.patients!==null){  
            let patientIDInProject=0;
            for (let patientIndex=0; patientIndex < this.props.patients.length; patientIndex++) {       
                if (this.props.patients[patientIndex].projectID == _projectID ) { 
                    
                    if (patientIDInProject ==_patientID) { 
                        console.log("patientIndex=",patientIndex);
                        return patientIndex;
                    }  
                    patientIDInProject++;
                }         
            }
        }
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

        // send data to ipfs
        let encryptedData = EncryptData(this.state.base64, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        let dataCID = await SendToIPFS(encryptedData);
        console.log("CID FROM CODE =", dataCID);
        
        const receipt = await this.props.contract.methods
        .collectData( this.patientIDToPatientIndex(this.state.patientID,this.state.projectID),dataCID)
        .send( {from: this.context} );
       
        console.log("RECEIPT =", receipt);
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
                    <h2 className="ui dividing header">Collect Patient's Data</h2>
                </div>

                <div className="data-collection">

                    <form className = "ui form">
                        <div className ="patient-ID-collect">
                            <label>Patient ID</label>
                            <input
                                type="text"
                                name="id"
                                value={this.state.patientID}
                                required
                                onChange = {e => this.setState({ patientID: e.target.value} )}
                            />                            
                        </div>
                        
                        <div className ="patient-ID-collect">
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
                            Upload Patient's data file (pdf) to IPFS
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

export default CollectData