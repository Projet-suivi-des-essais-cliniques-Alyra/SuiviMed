import React, { useContext } from 'react';
import {NavLink} from "react-router-dom";
import "../styles/Menu.css";

const MenuAuthority = () => {

    return (
             
        <div className="menu">
            <NavLink exact to="/AUTHORITY/"  activeClassName="nav-active">
                Home
            </NavLink>
            <NavLink exact to="/AUTHORITY/ReadDataAuthority"  activeClassName="nav-active">
                Read Data
            </NavLink>
        </div>
              

    );
};


export default MenuAuthority;