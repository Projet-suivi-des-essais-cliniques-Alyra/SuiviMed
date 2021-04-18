import React from 'react';
import Header from './Header';
import encryptData from '../utils/encryptData';
import decryptData from '../utils/decryptData';
// import { BrowserRouter, Switch, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import sendToIPFS from '../utils/sendToIPFS';
// import fetchFromIPFS from '../utils/fetchFromIPFS';
// import ipfsConnection from '../utils/ipfsConnection';

class Promoter extends React.Component {

    state = {
        protocolDescription: '',
        protocolTreatmentList: '',
        protocoleCID: '',
        listCID: '',
        protocolData: 0
    }

    onButtontreatmentListClick = async e => {
        e.preventDefault();
        console.log("DATA =",this.state.protocolDescription);
        let encryptedData = encryptData(this.state.protocolDescription, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        console.log("ENCRYPTED DATA",encryptedData);
        let decryptedData = decryptData(encryptedData, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        console.log("DECRYPTED DATA =", decryptedData);

        // let cidFromIPFS;
        // await sendToIPFS(encryptedData).then(res => {
        //     cidFromIPFS = res.cid.toString();
        //     console.log("CID FROM IPFS =",cidFromIPFS);
        // });
        // this.setState({ protocoleCID: cidFromIPFS });

        // console.log("CID FROM STATE =", this.state.protocoleCID);

        // //
        // console.log("DATA =",this.state.protocolTreatmentList);
        // let encryptedData1 = encryptData(this.state.protocolTreatmentList, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        // console.log("ENCRYPTED DATA LIST",encryptedData1);
        // let decryptedData1 = decryptData(encryptedData1, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        // console.log("DECRYPTED DATA LIST =", decryptedData);

        // let cidFromIPFS1;
        // await sendToIPFS(encryptedData1).then(res => {
        //     cidFromIPFS1 = res.cid.toString();
        //     console.log("CID FROM IPFS LIST =",cidFromIPFS1);
        // });
        // this.setState({ listCID: cidFromIPFS1 });

        // console.log("CID FROM STATE LIST = ", this.state.listCID);
        
        // await this.props.onProtocolClick(this.state.protocoleCID, this.state.listCID);
        
        // // Fetch data from ipfs
        // let protocolDescriptionData = await fetchFromIPFS(this.state.protocoleCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        // let protocolTreatmentListData = await fetchFromIPFS(this.state.listCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

        // console.log('DATA PROT DESC =', protocolDescriptionData);
        // console.log('DATA PROT LIST =', protocolTreatmentListData);

        // let data = [];
        // data.push(protocolDescriptionData);
        // data.push(protocolTreatmentListData);

        // this.setState({ protocolData: data });

        // console.log("DATA HERE =", this.state.protocolData);

    }

    render() {
        let data = this.state.protocolData;

        return ( 
            // <BrowserRouter>
            // <Switch>
            //     <Route path="/" exact component={Home} />
            //     {/* <Route path="/editProtocol" exact component={editProtocol} />
            //     <Route path="/readProtocol" exact component={readProtocol} /> */}
            // </Switch>
    
            <div>
                <Header
                    role={this.props.role}
                    account={this.props.account}
                />

                <h1>Protocol file description</h1>
                <h4> {this.state.protocoleCID} </h4>
                <textarea
                    rows="6"
                    cols="60"
                    onChange={e => this.setState({ protocolDescription: e.target.value })}
                />

                <h1>Confidential treatment list</h1>
                <h4> {this.state.listCID} </h4>
                <textarea
                    rows="6"
                    cols="60"
                    onChange={e => this.setState({ protocolTreatmentList: e.target.value })}
                /> 
                
                <p></p>

                <p>
                    <button className="positive ui button" onClick={this.onButtontreatmentListClick}>
                        Encrypt and upload to IPFS
                    </button>
                </p>

                <h2> Protocols Data fetched from Ethereum Blockchain </h2>
                <div className="table">
                    <table className="ui tablet stackable table">
                    <thead>
                        <tr>
                            <th>Protocol type</th>
                            <th className="right aligned">Data</th>
                        </tr>
                    </thead>
                        <tbody>
                        {
                        Object.entries(data).map(([key, value]) => 
                            <tr key={key}>
                            <td>{key}</td>
                            <td className="right aligned">{value}</td>
                            </tr>
                        )}         
                    </tbody>
                    </table>
                </div>
           
            </div>
            // </BrowserRouter>
        );
    }
}

export default Promoter;