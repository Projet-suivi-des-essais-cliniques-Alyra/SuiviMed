import React,{useContext} from 'react';
import {NavLink} from "react-router-dom";
import "../styles/Menu.css";

const MenuPromoter = () => {

    return (
             
        <div className="menu">
            <NavLink exact to="/PROMOTER/"  activeClassName="nav-active">
                Home
            </NavLink>
            <NavLink exact to="/PROMOTER/ProtocolPage"  activeClassName="nav-active">
                Protocol
            </NavLink>
            <NavLink exact to="/PROMOTER/ProjectPage"  activeClassName="nav-active">
                Project
            </NavLink>
            <NavLink exact to="/PROMOTER/ReadDataPromoter"  activeClassName="nav-active">
                Read Data
            </NavLink>
            <NavLink exact to="/PROMOTER/PeoplePagePromoter"  activeClassName="nav-active">
                Add People
            </NavLink>
        </div>
              

    );
};


export default MenuPromoter;