import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";

const Login = ({loggedin, login, logout}) => {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const { username , password } = userInfo;

  const handleOnSubmit = (event) => {

    event.preventDefault();

    const userInfo = {
      username: username, password: password
    };

    const apiUrl = 'https://localhost:7199/authorization/token?email=' + username + '&password=' + password + '&rememberme=false&returnurl=url';

    const requestOptions = {
      method: "POST",
      redirect: "follow"
    };
    
    fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
          props.handleOpen(response.statusText);
      }

      return response.json()
    })
    .then((data) => {

      console.log(data);

      const token = data.authorizationToken;

      console.log(token);

      localStorage.setItem("token", token);

      console.log(loggedin)
      login()
      console.log(loggedin.loggedin)
    })
    .catch((err) => console.log(err));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'Sum':
        if (value === '' || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          setUserInfo((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
        break;
      default:
        setUserInfo((prevState) => ({
          ...prevState,
          [name]: value
        }));
    } 
  };

    return (
      <div align="center">
        <h3>Чтобы продолжить, необходимо войти в личный кабинет</h3>
        <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Имя пользователя</Form.Label><br />
          <Form.Control
            className="input-control"
            type="text"
            name="username"
            value={username}
            placeholder="Имя пользователя"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Пароль</Form.Label><br />
          <Form.Control
            className="input-control"
            type="password"
            name="password"
            value={password}
            placeholder="Пароль"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Войти
        </Button>
      </Form>
      </div>
    );
  }

  const mapStateToProps = (state) => ({
    loggedin: state.loggedin 
    //  Use 'counter: state.counter.counter' and replace the above line if you are using combineReducers to ensure that 'counter' matches the correct key in your store.
  });
  
  const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch({ type: "LOGIN" }),
    logout: () => dispatch({ type: "LOGOUT" })
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(Login);