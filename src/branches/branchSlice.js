import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  branches: [],
  status: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setbranch(state, action) {
      state.branches = action.payload;
    },

    addbranch(state, action) {
      state.branches = [action.payload, ...state.branches];
    },
    updatestatus(state, action) {
      state.status = action.payload;
    },
    resetstatus(state) {
      state.status = null;
    },
  },
});

export const { setbranch, addbranch, updatestatus, resetstatus } = branchSlice.actions;

export const getBranches = (page, search) => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/branches?page=${page}&search=${search}&size=15`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setbranch(response.data));
  }
};

export const getBranch = (data) => async () => {
  return axios.get(`${SERVICE_URL}/branches/${data}`, requestConfig);
};

export const updateBranch = (data) => async (dispatch) => {
  axios.post(`${SERVICE_URL}/branches/${data.id}`, data, requestConfig).then((res) => {
    if (res.status === 200) {
      toast.success('Branch updated');
      dispatch(updatestatus('update'));
      dispatch(resetstatus());
    }
  });
};

export const deleteBranch = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/branches/${data}`, requestConfig);
};

export const activateBranch = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data}/activate`,data, requestConfig);
};

export const deactivateBranch = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data}/deactivate`,data, requestConfig);
};

export const addBranch = (data) => async (dispatch) => {
  const response = await axios.post(`${SERVICE_URL}/branches`, data, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(addbranch(response.data));
    toast.success('Branch created');
    dispatch(updatestatus('success'));
    dispatch(resetstatus());
  }
};

export const addBranchSeat = (data) => async () => {

  return axios.post(`${SERVICE_URL}/branches/${data.branchId}/seats`, data, requestConfig);
};
export const updateBranchSeat = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data.id}/seats/${data.seat_id}`, data, requestConfig);
};
export const deleteBranchSeat = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/branches/${data.id}/seats/${data.seat_id}`, requestConfig);
};

const branchReducer = branchSlice.reducer;

export default branchReducer;
