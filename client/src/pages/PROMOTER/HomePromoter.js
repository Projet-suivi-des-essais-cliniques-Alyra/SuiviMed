import React,{useState,useContext} from 'react';
import MenuPromoter from '../../components/MenuPromoter';
import Header from '../../components/Header';
import ProtocolsContext from '../../contexts/ProtocolsContext';
import AccountContext from '../../contexts/AccountContext';

import "../../styles/HomePromoter.css";

const HomePromoter = (props) => {

  //Contexts and Hooks
  const protocolsContext = useContext(ProtocolsContext);
  const currentAccount = useContext(AccountContext);

  const [termAgreement,setTermAgreement] = useState('');
  const [termResume,setTermResume] = useState('');

  const renderStatus = (p) => {
    if(p === '0'){
       return "ACTIVE";
    }
    else if (p ==='1') {
      return "SUSPENDED";
    } 
    else if (p === '2') {
        return "CLOSED";
    }
    else{return null;}
  }

  // determine la liste des patients actifs dans le project
  const consentedPatientsIDsOfInvestigatorInProject = (_projectID) =>{
    if (props.patients!==null){  
      let patientsInProject=[];
      let patientIDInProject=0;
      for (let i=0; i < props.patients.length; i++) {
        if (props.patients[i].projectID == _projectID) {
          if(props.patients[i].consent==true) {   
            patientsInProject.push(patientIDInProject);
          } 
          patientIDInProject++;      
        }
      }
      return patientsInProject.toString();
    }
  }

  // determine la liste des patients revoqués dans le project
  const revokedPatientsIDsOfInvestigatorInProject = (_projectID) =>{
    if (props.patients!==null){  
      let patientsInProject=[];
      let patientIDInProject=0;
      for (let i=0; i < props.patients.length; i++) {
        if (props.patients[i].projectID == _projectID) {
          if(props.patients[i].consent==false) {   
            patientsInProject.push(patientIDInProject);
          } 
          patientIDInProject++;      
        }
      }
      return patientsInProject.toString();
    }
  }

  //select projects of promoter
  const projectsTab=[];
  if (props.projects!==null){  
    for (let i=0; i < props.projects.length; i++) {
      if (props.projects[i].promoterAddress==String(currentAccount)){   
        projectsTab.push(
          <tr  key={props.projects[i].protocolID}>                                     
              <td >{i}</td>
              <td>{props.projects[i].protocolID}</td>
              <td >{renderStatus(props.projects[i].status)}</td>
              <td>{props.projects[i].investigatorsAddresses.
              map(investigator => investigator.substring(0,4).concat(" "))}</td>
              <td>{consentedPatientsIDsOfInvestigatorInProject(i)}</td>
              <td style={{'color':'red'}}>{revokedPatientsIDsOfInvestigatorInProject(i)}</td>
          </tr>
        )
      }
    }
  }
  
  const onResumeButtonClick = async (event) => {
    event.preventDefault();
    console.log(this.props.patients)
    await props.contract.methods.resumeAfterAlert(termResume).send({from:currentAccount});
  }

  const onAgreementButtonClick = async (event) => {
    event.preventDefault();
    console.log(termAgreement)
    await props.contract.methods.agreeOnResume(termAgreement).send({from:currentAccount});
  }

  return (
    <div>
      <Header />
    <div className="home">
     <MenuPromoter />
    </div>
    
    <div className="ui form">
      <div className ="two fields">
        <div className="form-btn">
          <div className="field">
            <input
              type="text"
              value={termAgreement}
              onChange={e => setTermAgreement(e.target.value)}
              placeholder="Protocol ID">
            </input>
          </div>
        </div>
          <div className="btn">
            <div className="field">
              <button onClick={e => onAgreementButtonClick(e)} className="ui primary button">
                Agree On Resume Clinical Trials for Protocol
              </button>
            </div>  
          </div>
        </div>
      </div>
    
    <div className="ui form">
      <div className ="two fields">
        <div className="form-btn">
          <div className="field">
            <input
              type="text"
              value={termResume}
              onChange={e => setTermResume(e.target.value)}
              placeholder="Protocol ID">
            </input>
          </div>
            </div>
              <div className="btn">
                <div className="field">
                  <button onClick={e => onResumeButtonClick(e)} className="ui primary button">
                    Resume Clinical Trials for Protocol
                  </button>
                </div>  
              </div>
            </div>
          </div>
          
          
          <h2 className="ui dividing header">Protocols</h2>
         

          <div>
          <table className="ui celled table">
            <thead>
              <tr>
                <th>Trial Master File (Protocol ID)</th>
                <th>Validation</th>
                <th>Alert</th>
              </tr>
            </thead>
            <tbody>
              {protocolsContext !== undefined && 
              protocolsContext.map((protocol,id) => //(validated, alertOn, date, promoterAddress, descriptionCID, treatmentsListCID) 
                  <tr  key={protocol.date}>                                     
                  <td >{id}</td>
                  <td >{protocol.validated ? <i class="large green checkmark icon"></i> : <i class="hourglass outline icon"></i>}</td>
                  <td >{protocol.alertOn ? <i class ="attention icon"></i> :"None"}</td>
                  </tr>)
              }   
            </tbody>
          </table>
        </div>

        <h2 className="ui dividing header">Projects</h2>

          <div>
          <table className="ui celled table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Trial Master File (Protocol ID)</th>
                <th>Status</th>
                <th>Investigators</th>
                <th>Patients Project IDs (consent given)</th>
                <th>Patients Project IDs (consent revoked)</th>
              </tr>
            </thead>
            <tbody>
              {props.projects !== undefined && projectsTab}
            </tbody>
          </table>
          </div>
        
    
    </div>
  );
};

export default HomePromoter;