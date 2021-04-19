import React from 'react';
import ReactFileReader from 'react-file-reader';
import Header from './Header';
import EncryptData from '../utils/EncryptData';
import DecryptData from '../utils/DecryptData';
// const ipfsClient = require("ipfs-http-client") ;
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import HomePromoter from "../pages/PROMOTER/HomePromoter";
import ReadDataPromoter from '../pages/PROMOTER/ReadDataPromoter';
import SendToIPFS from '../utils/SendToIPFS';
import FetchFromIPFS from '../utils/FetchFromIPFS';
import ProtocolPage from '../pages/PROMOTER/ProtocolPage';
// import ipfsConnection from '../utils/ipfsConnection';


class Promoter extends React.Component {

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


    handleFiles = async files => {
        // encode the file to base64 and save it into state
        this.setState({
            filename: files.fileList[0].name
        })

        // send data to ipfs
        let encryptedData = EncryptData(files.base64, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

        let cid = await SendToIPFS(encryptedData);
        this.setState({ protocoleCID: cid });
        console.log("CID FROM CODE =", this.state.protocoleCID);

        // Fetch data from ipfs
        let data = FetchFromIPFS(this.state.protocoleCID, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');

        this.setState({ data: await data });

        console.log("DATA FRO IPFS =", await data);

    }



    onButtontreatmentListClick = async e => {
        e.preventDefault();
        console.log("DATA =",this.state.protocolDescription);
        let encryptedData = EncryptData(this.state.protocolDescription, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        console.log("ENCRYPTED DATA",encryptedData);
        let decryptedData = DecryptData(encryptedData, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        console.log("DECRYPTED DATA =", decryptedData);

        
        // Connect IPFS
        // Connect to local node
        //const ipfs = ipfsClient("localhost", "5001", {protocol: 'http'});
        // const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001')
        // Connect to Infura with public gateway
        //const ipfs = ipfsClient({host: "ipfs.infura.io", port: "5001", protocol: 'https'});



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
        
        return ( 
            <BrowserRouter>
            <Redirect to="/PROMOTER/" />
            <Switch>
                <Route path="/PROMOTER/" exact component={HomePromoter} />
                <Route path="/PROMOTER/ProtocolPage" exact component={ProtocolPage} />
                <Route path="/PROMOTER/ReadDataPromoter" exact component={ReadDataPromoter} />
            </Switch>
            </BrowserRouter>


            // <ReactFileReader fileTypes={[".csv",".pdf",".zip"]} base64={true} handleFiles = {this.handleFiles}>
            //     <button className="positive ui button">
            //         Upload the protocole decsription file into IPFS
            //     </button>
            // </ReactFileReader>
            // {this.state.filename}

            // <h2>Protocole Description</h2>
            // <br></br>
            // <embed src={this.state.data}  type="application/pdf" width="50%" height="500px" scrolling = "no"></embed>
            // {/* <embed src={this.state.file}  type="application/pdf" width="50%" height="850px"></embed> */}
            // </div>

        );
    }
}

export default Promoter;












//  <div>
//     <Header
//         role={this.props.role}
//         account={this.props.account}
//     />

//     <h1>Protocol file description</h1>
//     <h4> {this.state.protocoleCID} </h4>
//     <textarea
//         rows="6"
//         cols="60"
//         onChange={e => this.setState({ protocolDescription: e.target.value })}
//     />

//     <h1>Confidential treatment list</h1>
//     <h4> {this.state.listCID} </h4>
//     <textarea
//         rows="6"
//         cols="60"
//         onChange={e => this.setState({ protocolTreatmentList: e.target.value })}
//     /> 
    
//     <p></p>

//     <p>
//         <button className="positive ui button" onClick={this.onButtontreatmentListClick}>
//             Encrypt and upload to IPFS
//         </button>
//     </p>

//     <h2> Protocols Data fetched from Ethereum Blockchain </h2>
//     <div className="table">
//         <table className="ui tablet stackable table">
//         <thead>
//             <tr>
//                 <th>Protocol type</th>
//                 <th className="right aligned">Data</th>
//             </tr>
//         </thead>
//             <tbody>
//             {
//             Object.entries(data).map(([key, value]) => 
//                 <tr key={key}>
//                 <td>{key}</td>
//                 <td className="right aligned">{value}</td>
//                 </tr>
//             )}         
//         </tbody>
//         </table>
//     </div>

// </div>
