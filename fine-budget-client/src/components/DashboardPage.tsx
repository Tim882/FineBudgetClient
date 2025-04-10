import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFamilyBudget } from '../services/budget.service';
import { BudgetSummary, Transaction } from '../types/budget';
import '../styles/DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        const data = await getFamilyBudget();
        setBudget(data.summary);
        setRecentTransactions(data.recentTransactions);
      } catch (err) {
        setError('Не удалось загрузить данные бюджета');
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Загрузка данных...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Семейный бюджет</h1>
        <div className="user-info">
          <span>{user?.name}</span>
          <button onClick={logout} className="btn logout-btn">
            Выйти
          </button>
        </div>
      </header>

      {error && <div className="alert error">{error}</div>}

      {budget && (
        <section className="budget-summary">
          <div className="summary-card income">
            <h3>Доходы</h3>
            <p className="amount">{budget.totalIncome.toFixed(2)} ₽</p>
          </div>
          <div className="summary-card expenses">
            <h3>Расходы</h3>
            <p className="amount">{budget.totalExpenses.toFixed(2)} ₽</p>
          </div>
          <div className="summary-card balance">
            <h3>Баланс</h3>
            <p className="amount">{budget.balance.toFixed(2)} ₽</p>
          </div>
        </section>
      )}

      <section className="recent-transactions">
        <h2>Последние операции</h2>
        <div className="transactions-list">
          {recentTransactions.length > 0 ? (
            recentTransactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="category">{transaction.category}</span>
                  <span className="description">{transaction.description}</span>
                  <span className="date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={`amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {transaction.amount.toFixed(2)} ₽
                </div>
              </div>
            ))
          ) : (
            <p>Нет операций за текущий период</p>
          )}
        </div>
      </section>

      <div className="dashboard-actions">
        <button className="btn primary">Добавить доход</button>
        <button className="btn secondary">Добавить расход</button>
      </div>
    </div>
  );
};

export default DashboardPage;