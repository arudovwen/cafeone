import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  campaigns: [],
  status: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setcampaign(state, action) {
      state.campaigns = action.payload;
    },

    addcampaign(state, action) {
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

export const { setcampaign, addcampaign, updatestatus, resetstatus } = campaignSlice.actions;

export const getcampaigns = () => async (dispatch) => {
  const response = await axios.get(`${SERVICE_URL}/campaigns`, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(setcampaign(response.data));
  }
};

export const getCampaign = (data) => async () => {
  return axios.get(`${SERVICE_URL}/campaigns/${data.id}`, requestConfig);
};

export const updateCampaign = (data) => async () => {
  return axios.post(`${SERVICE_URL}/campaigns/${data.id}`, data, requestConfig);
};

export const deleteCampaign = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/campaigns/${data.id}`, requestConfig);
};

export const activateCampaign = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/campaigns/${data.id}/activate`, requestConfig);
};

export const deactivateCampaign = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/campaigns/${data.id}/deactivate`, requestConfig);
};

export const addCampaign = (data) => async (dispatch) => {
  const response = await axios.post(`${SERVICE_URL}/campaigns`, data, requestConfig).catch((err) => {
    toast.error(err.response.data.message);
  });

  if (response.status === 200) {
    dispatch(addcampaign(response.data));
    toast.success('User created');
    dispatch(updatestatus('success'));
    dispatch(resetstatus());
  }
};

const campaignReducer = campaignSlice.reducer;

export default campaignReducer;
