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

class CollectData extends Component {
    state = {
        data: {},
        rows: '',
        cols: '',
        base64: '',
        filename: '',
        dataCID: '',
        massage: '',
        patientID: ''
    }

    handleFiles = async files => {
        this.setState({ message: 'ok ' });

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

        // store data from ipfs to state
        this.state.rows.map((res, id) => {
            if (id !== 0) {
                this.state.data[res[0]] = res[1];
            }
        }); 

        this.setState({ dataCID: cid });
        console.log("CID FROM CODE =", this.state.dataCID);

        // Fetch data from ipfs
        let dataIPFS = await FetchFromIPFS(this.state.dataCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

        console.log("DATA FROM IPFS =", dataIPFS);
    }
    
    onButtonClick = async e => {
        e.preventDefault();

        this.setState({ message: '' });

        let patientID = this.state.data.index;
        const receipt = await this.props.contract.methods.collectData(patientID, this.state.dataCID)
            .send( {from: this.props.account} );

        console.log("EXCEL ROWS =", this.state.data);
        console.log("RECEIPT =", receipt);
        console.log("Protocole ID =", this.state.data["Protocol ID"]);
    }

    render() {
        let data = this.state.data;
        let message = this.state.message;
        console.log("MESSAGE =", message);
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

                <div className="head-patient">
                    <h2 className="ui dividing header">Collect patient data</h2>
                </div>

                <div className="patient-file">
                    <ReactFileReader fileTypes={[".csv",".pdf",".zip", ".xlsx"]} base64={true} handleFiles = {this.handleFiles}>
                        <button className="positive ui button">
                            Upload the patient data file into IPFS
                        </button>
                    </ReactFileReader>
                </div>
                
                <div className="data-collection">
                    <button className="ui primary button" type="submit" onClick = {this.onButtonClick}>
                        Submit
                    </button>
                </div>

                <div className="table">
                    <h2> Patient Data </h2>
                    <table className="ui tablet stackable table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th className="right aligned">Value</th>
                        </tr>
                    </thead>
                        <tbody>
                        {
                            this.state.message !== ''
                            ? 
                                <div className="ui positive message protocol-sent">
                                    <i className="close icon"></i>
                                    <div className="header">
                                        Patient successfully added
                                    </div>
                                    <p>
                                        The patient has been added
                                    </p>
                                </div>
                            :
                                Object.entries(data).map(([key, value]) => 
                                    <tr key={key}>
                                    <td>{key}</td>
                                    <td className="right aligned">{value}</td>
                                    </tr>
                                )
                        }         
                        </tbody>
                    </table>
                </div>

            </div>
        );
    }
}

export default CollectData
