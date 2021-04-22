import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import Header from './Header';
import Home from "../pages/Home";
import ReadDocuments from '../pages/ReadDocuments';
import EditProtocol from './EditProtocol';
import CreateProject from './CreateProject';
import CollectData from './CollectData';
import EncryptData from '../utils/EncryptData';
import SendToIPFS from '../utils/SendToIPFS';
import FetchFromIPFS from '../utils/FetchFromIPFS';
import "../App.css";
const { Base64 } = require('js-base64');

class PatientDataCID extends Component {
    state = {
        patientID: '',
        cols: '',
        rows: '',
        base64data: '',
        message: ''
    }

    onButtonClick = async e => {
        e.preventDefault();
        console.log("BUTTON RETUNS =", this.state.patientID);

        const receipt = await this.props.contract.methods.getPatientDataCIDs(this.state.patientID)
            .call({ from: this.props.account });
        
        const cid = receipt[0];
        const base64data = await FetchFromIPFS(cid, 'fpbyr4386v8hpxdruppijkt3v6wayxmi'); 
        this.setState({
            message: 'ok',
            base64data: base64data 
        });

        console.log("RECEIPT =", cid);
        console.log("ENCODED DATA =", base64data);
    }

    render() {
        return (
        <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/EditProtocol" exact component={EditProtocol} />
                        <Route path="/CreateProject" exact component={CreateProject} />
                        <Route path="/ReadProtocol" exact component={ReadDocuments} />
                        <Route path="/CollectData" exact component={CollectData} />
                        <Route path="/PatientDataCID" exact component={PatientDataCID} />
                    </Switch>
                </BrowserRouter>

                <div className="head-patient">
                    <h2 className="ui dividing header">Enter the patient ID to get its data</h2>
                </div>

                <form className = "ui form">
                    <div className ="patient-ID">
                        <label>Patient ID</label>
                        <input
                            type="text"
                            name="id"
                            value={this.state.value}
                            required
                            onChange = {e => this.setState({ patientID: e.target.value} )}
                        />                            
                    </div>

                    <button className="ui primary button" type="submit" onClick = {this.onButtonClick}>
                        Submit
                    </button>
                </form>

                {
                    this.state.message === ''
                    ?
                        console.log('')
                    :
                    <div className="ui positive message protocol-sent">
                        <i className="close icon"></i>
                        <div className="header">
                            File successfully downloaded
                        </div>
                        <p>
                            The file containing the patient data has been downloaded and store on your computer.
                        </p>
                    </div>
                }

                
                <embed src={this.state.base64data} type="application/pdf" width="50%" height="850px" scrolling = "no"></embed>
            </div>
        )
    }
}

export default PatientDataCID
