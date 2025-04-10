import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Добро пожаловать в Family Budget</h1>
        <p>Удобное управление семейным бюджетом</p>
      </header>

      <main className="home-main">
        {user ? (
          <div className="auth-buttons">
            <Link to="/dashboard" className="btn primary">
              Перейти в кабинет
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn primary">
              Войти
            </Link>
            <Link to="/register" className="btn secondary">
              Зарегистрироваться
            </Link>
          </div>
        )}

        <section className="features">
          <div className="feature-card">
            <h3>📊 Отслеживание расходов</h3>
            <p>Фиксируйте все траты по категориям</p>
          </div>
          <div className="feature-card">
            <h3>💰 Учет доходов</h3>
            <p>Записывайте все источники дохода</p>
          </div>
          <div className="feature-card">
            <h3>👨‍👩‍👧‍👦 Совместный доступ</h3>
            <p>Работайте над бюджетом всей семьей</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;