import React from 'react';
import {NavLink} from "react-router-dom";
import "../styles/Navigation.css";

const Navigation = () => {
    return (

        <div className="navigation">
            <NavLink exact to="/"  activeClassName="nav-active">
                Home
            </NavLink> 
            <NavLink exact to="/EditProtocol"   activeClassName="nav-active">
                Edit
            </NavLink>
            <NavLink exact to="/ReadProtocol"  activeClassName="nav-active">
                Read
            </NavLink>
        </div>

              

    );
};



export default Navigation;

