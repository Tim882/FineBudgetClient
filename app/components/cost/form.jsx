import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const CostDetailsForm = (props) => {
  const location = useLocation();
  var stateData = location.state;

  if (stateData == null) stateData = props;

  const navigate = useNavigate();
  const [cost, setCost] = useState({
    id: stateData.cost ? stateData.cost.id : '',
    costCategory: stateData.cost ? stateData.cost.costCategory : '0',
    accountId: stateData.cost ? stateData.cost.accountId : '',
    sum: stateData.cost ? stateData.cost.sum : '0',
    date: stateData.cost ? stateData.cost.costDate : '',
    tag: stateData.cost ? stateData.cost.tag : 'sulik',
    description: stateData.cost ? stateData.cost.description : 'desc'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const { id, costCategory, accountId, sum, date, tag, description} = cost;

  const handleOnSubmit = (event) => {

    event.preventDefault();

    const cost = {
      id: parseInt(id), CostCategory: parseInt(costCategory), AccountId: parseInt(accountId), Sum: parseFloat(sum), Date: new Date(), Tag: tag, Description: description
    };

    console.log('handle submin');
    console.log(cost);

    var requestType = 'POST';

    if (stateData.cost.id != '0') requestType = 'PUT';

    const token = localStorage.getItem("token");
        const defaultOptions = {
            headers: {
                'accept': '*/*',
                'Authorization': 'Bearer ' + token,
            },
        };

    const requestOptions = {
      method: requestType,
      headers: {
        'accept': '*/*',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(cost)
    };

    const apiUrl = stateData.apiUrl;

    fetch(apiUrl, requestOptions)
    .then((response, reject)=> {
      if (!response.ok) {
        props.handleOpen(response.statusText);
      }

      navigate('/costs');
    })
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      // case 'quantity':
      //   if (value === '' || parseInt(value) === +value) {
      //     setCost((prevState) => ({
      //       ...prevState,
      //       [name]: value
      //     }));
      //   }
      //   break;
      case 'Sum':
        if (value === '' || value.match(/^\d{1,}(\.\d{0,2})?$/)) {
          setCost((prevState) => ({
            ...prevState,
            [name]: value
          }));
        }
        break;
      default:
        setCost((prevState) => ({
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
          <Form.Label>cost Name</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="id"
            value={id}
            placeholder="Enter id of cost"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="costCategory">
          <Form.Label>CostCategory</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="costCategory"
            value={costCategory}
            placeholder="Enter name of costCategory"
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
          <Form.Label>cost sum</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="sum"
            value={sum}
            placeholder="Enter sum of cost"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>cost Date</Form.Label>
          <Form.Control
            className="input-control"
            type="date"
            name="date"
            value={date}
            placeholder="Enter date of cost"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="tag">
          <Form.Label>cost tag</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="tag"
            value={tag}
            placeholder="Enter tag of cost"
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>cost Description</Form.Label>
          <Form.Control
            className="input-control"
            type="text"
            name="description"
            value={description}
            placeholder="Enter description of cost"
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

export default function CostForm(props) {
    return <div>
      <h2>Форма добавления расхода</h2>
      <CostDetailsForm apiUrl={props.apiUrl} cost={props.cost}/>
    </div>
}

CostForm.defaultProps = {apiUrl: 'https://localhost:7199/cost/create', cost: {
  id: '0',
  costCategory: '0',
  accountId: '0',
  sum: '0',
  date: '',
  tag: '',
  description: ''
}}