import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  items: [],
  total: 0,
  status: null,
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setmembers(state, action) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    addmembers(state, action) {
      state.items = [action.payload, ...state.items];
    },
    updatestatus(state, action) {
      state.status = action.payload;
    },
    resetstatus(state) {
      state.status = null;
    },
  },
});

export const { setmembers, addmembers, updatestatus, resetstatus } = memberSlice.actions;
export const getMembers = () => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/members`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setmembers(response.data));
  }
};
export const getMember = (data) => async () => {
  return axios.get(`${SERVICE_URL}/members/${data.id}`, requestConfig);
};

export const updateMember = (data) => async () => {
  return axios.post(`${SERVICE_URL}/members/${data.id}`, data, requestConfig);
};

export const addMember = (data) => async (dispatch) => {
  const response = await axios.post(`${SERVICE_URL}/members`, data, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(addmembers(response.data));
    toast.success('User created');
    dispatch(updatestatus('success'));
    dispatch(resetstatus());
  }
};

export const subscribeMember = (data) => async () => {
  return axios.post(`${SERVICE_URL}/members/${data.id}`, data, requestConfig);
};

export const uploadPhoto = (data) => async () => {
  return axios.post(`http://streams.com.ng/cafeoneservices/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const memberReducer = memberSlice.reducer;

export default memberReducer;
