import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

const AccountDetailsForm = (props) => {
  const location = useLocation();
  var stateData = location.state;

  if (stateData == null) stateData = props;

  const navigate = useNavigate();
  const [account, setAccount] = useState({
    id: stateData.account ? stateData.account.id : '',
    type: stateData.account ? stateData.account.type : '0',
    sum: stateData.account ? stateData.account.sum : '0',
    creationDate: stateData.account ? stateData.account.creationDate : '',
    tag: stateData.account ? stateData.account.tag : 'sulik',
    description: stateData.account ? stateData.account.description : 'desc'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const { id, type, sum, creationDate, tag, description} = account;

  const handleOnSubmit = (event) => {

    event.preventDefault();

    const account = {
      id: parseInt(id), type: parseInt(type), Sum: parseFloat(sum), creationDate: new Date(), Tag: tag, Description: description
    };

    console.log('handle submit');
    console.log(account);

    var requestType = 'POST';

    if (stateData.account.id != '0') requestType = 'PUT';

    const token = localStorage.getItem("token");
    const requestOptions = {
      method: requestType,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(account)
    };

    const apiUrl = stateData.apiUrl;

    fetch(apiUrl, requestOptions)
    .then((response, reject)=> {
      if (!response.ok) {
        props.handleOpen(response.statusText);
      }

      navigate('/accounts');
    })
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'Sum':
        if (value === '' || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          setAccount((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
        break;
      default:
        setAccount((prevState) => ({
          ...prevState,
          [name]: value
        }));
    }
  };

  return (
    <div align="center" class="text-field ">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="id">
          <Form.Label>Account name</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="id"
            value={id}
            placeholder="Enter id of account"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="type">
          <Form.Label>Тип</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="type"
            value={type}
            placeholder="Enter name of type"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="sum">
          <Form.Label>account balance</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="sum"
            value={sum}
            placeholder="Enter sum of cost"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="creationDate">
          <Form.Label>Account creation date</Form.Label>
          <Form.Control
            className="input-control"
            type="date"
            name="creationDate"
            value={creationDate}
            placeholder="Enter date of cost"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="tag">
          <Form.Label>account tag</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="tag"
            value={tag}
            placeholder="Enter tag of account"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Account description</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="description"
            value={description}
            placeholder="Enter description of account"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="add-button">
          Сохранить
        </Button>
      </Form>
    </div>
  );
};

export default function AccountForm(props) {
    return <div>
      <h2>Форма добавления счета</h2>
      <AccountDetailsForm apiUrl={props.apiUrl} account={props.account}/>
    </div>
}

AccountForm.defaultProps = {apiUrl: 'https://localhost:7199/account/create', account: {
  id: '0',
  type: '0',
  sum: '0',
  creationDate: '',
  tag: '',
  description: ''
}}