import React,{useState,useContext} from 'react';
import MenuInvestigator from '../../components/MenuInvestigator';
import Header from '../../components/Header';
import ProtocolsContext from '../../contexts/ProtocolsContext';
import AccountContext from '../../contexts/AccountContext';


const ReadDataInvestigator = (props) => {

  //Contexts and Hooks
  const protocolContext = useContext(ProtocolsContext);
  const currentAccount = useContext(AccountContext);

  return (
    <div>
      <Header />
    <div className="home">
     <MenuInvestigator />
    </div>

    </div>
  );
};

export default ReadDataInvestigator;