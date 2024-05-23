import React, {useState, useEffect} from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from 'react-router-dom';

const Tendency = (props) => {
    const navigate = useNavigate();
    const [incomeData, setIncome] = useState([])
    const [costData, setCost] = useState([])
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
        return Object.keys(obj).map((key, index) => ( index++ ));
    }

    const fetchIncomeData = (t, d) => {
        const apiUrl = 'https://localhost:7199/tendency/income';
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
        .then((incomeData) => setIncome(incomeData))
        .finally(() => {
            setLoading(false)
        })
    }

    const fetchCostData = (t, d) => {
        const apiUrl = 'https://localhost:7199/tendency/cost';
        const token = localStorage.getItem("token");
        const defaultOptions = {
            headers: {
                'accept': '*/*',
                'Authorization': 'Bearer ' + token,
            },
        };
        fetch(apiUrl, defaultOptions)
        .then((response) => response.json())
        .then((costData) =>  setCost(costData))
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
        <LineChart
            xAxis={[{ data: convert(costData) }]}
            series={[
                {
                    data: costData,
                },
            ]}
            width={500}
            height={300}
        />
        <h2>Доходы</h2>
        <LineChart
            xAxis={[{ data: convert(incomeData)  }]}
            series={[
                {
                    data: incomeData,
                },
            ]}
            width={500}
            height={300}
        />
    </div>)
}

export default Tendency;