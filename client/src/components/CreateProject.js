import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from './Header';
import Home from "../pages/Home";
import ReadDocuments from '../pages/ReadDocuments';
import EditProtocol from './EditProtocol';
import EncryptData from '../utils/EncryptData';
import SendToIPFS from '../utils/SendToIPFS';
import FetchFromIPFS from '../utils/FetchFromIPFS';
import "../App.css";

class CreateProject extends Component {
    state = {
        protocolID: '',
        promoterAddress: '',
        confirmation: '',
        eventProjectID: '',
        eventProtocolID: '',
        eventInvestigatorAddress: ''
    }

    onFormSubmit = async e => {
        e.preventDefault();

        // send cids to ethereum Blockchain  
        const receipt = await this.props.contract.methods.createProject(this.state.protocolID, this.state.promoterAddress)
        .send({ from: this.props.account });
        console.log("RECEIPT =", receipt.events);        

        // managing events for alert
        this.setState({
            eventInvestigatorAddress: await receipt.events.investigatorAdded.returnValues[0],
            eventProjectID: receipt.events.projectCreation.returnValues[0],
            eventProtocolID: receipt.events.projectCreation.returnValues[1]
        });

        this.setState({ confirmation: 'confirmed' });


        console.log("CONTRACT =", this.props.contract);
        
    }
    

    render() {
        let confirmation = this.state.confirmation;
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/EditProtocol" exact component={EditProtocol} />
                    <Route path="/CreateProject" exact component={CreateProject} />
                    <Route path="/ReadProtocol" exact component={ReadDocuments} />
                    </Switch>
                </BrowserRouter>

                <h2 className="head1">Project creation</h2>

                {
                    confirmation === '' ?
                        <div className="proj-creation">
                            <form className = "ui form" onSubmit={this.onFormSubmit}>
                                <div className ="field">
                                    <label>Protocole ID</label>
                                    <input
                                        type="text"
                                        name="id"
                                        placeholder="protocol ID"
                                        onChange = {e => this.setState({ protocolID: e.target.value} )}
                                    />
                                </div>
                                <div className ="field">
                                    <label>Investigator address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Investigator address"
                                        onChange = {e => this.setState({ promoterAddress: e.target.value })}
                                    />
                                </div>
                                <button className="ui primary button" type="submit" onSubmit = {this.onFormSubmit}>
                                    Submit
                                </button>               
                            </form>                
                        </div>
                    :
                        <div className="ui positive message protocol-sent">
                            <i className="close icon"></i>
                            <div className="header">
                                Project successfully created
                            </div>
                            <p>
                                The project ID is <strong>{this.state.eventProjectID}</strong>,
                                the corresponding protocol ID is <strong>{this.state.eventProtocolID}</strong>,  
                                and investigator <strong>{this.state.eventInvestigatorAddress}</strong> has been
                                added to it.
                            </p>
                        </div>
                }
            </div>
        );
    }
}

export default CreateProject
