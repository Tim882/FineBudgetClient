import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box,
  Typography,
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Mail as MailIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Accounts', icon: <PeopleIcon />, path: '/accounts' }
];

interface SidebarProps {
    handleDrawerToggle: () => void;
    mobileOpen: boolean;
  }

  const Sidebar = ({ handleDrawerToggle, mobileOpen }: SidebarProps) => {
    return (
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Navigation</Typography>
          </Box>
          <Divider />
          <List>
            {['Home', 'Users', 'Messages'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index === 0 ? <HomeIcon /> : index === 1 ? <PeopleIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Navigation</Typography>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
    );
  };

  export default Sidebar;