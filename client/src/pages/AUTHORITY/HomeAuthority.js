import React,{useContext,useState} from 'react';
import MenuAuthority from '../../components/MenuAuthority';
import Header from '../../components/Header';
import ProtocolsContext from '../../contexts/ProtocolsContext';
import AccountContext from '../../contexts/AccountContext';

import "../../styles/HomeAuthority.css";

const HomeAuthority = (props) => {

  //Contexts and Hooks
  const protocolsContext = useContext(ProtocolsContext);
  const currentAccount = useContext(AccountContext);

  const [termValidation,setTermValidation] = useState('');
  const [termAgreement,setTermAgreement] = useState('');
  
  const onValidationButtonClick = async (event) => {
    event.preventDefault();
    console.log(termValidation)
    await props.contract.methods.validateProtocol(termValidation).send({from:currentAccount});
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
        <MenuAuthority />
      </div>
    
      <div className="ui form">
        <div className ="two fields">
          <div className="form-btn">
            <div className="field">
              <input
                type="text"
                value={termValidation}
                onChange={e => setTermValidation(e.target.value)}
                placeholder="Protocol ID">
              </input>
            </div>
          </div>
          <div className="btn">
            <div className="field">
              <button onClick={e => onValidationButtonClick(e)} className="ui primary button">
                Validate Protocol
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

      <div>
        <table className="ui celled table">
          <thead>
            <tr>
              <th>Protocol ID</th>
              <th>Validation</th>
              <th>Alert</th>
            </tr>
          </thead>
          <tbody>
            {protocolsContext !== undefined && 
            protocolsContext.map((protocol,id) => //(validated, alertOn, date, promoterAddress, descriptionCID, treatmentsListCID) 
                <tr  key={protocol.date}>                                     
                <td >{id}</td>
                <td >{protocol.validated ? "done" : "pending"}</td>
                <td >{protocol.alertOn ? <i class ="attention icon"></i> :"None"}</td>
                </tr>)
            }   
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeAuthority;