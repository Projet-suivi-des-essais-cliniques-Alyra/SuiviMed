import React,{useState,useContext} from 'react';
import MenuPromoter from "../../components/MenuPromoter";
import Header from '../../components/Header';
import AccountContext from '../../contexts/AccountContext';
import RoleContext from '../../contexts/RoleContext';

import "../../styles/PeoplePage.css";

const PeoplePagePromoter = (props) => {

    const currentAccount = useContext(AccountContext);
    const role = useContext(RoleContext);

    const [newPromoterAddress,setNewPromoterAddress] = useState('');
    const [newInvestigatorAddress,setNewInvestigatorAddress] = useState('');
    const [projectID,setProjectID] = useState('');


    const onNewPromoterButtonClick = async (event) => {
        event.preventDefault();
        console.log(newPromoterAddress)
        await props.contract.methods.addPromoter(newPromoterAddress).send({from:currentAccount});
        }

    const onNewInvestigatorButtonClick = async (event) => {
        event.preventDefault();
        console.log(newInvestigatorAddress,projectID)
        await props.contract.methods.addInvestigator(newInvestigatorAddress,projectID).send({from:currentAccount});
        }
    

    return (
        <div>
            <Header />
        <div className="ReadDocuments">
            <MenuPromoter />
        </div>

        <div className="ui form">
        <div className ="fields">
        <div className="form-btn-address">
          <div className="field">
            <input
              type="text"
              value={newInvestigatorAddress}
              onChange={e => setNewInvestigatorAddress(e.target.value)}
              placeholder="New Investigator Address">
            </input>
          </div>
            </div>
        <div className="form-btn">
          <div className="field">
            <input
              type="text"
              value={projectID}
              onChange={e => setProjectID(e.target.value)}
              placeholder="Project ID">
            </input>
          </div>
            </div>
              <div className="btn">
                <div className="field">
                  <button onClick={e => onNewInvestigatorButtonClick(e)} className="ui primary button">
                    Add New Investigator 
                  </button>
                </div>  
              </div>
            </div>
          </div>


        {role==="PROMOTERADMIN" && (
        <div className="ui form">
        <div className ="two fields">
            <div className="form-btn-address">
            <div className="field">
                <input
                type="text"
                value={newPromoterAddress}
                onChange={e => setNewPromoterAddress(e.target.value)}
                placeholder="New Promoter Address">
                </input>
            </div>
            </div>
            <div className="btn">
                <div className="field">
                <button onClick={e => onNewPromoterButtonClick(e)} className="ui primary button">
                    Add New Promoter
                </button>
                </div>  
            </div>
            </div>
        </div>)}

        </div>
    );
};

export default PeoplePagePromoter;