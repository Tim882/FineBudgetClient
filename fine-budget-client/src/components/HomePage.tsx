import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CssBaseline
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <EqualizerIcon fontSize="large" color="primary" />,
      title: "Отслеживание расходов",
      description: "Фиксируйте все траты по категориям"
    },
    {
      icon: <AttachMoneyIcon fontSize="large" color="primary" />,
      title: "Учет доходов",
      description: "Записывайте все источники дохода"
    },
    {
      icon: <FamilyRestroomIcon fontSize="large" color="primary" />,
      title: "Совместный доступ",
      description: "Работайте над бюджетом всей семьей"
    }
  ];

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          mt: 8,
          mb: 4
        }}
      >
        <HomeIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Добро пожаловать в Fine Budget
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Удобное управление семейным бюджетом
        </Typography>

        <Box sx={{ my: 4 }}>
          {user ? (
            <Button
              component={Link}
              to="/dashboard"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 2 }}
            >
              Перейти в кабинет
            </Button>
          ) : (
            <Box sx={{ '& > *': { mx: 1 } }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 2 }}
              >
                Войти
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 2 }}
              >
                Зарегистрироваться
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 4,
          mt: 4,
          width: '100%'
        }}>
          {features.map((feature, index) => (
            <Box key={index}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" gutterBottom>{feature.title}</Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;