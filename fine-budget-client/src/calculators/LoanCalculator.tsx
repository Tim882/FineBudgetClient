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
} from '@mui/material';
import { Calculate as CalculateIcon, AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  schedule?: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

const LoanCalculator = () => {
  const theme = useTheme();
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [paymentType, setPaymentType] = useState<'annuity' | 'differentiated'>('annuity');
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateLoan = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/calculate-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount,
          loanTerm,
          interestRate,
          paymentType,
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
    if (!isNaN(value)) setLoanAmount(value);
  };

  const handleTermChange = (_: Event, value: number | number[]) => {
    setLoanTerm(value as number);
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
        Кредитный калькулятор
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
              Параметры кредита
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
                    label="Сумма кредита"
                    value={loanAmount}
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
                  <InputLabel>Срок кредита: {loanTerm} месяцев</InputLabel>
                  <Slider
                    value={loanTerm}
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
                    min={1}
                    max={30}
                    step={0.5}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 1, label: '1%' },
                      { value: 10, label: '10%' },
                      { value: 20, label: '20%' },
                      { value: 30, label: '30%' },
                    ]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Тип платежа</InputLabel>
                    <Select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as 'annuity' | 'differentiated')}
                      label="Тип платежа"
                    >
                      <MenuItem value="annuity">Аннуитетный</MenuItem>
                      <MenuItem value="differentiated">Дифференцированный</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sx={{ mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
                    onClick={calculateLoan}
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
                      <Typography variant="body1">Ежемесячный платеж:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {results.monthlyPayment.toFixed(2)} ₽
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1">Общая переплата:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {results.totalInterest.toFixed(2)} ₽
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="body1">Общая сумма выплат:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" fontWeight="bold">
                        {results.totalPayment.toFixed(2)} ₽
                      </Typography>
                    </Grid>
                  </Grid>

                  {paymentType === 'differentiated' && results.schedule && (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        График платежей:
                      </Typography>
                      <TableContainer sx={{ flex: 1 }}>
                        <Table stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Месяц</TableCell>
                              <TableCell align="right">Платеж</TableCell>
                              <TableCell align="right">Основной долг</TableCell>
                              <TableCell align="right">Проценты</TableCell>
                              <TableCell align="right">Остаток</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {results.schedule.map((row) => (
                              <TableRow key={row.month}>
                                <TableCell>{row.month}</TableCell>
                                <TableCell align="right">{row.payment.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.principal.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.interest.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.balance.toFixed(2)}</TableCell>
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
                  Введите параметры кредита и нажмите "Рассчитать"
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanCalculator;