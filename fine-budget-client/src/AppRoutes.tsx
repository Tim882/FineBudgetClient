import { Route, Routes } from 'react-router-dom';
import AccountsPage from './CrudComponents/Account/AccountsPage';
import CostsPage from './CrudComponents/Cost/CostsPage';
import IncomesPage from './CrudComponents/Income/IncomesPage';
import AssetsPage from './CrudComponents/Asset/AssetsPage';
import LiabilitiesPage from './CrudComponents/Liability/LiabilitiesPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/accounts" element={<AccountsPage />} />
      <Route path="/costs" element={<CostsPage />} />
      <Route path="/incomes" element={<IncomesPage />} />
      <Route path="/assets" element={<AssetsPage />} />
      <Route path="/liabilities" element={<LiabilitiesPage />} />
    </Routes>
  );
};

export default AppRoutes;