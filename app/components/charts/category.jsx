import React, {useState, useEffect} from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';

const Category = (props) => {
    const navigate = useNavigate();
    const [incomeData, setIncome] = useState([])
    const [costData, setCost] = useState([{}])
    const [loading, setLoading] = useState(false)

    const handleRemoveClick = (id,e) => {
        const apiUrl = 'https://localhost:7199/cash/delete?Id=' + id;
        fetch(apiUrl, { method: "DELETE" })
        .then((response, reject)=> {
            return fetchTableData();
        })
    }

    const handleUpdateClick = (cash, e) => {

        console.log('props');
        console.log(cash);

        navigate('/cash/form', { state: { apiUrl:"https://localhost:7199/cash/update", cash: cash } })
    }

    function convert(obj) {
        var index = 0;

        return Object.keys(obj).map((key, index) => ({
            label: key,
            value: obj[key],
            id: index++
        }));
    }

    const fetchIncomeData = (t, d) => {
        const apiUrl = 'https://localhost:7199/category/income';
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
        .then((incomeData) => setIncome(convert(incomeData)))
        .finally(() => {
            setLoading(false)
        })
    }

    const fetchCostData = (t, d) => {
        const apiUrl = 'https://localhost:7199/category/cost';
        const token = localStorage.getItem("token");
        const defaultOptions = {
            headers: {
                'accept': '*/*',
                'Authorization': 'Bearer ' + token,
            },
        };
        fetch(apiUrl, defaultOptions)
        .then((response) => response.json())
        .then((costData) =>  setCost(convert(costData)))
        .finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        fetchIncomeData();
        fetchCostData();
    }, [])

    return loading ? (
        <div>Loading...</div>
      ) :  (<div id="">
        <h2>Расходы</h2>
        <PieChart
            series={[
                {
                    data: costData,
                },
            ]}
            width={1200}
            height={400}
        />
        <h2>Доходы</h2>
        <PieChart
            series={[
                {
                data: incomeData,
                },
            ]}
            width={1200}
            height={400}
        />
    </div>)
}

export default Category;