import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const AccountsList = (props) => {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const handleRemoveClick = (id,e) => {
        const apiUrl = 'https://localhost:7199/account/delete?Id=' + id;
        fetch(apiUrl, { method: "DELETE" })
        .then((response, reject)=> {
            return fetchTableData();
        })
    }

    const handleUpdateClick = (account, e) => {

        console.log('props');
        console.log(account);

        navigate('/account/form', { state: { apiUrl:"https://localhost:7199/account/update", account: account } })
    }

    const fetchTableData = (t, d) => {
        const apiUrl = 'https://localhost:7199/account/all';
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
        .then((accountData) => setData(accountData))
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
      ) :  (<div id="accounts-list">
        <Link to="/account/form" className="add-button">Добавить счет</Link><br /><br />
        <table className="table">
            <thead>
                <tr>
                    <th>Категория</th>
                    <th>Баланс</th>
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
                            <td>{val.accountCategory}</td>
                            <td>{val.sum}</td>
                            <td>{val.date}</td>
                            <td>{val.tag}</td>
                            <td>{val.description}</td>
                            <td><button  className="delete-btn" onClick={e => handleRemoveClick(val.id,e)}>Delete</button></td>
                            <td><button className="update-btn" onClick={e => handleUpdateClick(val,e)}>Update</button></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>)
}

export default AccountsList;