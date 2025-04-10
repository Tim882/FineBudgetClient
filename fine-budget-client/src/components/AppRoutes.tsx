import { Route, Routes } from 'react-router-dom';
import AccountsPage from '../CrudComponents/Account/AccountsPage';
import CostsPage from '../CrudComponents/Cost/CostsPage';
import IncomesPage from '../CrudComponents/Income/IncomesPage';
import AssetsPage from '../CrudComponents/Asset/AssetsPage';
import LiabilitiesPage from '../CrudComponents/Liability/LiabilitiesPage';
import { AuthProvider } from '../contexts/AuthContext';
import HomePage from './HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const AppRoutes = () => {
  return (
    <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/costs" element={<CostsPage />} />
            <Route path="/incomes" element={<IncomesPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/liabilities" element={<LiabilitiesPage />} />
     
            {/* element={<ProtectedRoute />} */}
          </Routes>
       </AuthProvider>
  );
};

export default AppRoutes;