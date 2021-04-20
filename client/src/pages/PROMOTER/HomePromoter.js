import React,{useState,useContext} from 'react';
import MenuPromoter from '../../components/MenuPromoter';
import Header from '../../components/Header';
import ProtocolsContext from '../../contexts/ProtocolsContext';
import AccountContext from '../../contexts/AccountContext';
import ContractContext from '../../contexts/ContractContext';

import "../../styles/HomePromoter.css";

const HomePromoter = () => {

  const protocolContext = useContext(ProtocolsContext);
  const contractContext = useContext(ProtocolsContext);
  const currentAccount = useContext(AccountContext);

  const [termAgreement,setTermAgreement] = useState('');
  
  const onAgreementButtonClick = async (event) => {
    event.preventDefault();
    await contractContext.methods.validateProtocol().send({from:currentAccount});
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
              onChange={e => setTermAgreement({termAgreement:e.target.value})}
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
            <input placeholder="Protocol ID" type="text"></input>
          </div>
            </div>
              <div className="btn">
                <div className="field">
                  <button className="ui primary button">
                    Agree On Resume
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
            {protocolContext !== undefined && 
            protocolContext.map((protocol,id) => //(validated, alertOn, date, promoterAddress, descriptionCID, treatmentsListCID) 
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