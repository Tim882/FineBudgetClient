import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Modal from "../modal.jsx";

const IncomeDetailsForm = (props) => {
  
  console.log('props');
  console.log(props);

  const location = useLocation();
  var stateData = location.state;

  if (stateData == null) stateData = props

  const navigate = useNavigate();
  const [income, setIncome] = useState({
    id: stateData.income ? stateData.income.id : '',
    incomeCategory: stateData.income ? stateData.income.incomeCategory : '0',
    accountId: stateData.income ? stateData.income.accountId : '',
    sum: stateData.income ? stateData.income.sum : '0',
    date: stateData.income ? stateData.income.incomeDate : '',
    tag: stateData.income ? stateData.income.tag : 'sulik',
    description: stateData.income ? stateData.income.description : 'desc'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const { id, incomeCategory, accountId, sum, date, tag, description} = income;

  const handleOnSubmit = (event) => {

    event.preventDefault();

    const income = {
      id: parseInt(id), IncomeCategory: parseInt(incomeCategory), AccountId: parseInt(accountId), Sum: parseFloat(sum), Date: new Date(), Tag: tag, Description: description
    };

    var requestType = 'POST';

    if (stateData.income.id != '0') requestType = 'PUT';

    const token = localStorage.getItem("token");

    const requestOptions = {
      method: requestType,
      headers: {
        'accept': '*/*',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(income)
    };

    const apiUrl = stateData.apiUrl;

    fetch(apiUrl, requestOptions)
    .then((response, reject)=> {
      if (!response.ok) {
        props.handleOpen(response.statusText);
      }

      navigate('/incomes');
    })
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      // case 'quantity':
      //   if (value === '' || parseInt(value) === +value) {
      //     setincome((prevState) => ({
      //       ...prevState,
      //       [name]: value
      //     }));
      //   }
      //   break;
      case 'Sum':
        if (value === '' || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          setIncome((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
        break;
      default:
        setIncome((prevState) => ({
          ...prevState,
          [name]: value
        }));
    }
  };

  return (
    <div className="main-form" align="center">
      {errorMsg && <p className="errorMsg">{errorMsg}</p>}
      <Form onSubmit={handleOnSubmit}>
        <Form.Group controlId="id">
          <Form.Label>income Name</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="id"
            value={id}
            placeholder="Enter id of income"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="incomeCategory">
          <Form.Label>incomeCategory</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="incomeCategory"
            value={incomeCategory}
            placeholder="Enter name of incomeCategory"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="accountId">
          <Form.Label>accountId</Form.Label>
          <Form.Control
            className="input-control"
            type="number"
            name="accountId"
            value={accountId}
            placeholder="Enter available accountId"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="sum">
          <Form.Label>income sum</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="sum"
            value={sum}
            placeholder="Enter sum of income"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>income Date</Form.Label>
          <Form.Control
            className="input-control"
            type="date"
            name="date"
            value={date}
            placeholder="Enter date of income"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="tag">
          <Form.Label>income tag</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="tag"
            value={tag}
            placeholder="Enter tag of income"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>income Description</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="description"
            value={description}
            placeholder="Enter description of income"
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

export default function IncomeForm(props) {
    return <div>
      <h2>Форма добавления расхода</h2>
      <IncomeDetailsForm apiUrl={props.apiUrl} income={props.income}/>
    </div>
}

IncomeForm.defaultProps = {apiUrl: 'https://localhost:7199/income/create', income: {
  id: '0',
  incomeCategory: '0',
  accountId: '0',
  sum: '0',
  date: '',
  tag: '',
  description: ''
}}