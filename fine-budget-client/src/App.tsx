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

const drawerWidth = 240;

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
      <Box sx={{ display: 'flex' }}>
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
            width: { sm: `calc(100% - ${drawerWidth}px)` } 
          }}
        >
          <Toolbar />
          <Typography paragraph>
            Main content goes here...
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;