import React, { Component } from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import AccountContext from '../../contexts/AccountContext';
import FetchFromIPFS from '../../utils/FetchFromIPFS';
import "../../App.css";

class ReadDataInvestigator extends Component {

  static contextType = AccountContext;  

  state = {
      patientID: '',
      cols: '',
      rows: '',
      base64data: '',
      message: ''
  }

  onButtonClick = async e => {
      e.preventDefault();
      console.log("BUTTON RETUNS =", this.state.patientID);

      const receipt = await this.props.contract.methods.getPatientDataCIDs(this.state.patientID)
          .call({ from: this.contextType });
      
      const cid = receipt[0];
      const base64data = await FetchFromIPFS(cid, 'fpbyr4386v8hpxdruppijkt3v6wayxmi'); 
      this.setState({
          message: 'ok',
          base64data: base64data
      });

      console.log("RECEIPT =", cid);
      console.log("ENCODED DATA =", base64data);
  }

  render() {
      return (
        <div>

          <div>
          <Header />
          </div>
          <div className="home">
            <MenuInvestigator />
          </div>
                

          <div className="head-patient">
              <h2 className="ui dividing header">Enter the patient ID to get its data</h2>
          </div>

          <form className = "ui form">
              <div className ="patient-ID">
                  <label>Patient ID</label>
                  <input
                      type="text"
                      name="id"
                      value={this.state.value}
                      required
                      onChange = {e => this.setState({ patientID: e.target.value} )}
                  />                            
              </div>

              <button className="ui primary button" type="submit" onClick = {this.onButtonClick}>
                  Submit
              </button>
          </form>

          {
              this.state.message === ''
              ?
                  console.log('')
              :
              <div className="ui positive message protocol-sent">
                  <i className="close icon"></i>
                  <div className="header">
                      File successfully downloaded
                  </div>
                  <p>
                      The file containing the patient data has been downloaded and store on your computer.
                  </p>
              </div>
          }
          
          <embed src={this.state.base64data} type="application/pdf" width="50%" height="850px" scrolling = "no"></embed>
        </div>
      )
  }
}

export default ReadDataInvestigator;