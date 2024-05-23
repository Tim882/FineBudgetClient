import React from "react";
import {Link}  from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
 
export default function LeftNav(){
    return <div className="leftnav">
        <aside>
            <h1>FineBudget</h1>
            <Sidebar>
            <Menu>
                <MenuItem component={<Link to="/" />}>Главная</MenuItem>
                <SubMenu label="Счета">
                    <MenuItem component={<Link to="/accounts" />}>Счета</MenuItem>
                    {/* <MenuItem component={<Link to="/cards" />}>Карты</MenuItem>
                    <MenuItem component={<Link to="/deposits" />}>Депозиты</MenuItem>
                    <MenuItem component={<Link to="/investments" />}>Инвестиции</MenuItem>
                    <MenuItem component={<Link to="/credits" />}>Кредиты</MenuItem> */}
                </SubMenu>
                <SubMenu label="Операции">
                    <MenuItem component={<Link to="/incomes" />}>Доходы</MenuItem>
                    <MenuItem component={<Link to="/costs" />}>Расходы</MenuItem>
                </SubMenu>
                <SubMenu label="Графики">
                    <MenuItem  component={<Link to="/tendency" />}>Тендеция</MenuItem>
                    <MenuItem  component={<Link to="/category" />}>Категории</MenuItem>
                    {/* <MenuItem  component={<Link to="/" />}>Баланс</MenuItem>
                    <MenuItem  component={<Link to="/" />}></MenuItem>
                    <MenuItem  component={<Link to="/" />}></MenuItem> */}
                </SubMenu>
                {/* <MenuItem component={<Link to="/" />}>Статистика</MenuItem>
                <MenuItem component={<Link to="/" />}>Калькуляторы</MenuItem>
                <MenuItem component={<Link to="/" />}>Конвертер валют</MenuItem>
                <MenuItem component={<Link to="/" />}>Финансовые цели</MenuItem>
                <MenuItem component={<Link to="/" />}>Настройки</MenuItem> */}
            </Menu>
        </Sidebar>
        </aside>
    </div>
}