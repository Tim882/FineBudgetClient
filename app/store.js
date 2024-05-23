// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './index'; 

const store = configureStore({
  reducer: loginReducer, 
});

export default store;