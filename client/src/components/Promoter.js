import React from 'react';
import Header from './Header';
import encryptData from '../utils/encryptData';
import decryptData from '../utils/decryptData';
import sendToIPFS from '../utils/sendToIPFS';

import ipfsConnection from '../utils/ipfsConnection';

class Promoter extends React.Component {

    state = {
        protocolDescription: '',
        protocolTreatmentList: ''
    }


    onButtonDescriptionClick = async e => {
        e.preventDefault();
        //await this.setState({ protocolDescription: protocolDescription });
        console.log("DATA =",this.state.protocolDescription);
        let encryptedData = encryptData(this.state.protocolDescription, 16, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        console.log("ENCRYPTED DATA",encryptedData);
        let decryptedData = decryptData(encryptedData, 'fpbyr4386v8hpxdruppijkt3v6wayxmi');
        console.log("DECRYPTED DATA =", decryptedData);


        let cidFromIPFS;
        await sendToIPFS(decryptedData).then(res => {
            console.log(res);
        })

    }

    onButtontreatmentListClick = async event => {
        event.preventDefault();
        // this.props.onButtontreatmentListClick(this.state.protocolTreatmentList);
        //await this.setState({ protocolTreatmentList: protocolTreatmentList });

        console.log(this.state.protocolTreatmentList);
    }


    render() {
        return (
            <div>
                <Header
                    balance={this.props.balance}
                    account={this.props.account}
                />

                <h1>Protocol description</h1>
                <textarea
                    rows="10"
                    cols="60"
                    onChange={e => this.setState({ protocolDescription: e.target.value })}
                />
                <p>
                    <button className="positive ui button" onClick={this.onButtonDescriptionClick}>
                        Encrypt and upload to IPFS
                    </button>
                </p>

                <h1>Confidential treatment list</h1>
                <textarea
                    rows="10"
                    cols="60"
                    onChange={e => this.setState({ protocolTreatmentList: e.target.value })}
                />

                <p>
                    <button className="positive ui button" onClick={this.onButtontreatmentListClick}>
                        Encrypt and upload to IPFS
                    </button>
                </p>
                

            </div>
        )
    }
}

export default Promoter;
