import React,{useState,useContext} from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import AccountContext from '../../contexts/AccountContext';

const HomeInvestigator = (props) => {

  //Contexts and Hooks
  const currentAccount = useContext(AccountContext);
  const [termPatientAlert,setTermPatientAlert] = useState('');
  const [termProjectAlert,setTermProjectAlert] = useState('');


  // determine patient Index using patient ID in the project 
  const patientIDToPatientIndex = (_patientID,_projectID) => {
    if (props.patients!==null){  
      let patientIDInProject=0;
      for (let patientIndex=0; patientIndex < props.patients.length; patientIndex++) {       
        if (props.patients[patientIndex].projectID == _projectID ) { 
              
              if (patientIDInProject ==_patientID) { 
                console.log("patientIndex=",patientIndex);
                return patientIndex;
              }  
            patientIDInProject++;
        }         
      }
    }
  }
  
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

  // determine la liste des patients actifs de l'investigator par ID dans le project
  const consentedPatientsIDsOfInvestigatorInProject = (_projectID) =>{
    if (props.patients!==null){  
      let patientsInProject=[];
      let patientIDInProject=0;
      for (let i=0; i < props.patients.length; i++) {
        if (props.patients[i].projectID == _projectID) {
          if(props.patients[i].investigatorAddress==String(currentAccount) &&
          props.patients[i].consent==true) {   
            patientsInProject.push(patientIDInProject);
          } 
          patientIDInProject++;      
        }
      }
      return patientsInProject.toString();
    }
  }

  // determine la liste des patients revoqués de l'investigator par ID dans le project
  const revokedPatientsIDsOfInvestigatorInProject = (_projectID) =>{
    if (props.patients!==null){  
      let patientsInProject=[];
      let patientIDInProject=0;
      for (let i=0; i < props.patients.length; i++) {
        if (props.patients[i].projectID == _projectID) {
          if(props.patients[i].investigatorAddress==String(currentAccount) &&
          props.patients[i].consent==false) {   
            patientsInProject.push(patientIDInProject);
          } 
          patientIDInProject++;      
        }
      }
      return patientsInProject.toString();
    }
  }

  //select projects of investigator
  const projectsTab=[];
  if (props.projects!==null){  
    for (let i=0; i < props.projects.length; i++) {
      if (props.projects[i].investigatorsAddresses.includes(String(currentAccount))){   
        projectsTab.push(
          <tr  key={props.projects[i].protocolID}>                                     
              <td >{i}</td>
              <td>{props.projects[i].protocolID}</td>
              <td >{renderStatus(props.projects[i].status)}</td>
              <td>{consentedPatientsIDsOfInvestigatorInProject(i)}</td>
              <td style={{'color':'red'}}>{revokedPatientsIDsOfInvestigatorInProject(i)}</td>
          </tr>
        )
      }
    }
  }
   
  const onAlertButtonClick = async (event) => {
    event.preventDefault();
    console.log(termPatientAlert,termProjectAlert)
    console.log(patientIDToPatientIndex(termPatientAlert,termProjectAlert))
    console.log(props.projects[termProjectAlert].protocolID)
    await props.contract.methods
    .setAlertOn(patientIDToPatientIndex(termPatientAlert,termProjectAlert),props.projects[termProjectAlert].protocolID)
    .send({from:currentAccount});
  }

  return (
    <div>
      <Header />
    
    <div className="home">
     <MenuInvestigator />
    </div>

    <div className="ui form">
      <div className ="fields">
      <div className="form-btn">
          <div className="field">
            <input
              type="text"
              value={termPatientAlert}
              onChange={e => setTermPatientAlert(e.target.value)}
              placeholder="Patient ID">
            </input>
          </div>
            </div>
        <div className="form-btn">
          <div className="field">
            <input
              type="text"
              value={termProjectAlert}
              onChange={e => setTermProjectAlert(e.target.value)}
              placeholder="Project ID">
            </input>
          </div>
            </div>
              <div className="btn">
                <div className="field">
                  <button onClick={e => onAlertButtonClick(e)} className="ui primary button">
                    Set Alert On Protocol
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
              <th>Trial Master File (Protocol ID)</th>
              <th>Status</th>
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

export default HomeInvestigator;
