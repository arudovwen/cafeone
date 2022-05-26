import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  items: [],

  status: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    settransactions(state, action) {
      state.items = action.payload.items;
    },
    setrecenttransactions(state, action) {
      state.items = action.payload;
    },
  },
});

export const { settransactions, setrecenttransactions } = transactionSlice.actions;
export const getTransactions = (page, search) => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/payments?page=${page}&search=${search}&size=15`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(settransactions(response.data));
  }
};
export const getRecentTransactions = (page, search) => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/payments/recent?page=${page}&search=${search}&size=15`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setrecenttransactions(response.data));
  }
};

export const getRecentDashboardTransactions = () => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/payments/recent?size=6`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setrecenttransactions(response.data));
  }
};

const transactionReducer = transactionSlice.reducer;

export default transactionReducer;
