import React, { useContext } from 'react';
import {NavLink} from "react-router-dom";
import "../styles/Menu.css";

const MenuPromoter = () => {

    return (
             
        <div className="menu">
            <NavLink exact to="/PROMOTER/"  activeClassName="nav-active">
                Home
            </NavLink>
            <NavLink exact to="/PROMOTER/ProtocolPage"  activeClassName="nav-active">
                Edit
            </NavLink>
            <NavLink exact to="/PROMOTER/ReadDataPromoter"  activeClassName="nav-active">
                Read
            </NavLink>
        </div>
              

    );
};


export default MenuPromoter;