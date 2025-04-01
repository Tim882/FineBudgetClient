import { Route, Routes } from 'react-router-dom';
import AccountTable from './CrudComponents/Account/AccountData';
import CostTable from './CrudComponents/Cost/CostData';
import IncomeTable from './CrudComponents/Income/IncomeData';
import AssetTable from './CrudComponents/Asset/AssetData';
import LiabilityTable from './CrudComponents/Liability/LiabilityData';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/accounts" element={<AccountTable />} />
      <Route path="/costs" element={<CostTable />} />
      <Route path="/insomes" element={<IncomeTable />} />
      <Route path="/assets" element={<AssetTable />} />
      <Route path="/liabilities" element={<LiabilityTable />} />
    </Routes>
  );
};

export default AppRoutes;