import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const CostsList = (props) => {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const handleRemoveClick = (id,e) => {
        const apiUrl = 'https://localhost:7199/cost/delete?Id=' + id;
        fetch(apiUrl, { method: "DELETE" })
        .then((response, reject)=> {
            return fetchTableData();
        })
    }

    const handleUpdateClick = (cost, e) => {

        console.log('props');
        console.log(cost);

        navigate('/cost/form', { state: { apiUrl:"https://localhost:7199/cost/update", cost: cost } })
    }

    const fetchTableData = (t, d) => {
        const apiUrl = 'https://localhost:7199/cost/all';
        const token = localStorage.getItem("token");
        const defaultOptions = {
            headers: {
                'accept': '*/*',
                'Authorization': 'Bearer ' + token,
            },
          };
        fetch(apiUrl, defaultOptions)
        .then((response) => {
            if (!response.ok) {
                props.handleOpen(response.statusText);
            }

            return response.json()
        })
        .then((costData) => setData(costData))
        .finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        fetchTableData();
    }, [])

    return loading ? (
        <div>Loading...</div>
      ) :  (<div id="costs-list">
        <Link to="/cost/form" className="add-button">Добавить расход</Link><br /><br />
        <table className="table">
            <thead>
                <tr>
                    <th>Категория</th>
                    <th>Сумма</th>
                    <th>Дата</th>
                    <th>Тег</th>
                    <th>Описание</th>
                    <th>Удалить</th>
                    <th>Редактировать</th>
                </tr>
            </thead>
            <tbody>
                {data.map((val) => {
                    return (
                        <tr key={val.id}>
                            <td>{val.costCategory}</td>
                            <td>{val.sum}</td>
                            <td>{val.date}</td>
                            <td>{val.tag}</td>
                            <td>{val.description}</td>
                            <td><button className="delete-btn" onClick={e => handleRemoveClick(val.id,e)}>Delete</button></td>
                            <td><button className="update-btn" onClick={e => handleUpdateClick(val,e)}>Update</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>)
}

export default CostsList;