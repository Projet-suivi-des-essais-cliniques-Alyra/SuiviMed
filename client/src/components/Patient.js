import React,{useContext,useState} from 'react';
import Header from './Header';
import AccountContext from '../contexts/AccountContext';

import "../styles/PeoplePage.css";

const Patient = (props) => {

    const currentAccount = useContext(AccountContext);
    const [patientID,setPatientID] = useState('');

    const onRevokeConsentButtonClick = async (event) => {
        event.preventDefault();
        await props.contract.methods.revokeConsent(patientID).send({from:currentAccount});
    }

    return (
        <div>

        <Header />
        
        <div className="ui form">
        <div className ="two fields">
            <div className="form-btn-address">
            <div className="field">
                <input
                type="text"
                value={patientID}
                onChange={e => setPatientID(e.target.value)}
                placeholder="My Patient ID">
                </input>
            </div>
            </div>
            <div className="btn">
                <div className="field">
                <button onClick={e => onRevokeConsentButtonClick(e)} className="ui primary button">
                    I Do Revoke My Consent
                </button>
                </div>  
            </div>
            </div>
        </div>

        </div>
    );
};

export default Patient;