import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomeAuthority from "../pages/AUTHORITY/HomeAuthority";
import ReadDataAuthority from '../pages/AUTHORITY/ReadDataAuthority';

class Authority extends React.Component {

    render() {
        
        return (  
            
            <BrowserRouter>
            <Redirect to="/AUTHORITY/" />
            <Switch>
                <Route exact path="/AUTHORITY/">
                    <HomeAuthority contract={this.props.contract}/>
                </Route>
                {/* <Route exact path="/AUTHORITY/" component={HomeAuthority} /> */}
                <Route path="/AUTHORITY/ReadDataAuthority" exact component={ReadDataAuthority} />
            </Switch>
            </BrowserRouter>
        )
    }
}

export default Authority;