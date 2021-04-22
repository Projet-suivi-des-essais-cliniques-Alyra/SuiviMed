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
  
  const onResumeButtonClick = async (event) => {
    event.preventDefault();
    console.log(termResume)
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

export default HomePromoter;