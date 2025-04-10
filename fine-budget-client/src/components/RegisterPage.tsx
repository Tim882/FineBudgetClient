import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types/auth';
// import '../styles/AuthPages.css';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    //confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // if (formData.password !== formData.confirmPassword) {
    //   return setError('Пароли не совпадают');
    // }

    try {
      setError('');
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Ошибка при регистрации. Возможно, email уже используется');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Создать аккаунт</h2>
        {error && <div className="alert error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          
          {/* <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div> */}
          
          <button 
            type="submit" 
            className="btn primary" 
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="auth-footer">
          Уже есть аккаунт? <a href="/login">Войти</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;