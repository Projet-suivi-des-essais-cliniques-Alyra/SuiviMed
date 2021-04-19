import React, { useContext } from 'react';
import {NavLink} from "react-router-dom";
import "../styles/Menu.css";
import RoleContext from '../contexts/RoleContext';

const Navigation = () => {
    const context = useContext(RoleContext)
    return (
             
        <div className="navigation">
            <NavLink exact to={`/${context}/`}  activeClassName="nav-active" className="home">
                Home
            </NavLink>
            <NavLink exact to={`/${context}/EditProtocol`}   activeClassName="nav-active">
                Edit
            </NavLink>
            <NavLink exact to={`/${context}/ReadDocuments`}  activeClassName="nav-active">
                Read
            </NavLink>
        </div>
              

    );
};


export default Navigation;