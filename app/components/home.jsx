import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
 
export default function Home(){
    return <div className="content">
        <h2>Главная</h2>
        <p>Добро пожаловать в веб-приложение FineBudget! С его помощью вы сможете вести учет ваших доходов и расходов, получать статистику 
            и планировать бюджет.</p>
        <BarChart
            series={[
                { data: [35, 44, 24, 34] },
                { data: [51, 6, 49, 30] },
                { data: [15, 25, 30, 50] },
                { data: [60, 50, 15, 25] },
            ]}
            height={290}
            xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
        <PieChart
            series={[
                {
                data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                ],
                },
            ]}
            width={400}
            height={200}
        />
        <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
                {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
            ]}
            width={500}
            height={300}
        />
    </div>;
}