import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const UserDetailsForm = (props) => {
  const location = useLocation();
  var stateData = location.state;

  if (stateData == null) stateData = props;

  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: stateData.user ? stateData.user.username : '',
    year: stateData.user ? stateData.user.year : '1980',
    password: stateData.user ? stateData.user.password : '',
    repeatPassword: stateData.user ? stateData.user.repeatPassword : ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const { username, year, password, repeatPassword } = user;

  const handleOnSubmit = (event) => {

    event.preventDefault();

    const userInfo = {
      username: username, password: password
    };

    const apiUrl = 'https://localhost:7199/Auth/Register?email=' + username  + '&yeat=' + year + '&password=' + password + '&passwordconfirm=' + repeatPassword;

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

      // const token = data.authorizationToken;

      // console.log(token);

      // localStorage.setItem("token", token);

      navigate("/login");
    })
    .catch((err) => console.log(err));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'year':
        if (value === '' || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          setUser((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
        break;
      default:
        setUser((prevState) => ({
          ...prevState,
          [name]: value
        }));
    }
  };

  return (
    <div>
      <h3>Регистрация</h3>
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="username"
            value={username}
            placeholder="Enter email"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="year">
          <Form.Label>Год рождения</Form.Label>
          <Form.Control
            className="input-control"
            type="number"
            name="year"
            value={year}
            placeholder="Enter year"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="password"
            value={password}
            placeholder="Enter password"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="repeatPassword">
          <Form.Label>Повоторный ввод пароля</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="repeatPassword"
            value={repeatPassword}
            placeholder="Enter password again"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="submit-btn">
          Сохранить
        </Button>
      </Form>
    </div>
  );
};

export default function UserForm(props) {
    return <div align="center">
      <UserDetailsForm apiUrl={props.apiUrl} user={props.user}/>
    </div>
}

UserForm.defaultProps = {apiUrl: 'https://localhost:7199/user/create', user: {
  username: '',
  year: '1980',
  password: '',
  repeatPassword: ''
}}