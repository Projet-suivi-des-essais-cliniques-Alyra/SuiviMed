import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomeAuthority from "../pages/AUTHORITY/HomeAuthority";
import ReadDataAuthority from '../pages/AUTHORITY/ReadDataAuthority';
import PeoplePageAuthority from '../pages/AUTHORITY/PeoplePageAuthority';

class Authority extends React.Component {

    render() {
        
        return (  
            
            <BrowserRouter>
            <Redirect to="/AUTHORITY/" />
            <Switch>
                <Route exact path="/AUTHORITY/">
                    <HomeAuthority
                        contract={this.props.contract}
                        projects={this.props.projects}
                        patients={this.props.patients}
                    />
                </Route>
                <Route exact path="/AUTHORITY/ReadDataAuthority">
                <ReadDataAuthority
                    contract={this.props.contract}
                    patients={this.props.patients}/>
                </Route>
                <Route exact path="/AUTHORITY/PeoplePageAuthority">
                    <PeoplePageAuthority contract={this.props.contract}/>
                </Route>
            </Switch>
            </BrowserRouter>
        )
    }
}

export default Authority;