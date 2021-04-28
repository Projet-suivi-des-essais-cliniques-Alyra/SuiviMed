import React, { Component } from 'react';
import MenuAuthority from '../../components/MenuAuthority';
import Header from '../../components/Header';
import AccountContext from '../../contexts/AccountContext';
import FetchFromIPFS from '../../utils/FetchFromIPFS';
import "../../App.css";

class ReadDataAuthority extends Component {

  static contextType = AccountContext;  

  constructor (props) {
    super(props);
    this.state = {
      projectID:'',
      patientID: '',
      fileID:'',
      base64data: '',
    }
    this.patientIDToPatientIndex = this.patientIDToPatientIndex.bind(this);
}

  // determine patient Index using patient ID in the project 
  patientIDToPatientIndex = (_patientID,_projectID) => {
    if (this.props.patients!==null){  
      let patientIDInProject=0;
      for (let patientIndex=0; patientIndex < this.props.patients.length; patientIndex++) {       
        if (this.props.patients[patientIndex].projectID == _projectID ) { 
              
              if (patientIDInProject ==_patientID) { 
                console.log("patientIndex=",patientIndex);
                return patientIndex;
              }  
            patientIDInProject++;
        }         
      }
    }
  }
  
  onButtonClick = async e => {
      e.preventDefault();
      console.log("BUTTON RETURNS =", this.state.patientID,this.state.projectID);
      try{
      const receipt = await this.props.contract.methods
      .getPatientDataCIDs(this.patientIDToPatientIndex(this.state.patientID,this.state.projectID))
      .call({ from: this.contextType })
      console.log("receipt=",receipt)
      
      let fileID = this.state.fileID
      console.log("fileID=",fileID)
      const cid = receipt[fileID];
      const base64data = await FetchFromIPFS(cid, 'fpbyr4386v8hpxdruppijkt3v6wayxmi'); 
      this.setState({
          base64data: base64data
      });

      console.log("RECEIPT =", cid);
      console.log("ENCODED DATA =", base64data);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `failed to download, Patient's Data are not available.`,
      );
      console.error(error);
    }
  }

  render() {
      return (
        <div>

          <div>
          <Header />
          </div>
          <div className="home">
            <MenuAuthority />
          </div>
                

          <div className="head-patient">
              <h2 className="ui dividing header">Read Patient's Data</h2>
          </div>

          <form className = "ui form">
              
              <div className ="patient-ID">
                  <label>Project ID</label>
                  <input
                      type="text"
                      name="id"
                      value={this.state.projectID}
                      required
                      onChange = {e => this.setState({ projectID: e.target.value} )}
                  />                            
              </div>

              <div className ="patient-ID">
                  <label>Patient ID</label>
                  <input
                      type="text"
                      name="id"
                      value={this.state.patientID}
                      required
                      onChange = {e => this.setState({ patientID: e.target.value} )}
                  />                            
              </div>

              <div className ="patient-ID">
                  <label>File ID</label>
                  <input
                      type="text"
                      name="id"
                      value={this.state.fileID}
                      required
                      onChange = {e => this.setState({ fileID: e.target.value} )}
                  />                            
              </div>

              <button className="ui primary button" type="submit" onClick = {this.onButtonClick}>
                  Submit
              </button>
          </form>

          <div className="filereader">
              <embed src={this.state.base64data}  type="application/pdf" width="50%" height="850px" scrolling = "no"></embed>
          </div>
         
        </div>
      )
  }
}

export default ReadDataAuthority;