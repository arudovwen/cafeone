import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  items: [],
  total: 0,
  status: null,
  roles: [],
};

const adminSlice = createSlice({
  name: 'admins',
  initialState,
  reducers: {
    setroles(state, action) {
      state.roles = action.payload;
    },
    setadmins(state, action) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },
    addadmins(state, action) {
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

export const { setadmins, addadmins, updatestatus, resetstatus, setroles } = adminSlice.actions;
export const getAdmins = (page, search) => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/admins?page=${page}&search=${search}&size=15`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setadmins(response.data));
  }
};
export const getRoles = () => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/admins/roles`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setroles(response.data));
  }
};
export const getAdmin = (data) => async () => {
  return axios.get(`${SERVICE_URL}/admins/${data}`, requestConfig);
};

export const updateAdmin = (data) => async (dispatch) => {
  axios.post(`${SERVICE_URL}/admins/${data.id}`, data, requestConfig).then((res) => {
    toast.success('User updated');
    dispatch(updatestatus('update'));
    dispatch(resetstatus());
  });
};

export const addAdmin = (data) => async (dispatch) => {
  const response = await axios.post(`${SERVICE_URL}/admins`, data, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(addadmins(response.data));
    toast.success('User created');
    dispatch(updatestatus('success'));
    dispatch(resetstatus());
  }
};
export const activateAdmin = (data) => async () => {
  return axios.post(`${SERVICE_URL}/admins/${data}/activate`, data, requestConfig);
};

export const deactivateAdmin = (data) => async () => {
  return axios.post(`${SERVICE_URL}/admins/${data}/deactivate`, data, requestConfig);
};

export const subscribeAdmin = (data) => async () => {
  return axios.post(`${SERVICE_URL}/admins/${data.id}`, data, requestConfig);
};

export const uploadPhoto = (data) => async () => {
  return axios.post(`http://streams.com.ng/cafeoneservices/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const removeadmin = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/admins/${data}`, requestConfig);
};
const adminReducer = adminSlice.reducer;

export default adminReducer;
