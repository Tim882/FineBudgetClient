import ReactDOM from "react-dom/client";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Nav from "./components/nav.jsx";
import Home from "./components/home.jsx";
import NotFound from "./components/notfound.jsx";
import Header from "./components/header.jsx";
import CostsList from "./components/cost/list.jsx";
import CostForm from "./components/cost/form.jsx";
import IncomesList from "./components/income/list.jsx";
import IncomeForm from "./components/income/form.jsx";
import AccountsList from "./components/account/list.jsx";
import CashForm from "./components/account/form.jsx"
import ToDo from "./components/todo.jsx";
import ProtectedRoute from "./components/auth/protectedroute.jsx";
import Login from "./components/auth/login.jsx";
import LeftNav from "./components/leftnav.jsx";
import Category from "./components/charts/category.jsx";
import Tendency from "./components/charts/tendency.jsx";
import UserForm from "./components/auth/register.jsx";
import Modal from "./components/modal.jsx";
import Footer from "./components/footer.jsx";
import Logout from "./components/auth/logout.jsx";
import store from './store';
import { Provider } from 'react-redux'

const App = () => {

    const [user, setUser] = useState(null)

    const [errorText, setErrorText] = useState('')
    const [open, setOpen] = React.useState(false);
 
    const handleClose = () => {
        setOpen(false);
    };
 
    const handleOpen = (errText) => {
        setErrorText(errText);
        setOpen(true);
    };

    var token = localStorage.getItem("token");

    return (
        <Router>
            {/* <Header /> */}
                <Nav />
                <LeftNav />
                <Modal isOpen={open} onClose={handleClose}>
                    <>
                        <h3>Ошибка!</h3>
                        <p>Не удалось получить данные: "{errorText}"</p>
                    </>
                </Modal>
                <main>
                    <Routes>
                        <Route
                            path='/tendency'
                            element={
                                <Tendency handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                // <ProtectedRoute isAllowed={!!user && user.roles.includes("admin")} redirectTo='/login'>
                                //     <ToDo />
                                // </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/category'
                            element={
                                <Category handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                // <ProtectedRoute isAllowed={!!user && user.roles.includes("admin")} redirectTo='/login'>
                                //     <ToDo />
                                // </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/todo'
                            element={
                                <ToDo />
                                // <ProtectedRoute isAllowed={!!user && user.roles.includes("admin")} redirectTo='/login'>
                                //     <ToDo />
                                // </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/accounts'
                            element={
                                <ProtectedRoute isAllowed={!!token} redirectTo='/login'>
                                    <AccountsList handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/account/form'
                            element={
                                <ProtectedRoute isAllowed={!!token} redirectTo='/login'>
                                    <CashForm handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                </ProtectedRoute>
                            }
                        />
                        
                        <Route
                            path='/incomes'
                            element={
                                <ProtectedRoute isAllowed={!!token} redirectTo='/login'>
                                    <IncomesList handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/income/form'
                            element={
                                <ProtectedRoute isAllowed={!!token} redirectTo='/login'>
                                    <IncomeForm handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/costs'
                            element={
                                <ProtectedRoute isAllowed={!!token} redirectTo='/login'>
                                    <CostsList handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/cost/form'
                            element={
                                <ProtectedRoute isAllowed={!!token} redirectTo='/login'>
                                    <CostForm handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/register" element={<UserForm handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />} />
                        <Route path="/login" element={<Login handleOpen = {(value) => {
                                    handleOpen(value);
                                }} />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
        </Router>
    );
}

ReactDOM.createRoot(
    document.getElementById("app")).render(
    <Provider store={store}>
        <App />
    </Provider>
)