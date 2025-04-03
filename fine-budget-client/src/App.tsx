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
import AppRoutes from './AppRoutes';
import ProductsPage from './ProductsPage';

const drawerWidth = 0;

const App = () => {
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
      <Box sx={{ 
            flexGrow: 1,
            p: 3,
            width: '100vh',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
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
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <AppRoutes />
            <ProductsPage />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;