import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomeInvestigator from "../pages/INVESTIGATOR/HomeInvestigator";
import PatientsPage from '../pages/INVESTIGATOR/PatientsPage';
import ReadDataInvestigator from '../pages/INVESTIGATOR/ReadDataInvestigator';


class Investigator extends React.Component {

    render() {
        
        return ( 
            <BrowserRouter>
            <Redirect to="/INVESTIGATOR/" />
            <Switch>
                <Route exact path="/INVESTIGATOR/">
                    <HomeInvestigator contract={this.props.contract}/>
                </Route> 
                <Route exact path="/INVESTIGATOR/PatientsPage">
                    <PatientsPage  contract={this.props.contract}/>
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