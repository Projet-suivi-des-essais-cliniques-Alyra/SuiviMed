import React from 'react';
import {NavLink} from "react-router-dom";
import "../styles/Menu.css";

const MenuInvestigator = () => {

    return (
             
        <div className="menu">
            <NavLink exact to="/INVESTIGATOR/"  activeClassName="nav-active">
                Home
            </NavLink>
            <NavLink exact to="/INVESTIGATOR/AddPatient"  activeClassName="nav-active">
                Add Patient
            </NavLink>
            <NavLink exact to="/INVESTIGATOR/CollectData"  activeClassName="nav-active">
                Collect Data
            </NavLink>
            <NavLink exact to="/INVESTIGATOR/ReadDataInvestigator"  activeClassName="nav-active">
                Read Data
            </NavLink>
        </div>
              

    );
};


export default MenuInvestigator;