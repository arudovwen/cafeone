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
export const getMembers =
  (page, search, branchId, size = 15) =>
  async (dispatch) => {
    const response = await axios.get(`${SERVICE_URL}/members?page=${page}&search=${search}&size=${size}&branchId=${branchId}`, requestConfig).catch((err) => {
      toast.error(err.response.data.message);
    });

    if (response.status === 200) {
      dispatch(setmembers(response.data));
    }
  };
export const getMember = (data) => async () => {
  return axios.get(`${SERVICE_URL}/members/${data}`, requestConfig);
};

export const updateMember = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/members/${data.id}`, data, requestConfig)
    .then(() => {
      toast.success('User updated');
      dispatch(updatestatus('update'));
      dispatch(resetstatus());
    })
    .catch(() => {
      dispatch(updatestatus('error'));
      dispatch(resetstatus());
    });
};

export const addMember = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/members`, data, requestConfig)
    .then((response) => {
      if (response.status === 200) {
        dispatch(addmembers(response.data));
        toast.success('User created');
        dispatch(updatestatus('success'));
        dispatch(resetstatus());
      }
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      dispatch(updatestatus('error'));
      dispatch(resetstatus());
    });
};

export const deleteMember = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/members/${data}`, requestConfig);
};
export const subscribeMember = (data) => async () => {
  return axios.post(`${SERVICE_URL}/members/${data.id}/subscribe`, data, requestConfig);
};

export const uploadPhoto = (data) => async () => {
  return axios.post(`https://membership-service-stg-api.azurewebsites.net/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const memberReducer = memberSlice.reducer;

export default memberReducer;
