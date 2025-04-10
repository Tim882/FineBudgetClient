import React, { useState } from 'react';
import { 
  Box, 
  CssBaseline,
  Toolbar, 
  Typography,
  ThemeProvider,
  createTheme,
  PaletteMode,
} from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import AppRoutes from './components/AppRoutes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
//import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
//import DashboardPage from './pages/DashboardPage';
//import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Защищенные маршруты */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
      <Box sx={{ 
            flexGrow: 1,
            p: 3,
            minHeight: '100vh',
            display: 'flex',
      }}>
        <CssBaseline />
        <Header 
          handleDrawerToggle={handleDrawerToggle} 
          toggleTheme={toggleTheme} 
          themeMode={themeMode} 
        />
        
        <Sidebar 
          handleDrawerToggle={handleDrawerToggle} 
          mobileOpen={mobileOpen} 
        />
        <Box
          component="main"
          sx={{ 
            flexGrow: 1,
            p: 3,
            width: '100vh',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Toolbar />
          <Box sx={{ 
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <AppRoutes />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;