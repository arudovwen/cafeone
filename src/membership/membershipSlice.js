import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  types: [],
  memberships:[],
  status: null,
};

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    setmembership(state, action) {
      state.memberships = action.payload;
    },
    setmembershiptypes(state, action) {
      state.types = action.payload;
    },
    addmembership(state, action) {
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

export const { setmembership, addmembership, updatestatus, resetstatus } = membershipSlice.actions;

export const getmembershiptypes = () => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/membership-types`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setmembership(response.data));
  }
};

export const getMembership = () => async () => {
  return axios.get(`${SERVICE_URL}/memberships`, requestConfig);
};

export const updateMembership = (data) => async () => {
  return axios.post(`${SERVICE_URL}/membership-types/${data.id}`, data, requestConfig);
};

export const deleteMembership = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/membership-types/${data.id}`, requestConfig);
};

export const activateMembership = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/membership-types/${data.id}/activate`, requestConfig);
};

export const deactivateMembership = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/membership-types/${data.id}/deactivate`, requestConfig);
};

export const addMembership = (data) => async (dispatch) => {
  const response = await axios.post(`${SERVICE_URL}/membership-types`, data, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(addmembership(response.data));
    toast.success('User created');
    dispatch(updatestatus('success'));
    dispatch(resetstatus());
  }
};



const membershipReducer = membershipSlice.reducer;

export default membershipReducer;
