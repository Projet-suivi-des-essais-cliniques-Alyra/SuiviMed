import React,{useState,useContext,useEffect} from 'react';
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

  const projects=[];
  
  useEffect(() => {
    //select projects of investigator
    if (projectsContext!=null){  
      let i=0;
      for (; i < projectsContext.length; i++) {
        let tab=projectsContext[i].investigatorsAddresses
        if (tab.includes(String(currentAccount))){
          let project = {}
          for (let key in projectsContext[i]) {
            project[key] = projectsContext[i][key];
          }
          //Object.assign({}, projectsContext[i]);
          project.id=i;
          //console.log("patientsByProject(i):",patientsByProject(i));
          project.patients=1;//patientsByProject(i);
          project.status=renderStatus(project.status);
          projects.push(project);
        }
      }
    }
  }, [projectsContext]);
  
  console.log("projectsContext:",projectsContext);
  console.log("projects:",projects[0])

  // recupere la liste des patients de l'investigator
  const patientsByProject =  async (projectID) => {
    let patients = await props.contract.methods.getPatientsInProject(projectID).call();
    return patients
  }

  const onAlertButtonClick = async (event) => {
    event.preventDefault();
    console.log(termPatientAlert,termProtocolAlert)
    await props.contract.methods.setAlertOn(termPatientAlert,termProtocolAlert).send({from:currentAccount});
  }


  const renderStatus = (p) => {
    if(p == '0'){
       return "ACTIVE";
    }
    else if (p =='1') {
      return "SUSPENDED";
    } 
    else if (p == '2') {
        return "CLOSED";
    }
    else{return null;}
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
              <th>Protocol ID</th>
              <th>Patients</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {projects !== undefined && 
            projects.map((project,id) => //(validated, alertOn, date, promoterAddress, descriptionCID, treatmentsListCID) 
                <tr  key={project.protocolID}>                                     
                <td >{1}</td>
                <td>{1}</td>
                <td >{1}</td>
                <td >{1}</td>
                </tr>)
            }   
          </tbody>
        </table>
      </div>




    </div>
  );
};

export default HomeInvestigator;
