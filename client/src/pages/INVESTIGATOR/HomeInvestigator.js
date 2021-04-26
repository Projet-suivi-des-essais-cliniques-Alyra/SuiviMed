import React,{useState,useContext} from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import AccountContext from '../../contexts/AccountContext';

const HomeInvestigator = (props) => {

  //Contexts and Hooks
  const currentAccount = useContext(AccountContext);
  const [termPatientAlert,setTermPatientAlert] = useState('');
  const [termProtocolAlert,setTermProtocolAlert] = useState('');

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

  // determine la liste des patients de l'investigator par ID dans le project
  const patientIDsOfInvestigatorInProject = (_projectID) =>{
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
              <td>{patientIDsOfInvestigatorInProject(i)}</td>
          </tr>
        )
      }
    }
  }
   
  const onAlertButtonClick = async (event) => {
    event.preventDefault();
    console.log(termPatientAlert,termProtocolAlert)
    await props.contract.methods.setAlertOn(termPatientAlert,termProtocolAlert).send({from:currentAccount});
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
              value={termProtocolAlert}
              onChange={e => setTermProtocolAlert(e.target.value)}
              placeholder="Protocol ID">
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
              <th>Patients Project IDs</th>
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
