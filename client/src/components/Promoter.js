import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomePromoter from "../pages/PROMOTER/HomePromoter";
import ProtocolPage from '../pages/PROMOTER/ProtocolPage';
import ProjectPage from '../pages/PROMOTER/ProjectPage';
import ReadDataPromoter from '../pages/PROMOTER/ReadDataPromoter';
import PeoplePagePromoter from '../pages/PROMOTER/PeoplePagePromoter';

class Promoter extends React.Component {

    render() {
        return ( 
            <BrowserRouter>
            <Redirect to="/PROMOTER/" />
            <Switch>
                <Route exact path="/PROMOTER/">
                    <HomePromoter
                        contract={this.props.contract}
                        projects={this.props.projects}
                        patients={this.props.patients}/>
                </Route> 
                <Route exact path="/PROMOTER/ProtocolPage">
                    <ProtocolPage  contract={this.props.contract}/>
                </Route>
                <Route exact path="/PROMOTER/ProjectPage">
                    <ProjectPage
                        contract={this.props.contract}/>
                </Route>
                <Route exact path="/PROMOTER/ReadDataPromoter">
                    <ReadDataPromoter
                        contract={this.props.contract}
                        patients={this.props.patients}/>
                </Route>
                <Route exact path="/PROMOTER/PeoplePagePromoter">
                    <PeoplePagePromoter
                        contract={this.props.contract}/>
                </Route>
            </Switch>
            </BrowserRouter>

        );
    }
}

export default Promoter;

