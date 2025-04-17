import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Slider,
  InputAdornment,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  CircularProgress,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import { Calculate as CalculateIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

interface DepositResult {
  totalAmount: number;
  totalInterest: number;
  schedule?: Array<{
    period: number;
    amount: number;
    interest: number;
    accrued: number;
  }>;
}

const DepositCalculator = () => {
  const theme = useTheme();
  const [initialAmount, setInitialAmount] = useState<number>(100000);
  const [term, setTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [capitalization, setCapitalization] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [results, setResults] = useState<DepositResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDeposit = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/calculate-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initialAmount,
          term,
          interestRate,
          capitalization,
          frequency
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Calculation error:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при расчете');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) setInitialAmount(value);
  };

  const handleTermChange = (_: Event, value: number | number[]) => {
    setTerm(value as number);
  };

  const handleRateChange = (_: Event, value: number | number[]) => {
    setInterestRate(value as number);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      p: 3,
      backgroundColor: theme.palette.background.default
    }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ 
        fontWeight: 700,
        mb: 3
      }}>
        Калькулятор вкладов
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ flex: 1 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            height: '100%',
            p: 3,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" gutterBottom>
              Параметры вклада
            </Typography>

            <Box component="form" sx={{ 
              mt: 2,
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Grid container spacing={3} sx={{ flex: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Сумма вклада"
                    value={initialAmount}
                    onChange={handleAmountChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon />
                        </InputAdornment>
                      ),
                      inputProps: { min: 1000, step: 1000 }
                    }}
                    type="number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel>Срок вклада: {term} месяцев</InputLabel>
                  <Slider
                    value={term}
                    onChange={handleTermChange}
                    min={1}
                    max={60}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 1, label: '1' },
                      { value: 12, label: '12' },
                      { value: 24, label: '24' },
                      { value: 36, label: '36' },
                      { value: 48, label: '48' },
                      { value: 60, label: '60' },
                    ]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel>Процентная ставка: {interestRate}%</InputLabel>
                  <Slider
                    value={interestRate}
                    onChange={handleRateChange}
                    min={0.1}
                    max={15}
                    step={0.1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 1, label: '1%' },
                      { value: 5, label: '5%' },
                      { value: 10, label: '10%' },
                      { value: 15, label: '15%' },
                    ]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={capitalization}
                        onChange={(e) => setCapitalization(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Капитализация процентов"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Периодичность начисления</InputLabel>
                    <Select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as 'monthly' | 'quarterly' | 'annually')}
                      label="Периодичность начисления"
                    >
                      <MenuItem value="monthly">Ежемесячно</MenuItem>
                      <MenuItem value="quarterly">Ежеквартально</MenuItem>
                      <MenuItem value="annually">Ежегодно</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                    onClick={calculateDeposit}
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Рассчитываем...' : 'Рассчитать'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            height: '100%',
            p: 3,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {results ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Результаты расчета
                </Typography>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="body1">Итоговая сумма:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {results.totalAmount.toFixed(2)} ₽
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1">Начисленные проценты:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {results.totalInterest.toFixed(2)} ₽
                      </Typography>
                    </Grid>
                  </Grid>

                  {results.schedule && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        График начислений:
                      </Typography>
                      <TableContainer sx={{ flex: 1 }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Период</TableCell>
                              <TableCell align="right">Сумма</TableCell>
                              <TableCell align="right">Начислено</TableCell>
                              <TableCell align="right">Итого</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {results.schedule.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.period}</TableCell>
                                <TableCell align="right">{initialAmount.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.interest.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.accrued.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: theme.palette.text.secondary
              }}>
                <Typography variant="h6">
                  Введите параметры вклада и нажмите "Рассчитать"
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DepositCalculator;