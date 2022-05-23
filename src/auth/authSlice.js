import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  isLogin: JSON.parse(localStorage.getItem('authAdmin')),
  currentUser: JSON.parse(localStorage.getItem('authAdmin')) ? JSON.parse(localStorage.getItem('authAdmin')) : {},
  status: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
      state.isLogin = true;
    },
    updatestatus(state, action) {
      state.status = action.payload;
    },
    resetstatus(state) {
      state.status = null;
    },
  },
});

export const { setCurrentUser, updatestatus, resetstatus } = authSlice.actions;
export const loginAdmin = (data) => async (dispatch) => {
  const response = await axios.post(`${SERVICE_URL}/auth/login`, data).catch((err) => {
    toast.error(err.response.data.message);
    dispatch(updatestatus('failed'));
    dispatch(resetstatus(null));
  });
  if (response) {
    const authAdmin = response.data;
    dispatch(updatestatus('success'));
    dispatch(resetstatus(null));
    localStorage.setItem('authAdmin', JSON.stringify(authAdmin));
    toast.success('Login successful');
    window.location.href = '/dashboard';
  }
};
export const forgetPassword = (data) => async () => {
  const response = await axios.post(`${SERVICE_URL}/auth/forgot-password`, data).catch((err) => {
    toast.error(err.response.data.message);
  });
  if (response) {
    toast.success('Email sending successful');
  }
};
export const resetPassword = (data) => async () => {
  const response = await axios.post(`${SERVICE_URL}/auth/reset-password`, data).catch((err) => {
    toast.error(err.response.data.message);
  });
  if (response) {
    toast.success('Password change successful');
    window.location.href = '/login';
  }
};
export const logout = () => async (dispatch) => {
  dispatch(setCurrentUser(null));
  toast.success('Logged out ');
  localStorage.removeItem('authAdmin');
  window.location.href = '/login';
};
const authReducer = authSlice.reducer;

export default authReducer;
