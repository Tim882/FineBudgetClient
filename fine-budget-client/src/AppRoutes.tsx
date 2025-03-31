import { Route, Routes } from 'react-router-dom';
import AccountTable from './CrudComponents/Account/AccountData';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/accounts" element={<AccountTable />} />
    </Routes>
  );
};

export default AppRoutes;