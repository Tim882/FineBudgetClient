import React, { useState, useEffect} from "react";
import {Link}  from "react-router-dom";
import { connect } from "react-redux";
 
const Nav = ({loggedin, login, logout}) => {

    if (loggedin.loggedin == true) {
        return <div className="topnav">
            <ul>
                <li><Link to="/todo">ToDo</Link></li>
                <li><Link to="/logout">Выйти</Link></li>
            </ul>
        </div>
    }
    else {
        return <div className="topnav">
            <ul>
                <li><Link to="/todo">ToDo</Link></li>
                <li><Link to="/register">Регистрация</Link></li>
                <li><Link to="/login">Вход</Link></li>
            </ul>
        </div>
    }
}

const mapStateToProps = (state) => ({
    loggedin: state.loggedin 
    //  Use 'counter: state.counter.counter' and replace the above line if you are using combineReducers to ensure that 'counter' matches the correct key in your store.
  });
  
  const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch({ type: "LOGIN" }),
    logout: () => dispatch({ type: "LOGOUT" })
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(Nav);