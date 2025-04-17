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
  Collapse,
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Mail as MailIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

const drawerWidth = 240;

// Основные пункты меню
const mainMenuItems = [
  { text: 'Главная', icon: <HomeIcon />, path: '/' },
];

// Пункты меню с вложенными списками
const nestedMenuItems = [
  {
    text: 'Финансы',
    icon: <PeopleIcon />,
    subItems: [
      { text: 'Счета', path: '/accounts' },
      { text: 'Расходы', path: '/costs' },
      { text: 'Доходы', path: '/incomes' },
    ],
  },
  {
    text: 'Баланс',
    icon: <PeopleIcon />,
    subItems: [
      { text: 'Активы', path: '/assets' },
      { text: 'Пассивы', path: '/liabilities' },
    ],
  },
  {
    text: 'Калькуляторы',
    icon: <PeopleIcon />,
    subItems: [
      { text: 'Кредитный калькулятор', path: '/credit-loan' },
      { text: 'Калькулятор вкладов', path: '/calculate-deposit' },
    ],
  },
  {
    text: 'Статистика',
    icon: <PeopleIcon />,
    subItems: [
      { text: 'Отчет о доходах и расходах', path: '/under-construction' },
      { text: 'Таблица личного баланса', path: '/under-construction' },
      { text: 'Список активов и обязательств', path: '/under-construction' },
    ],
  },
];

interface SidebarProps {
  handleDrawerToggle: () => void;
  mobileOpen: boolean;
}

const Sidebar = ({ handleDrawerToggle, mobileOpen }: SidebarProps) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const handleClick = (text: string) => {
    setOpenItems((prev) => ({ ...prev, [text]: !prev[text] }));
  };

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
          <Typography variant="h6">Навигация</Typography>
        </Box>
        <Divider />
        <List>
          {/* Основные пункты меню */}
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Пункты с вложенными списками */}
          {nestedMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItemButton onClick={() => handleClick(item.text)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {openItems[item.text] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton 
                      key={subItem.text} 
                      component={Link} 
                      to={subItem.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      {/* Постоянный Drawer для десктопа */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Навигация</Typography>
        </Box>
        <Divider />
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {nestedMenuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItemButton onClick={() => handleClick(item.text)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {openItems[item.text] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openItems[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItemButton 
                      key={subItem.text} 
                      component={Link} 
                      to={subItem.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;