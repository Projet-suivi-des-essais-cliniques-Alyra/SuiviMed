import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import Header from './Header';
import Home from "../pages/Home";
import ReadDocuments from '../pages/ReadDocuments';
import EditProtocol from './EditProtocol';
import CreateProject from './CreateProject';
import EncryptData from '../utils/EncryptData';
import SendToIPFS from '../utils/SendToIPFS';
import FetchFromIPFS from '../utils/FetchFromIPFS';
import "../App.css";

class PatientData extends Component {
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
        ).send( {from: this.props.account} );
        
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
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/EditProtocol" exact component={EditProtocol} />
                        <Route path="/CreateProject" exact component={CreateProject} />
                        <Route path="/ReadProtocol" exact component={ReadDocuments} />
                        <Route path="/CollectData" exact component={PatientData} />
                    </Switch>
                </BrowserRouter>

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
                                <strong>{this.state.eventProjectID}</strong>
                                </p>
                        </div>
                }

            </div>
        );
    }
}

export default PatientData
