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
        rows: '',
        cols: '',
        base64: '',
        projectID: '',
        filename: '',
        dataCID: '',
        patientAddress: '',
        message: '',
        eventPatientID: '',
        eventProjectID: ''

    }

    handleFiles = async files => {
        // encode the file to base64 and save it into state
        this.setState({
            base64: files.base64,
            filename: files.fileList[0].name
        })

        // Store data from excel sheet to state
        ExcelRenderer(files.fileList[0], (err, res) => {
            if (err) {
                console.error(err);
            } else {
                this.setState({
                    cols: res.cols,
                    rows: res.rows
                })
            }
        });

        // send data to ipfs
        let encryptedData = EncryptData(files.base64, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

        let cid = await SendToIPFS(encryptedData);
        this.setState({ dataCID: cid });
        console.log("CID FROM CODE =", this.state.dataCID);

        // Fetch data from ipfs
        let dataIPFS = await FetchFromIPFS(this.state.dataCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

        console.log("DATA FROM IPFS =", dataIPFS);

        // store data from ipfs to state
        this.state.rows.map((res, id) => {
            if (id !== 0) {
                this.state.data[res[0]] = res[1];
            }
        });     
    }
    
    onButtonClick = async e => {
        e.preventDefault();
        this.state.message = 'ok';

        let patientID = this.state.data.index;

        console.log("EXCEL ROWS =", this.state.data);
        
        const receipt = await this.props.contract.methods.addPatient(
            this.state.patientAddress,
            this.state.projectID,
            this.state.dataCID,
            this.state.dataCID
        ).send( {from: this.context} );
        
        console.log("RECEIPT =", receipt);
        this.setState({
            eventPatientID: receipt.events.patientAdded.returnValues[0],
            eventProjectID: receipt.events.patientAdded.returnValues[1]
        })

        this.state.projectID = '';
        this.state.patientAddress = '';

    }

    render() {
    console.log("MESSAGE =", this.state.message);
        return (
            <div>
                <div>
                    <Header />
                </div>
                <div className="editProtocol">
                    <MenuInvestigator />
                </div>
                

                <div className="head-patient">
                    <h2 className="ui dividing header">Add a patient</h2>
                </div>

                <div className="data-collection">
                    <form className = "ui form">
                        <div className="patient-file">
                            <ReactFileReader fileTypes={[".csv",".pdf",".zip", ".xlsx"]} base64={true} handleFiles = {this.handleFiles}>
                                <button className="positive ui button">
                                    Upload the patient data file into IPFS
                                </button>
                            </ReactFileReader>
                        </div>


                        <div className ="field-addr">
                        <label>Patient address</label>
                            <input
                                type="text"
                                name="id"
                                value={this.state.patientAddress}
                                required
                                onChange = {e => this.setState({ patientAddress: e.target.value} )}
                            />                            
                        </div>

                        <button className="ui primary button" type="submit" onClick = {this.onButtonClick}>
                            Submit
                        </button>               
                    </form>                
                </div>

                {
                    this.state.message === '' ?
                        <p></p> 
                    : 
                        <div className="ui positive message protocol-sent">
                            <i className="close icon"></i>
                            <div className="header">
                                Patient successfully added
                            </div>
                            <p>
                                The patient <strong>{this.state.patientAddress}</strong> with ID 
                                <strong>{this.state.eventPatientID}</strong> has been added to the project with ID
                                <strong>{this.state.projectID}</strong>
                                </p>
                        </div>
                }

            </div>
        );
    }
}

export default AddPatient;