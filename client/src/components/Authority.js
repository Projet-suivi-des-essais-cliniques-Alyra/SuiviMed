import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomeAuthority from "../pages/AUTHORITY/HomeAuthority";
// import EditProtocol from "../pages/EditProtocol";
import ReadDataAuthority from '../pages/AUTHORITY/ReadDataAuthority';
// import SendToIPFS from '../utils/SendToIPFS';
// import FetchFromIPFS from '../utils/FetchFromIPFS';
// import ipfsConnection from '../utils/ipfsConnection';

class Authority extends React.Component {

    state = {
        protocolDescription: '',
        protocolTreatmentList: '',
        protocoleCID: '',
        listCID: '',
        protocolData: 0,
        base64data: "",
        filename: '',
        data: ''
    }

    render() {
        
        return (  
            
            <BrowserRouter>
            <Redirect to="/AUTHORITY/" />
            <Switch>
                <Route path="/AUTHORITY/" exact component={HomeAuthority} />
                <Route path="/AUTHORITY/ReadDataAuthority" exact component={ReadDataAuthority} />
            </Switch>
            </BrowserRouter>
        )
    }
}

export default Authority;