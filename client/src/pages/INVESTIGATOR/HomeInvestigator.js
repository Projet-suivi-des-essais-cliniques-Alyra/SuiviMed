import React,{useState,useContext} from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import ProjectsContext from '../../contexts/ProjectsContext';
import AccountContext from '../../contexts/AccountContext';

const HomeInvestigator = (props) => {

  //Contexts and Hooks
  const projectsContext = useContext(ProjectsContext);
  const currentAccount = useContext(AccountContext);

  const [termPatientAlert,setTermPatientAlert] = useState('');
  const [termProtocolAlert,setTermProtocolAlert] = useState('');

  //select projects of investigator
  // const projects=[];
  // let i=0;
  // for (; i < projectsContext.length; i++) {
  //   if (projectsContext[i].investigatorAddress==currentAccount){
  //     projects.push(projectsContext[i]);
  //   }
  // }

  console.log(projectsContext);

  // recupere la liste des patients de l'investigator
  const patientsByProject =  async (projectID) => {
    let patients = await props.contract.methods.projectInvestigatorPatientsIDs(projectID).call();
    return patients
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
              <th>Patients</th>
              <th>Status</th>
            </tr>
          </thead>
          {/* <tbody>
            {projects !== undefined && 
            projects.map((project,id) => //(validated, alertOn, date, promoterAddress, descriptionCID, treatmentsListCID) 
                <tr  key={project.protocolID}>                                     
                <td >{id}</td>
                <td >{patientsByProject(id)}</td>
                <td >{project.status ? <i class ="attention icon"></i> :"None"}</td>
                </tr>)
            }   
          </tbody> */}
        </table>
      </div>




    </div>
  );
};

export default HomeInvestigator;
