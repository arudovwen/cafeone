import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  types: [],
  memberships: [],
  total: 0,
  status: null,
};

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    setmembership(state, action) {
      state.memberships = action.payload.items;
      state.total = action.payload.total;
    },
    setmembershiptypes(state, action) {
      state.types = action.payload;
    },
    addmembership(state, action) {
      state.types = [action.payload, ...state.types];
    },
    updatestatus(state, action) {
      state.status = action.payload;
    },
    resetstatus(state) {
      state.status = null;
    },
  },
});

export const { setmembership, addmembership, updatestatus, resetstatus, setmembershiptypes } = membershipSlice.actions;

export const getmembershiptypes = () => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/membership-types`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setmembershiptypes(response.data));
  }
};

export const getMembership = () => async () => {
  return axios.get(`${SERVICE_URL}/memberships`, requestConfig);
};

export const updateMembership = (data) => async (dispatch) => {
  return axios.post(`${SERVICE_URL}/membership-types/${data.id}`, data, requestConfig).then((res) => {
    if (res.status === 200) {
      toast.success('Update successful');
      dispatch(updatestatus('update'));
      dispatch(resetstatus());
    }
  });
};

export const deleteMembership = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/membership-types/${data}`, requestConfig);
};

export const activateMembership = (data) => async () => {
  return axios.post(`${SERVICE_URL}/membership-types/${data}/activate`, data, requestConfig);
};

export const deactivateMembership = (data) => async () => {
  return axios.post(`${SERVICE_URL}/membership-types/${data}/deactivate`, data, requestConfig);
};

export const addMembershipType = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/membership-types`, data, requestConfig)
    .then((res) => {
      if (res.status === 200) {
        dispatch(addmembership(res.data));
        toast.success('Creation successful');
        dispatch(updatestatus('success'));
        dispatch(resetstatus());
      }
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    });
};

const membershipReducer = membershipSlice.reducer;

export default membershipReducer;
