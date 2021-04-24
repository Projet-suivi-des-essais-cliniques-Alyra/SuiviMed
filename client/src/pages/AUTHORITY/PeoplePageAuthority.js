import React,{useContext,useState} from 'react';
import MenuAuthority from "../../components/MenuAuthority";
import Header from '../../components/Header';
import AccountContext from '../../contexts/AccountContext';
import RoleContext from '../../contexts/RoleContext';

import "../../styles/PeoplePage.css";

const PeoplePageAuthority = (props) => {

  const currentAccount = useContext(AccountContext);
  const role = useContext(RoleContext);

  const [newAuthorityAddress,setNewAuthorityAddress] = useState('');

  const onNewAuthorityButtonClick = async (event) => {
    event.preventDefault();
    console.log(newAuthorityAddress)
    await props.contract.methods.addAuthority(newAuthorityAddress).send({from:currentAccount});
    }

  return (
    <div>
    <Header />
    <div className="ReadDocuments">
     <MenuAuthority />
    </div>

    {role==="AUTHORITY" && (
      <div>YOU ARE NOT ALLOWED TO ADD OTHERS PEOPLE</div>)}

    {role==="AUTHORITYADMIN" && (
        <div className="ui form">
        <div className ="two fields">
            <div className="form-btn-address">
            <div className="field">
                <input
                type="text"
                value={newAuthorityAddress}
                onChange={e => setNewAuthorityAddress(e.target.value)}
                placeholder="New Authority Address">
                </input>
            </div>
            </div>
            <div className="btn">
                <div className="field">
                <button onClick={e => onNewAuthorityButtonClick(e)} className="ui primary button">
                    Add New Authority
                </button>
                </div>  
            </div>
            </div>
        </div>)}


    </div>
  );
};

export default PeoplePageAuthority;