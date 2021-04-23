import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomeInvestigator from "../pages/INVESTIGATOR/HomeInvestigator";
import AddPatient from '../pages/INVESTIGATOR/AddPatient';
import CollectData from '../pages/INVESTIGATOR/CollectData';
import ReadDataInvestigator from '../pages/INVESTIGATOR/ReadDataInvestigator';

class Investigator extends React.Component {

    render() {
        
        return ( 
            <BrowserRouter>
            <Redirect to="/INVESTIGATOR/" />
            <Switch>
                <Route exact path="/INVESTIGATOR/">
                    <HomeInvestigator contract={this.props.contract} projects={this.props.projects}/>
                </Route> 
                <Route exact path="/INVESTIGATOR/AddPatient">
                    <AddPatient  contract={this.props.contract}/>
                </Route>
                <Route exact path="/INVESTIGATOR/CollectData">
                    <CollectData  contract={this.props.contract}/>
                </Route>
                <Route exact path="/INVESTIGATOR/ReadDataInvestigator">
                    <ReadDataInvestigator  contract={this.props.contract}/>
                </Route>
            </Switch>
            </BrowserRouter>

        );
    }
}

export default Investigator;