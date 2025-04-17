import React from 'react';
import { 
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotImplementedPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <ConstructionIcon 
          sx={{ 
            fontSize: 80, 
            color: theme.palette.warning.main 
          }} 
        />
        
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          component="h1"
          color="textPrimary"
          gutterBottom
        >
          Страница в разработке 🚧
        </Typography>

        <Typography 
          variant="body1" 
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          Этот раздел еще не готов, но мы активно над ним работаем!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(-1)} // Возврат на предыдущую страницу
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
          }}
        >
          Вернуться назад
        </Button>
      </Paper>
    </Container>
  );
};

export default NotImplementedPage;