import React,{useContext,useState} from 'react';
import Header from './Header';
import AccountContext from '../contexts/AccountContext';

import "../styles/PeoplePage.css";

const Patient = (props) => {

    const currentAccount = useContext(AccountContext);
    const [patientIndexEntered,setPatientIndexEntered] = useState('');
    // const [patientID,setPatientID] = useState('');
    // const [patientIndex,setPatientIndex] = useState('');
    // const [patientProject,setPatientProject] = useState('');


    const patientInfoProject = (_projectID) =>{ 
        let patientIDInProject=0;
        if (props.patients!==null){ 
            for (let i=0; i < props.patients.length; i++) {
                if (props.patients[i].projectID == _projectID) {
                    if (props.patients[i].patientAddress == String(currentAccount)) {
                        return  <tr  key={props.patients[i].patientAddress}>                                     
                                <td >{props.patients[i].projectID}</td>
                                <td>{i}</td>
                                <td>{patientIDInProject}</td>
                                <td >{props.patients[i].consent ? "given" : "revoked"}</td>
                                </tr>
                        } 
                    patientIDInProject++;      
                }
            }
        }
    }
        

    //select projects of investigator
    const patientTab=[];
    if (props.projects!==null){  
        for (let i=0; i < props.projects.length; i++) {
            patientTab.push(patientInfoProject(i));
        }
    }




    const onRevokeConsentButtonClick = async (event) => {
        event.preventDefault();
        await props.contract.methods.revokeConsent(patientIndexEntered).send({from:currentAccount});
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
                value={patientIndexEntered}
                onChange={e => setPatientIndexEntered(e.target.value)}
                placeholder="My Patient Index">
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
        <div>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Patient Index</th>
              <th>Patient ID (in Project)</th>
              <th>Consent</th>
            </tr>
          </thead>
          <tbody>
            {props.patients !== undefined && patientTab}
          </tbody>
        </table>
        </div>

        </div>
    );
};

export default Patient;