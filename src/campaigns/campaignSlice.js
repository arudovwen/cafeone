import { createSlice } from '@reduxjs/toolkit';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
  items: [],
  total: [],
  campaigns: [],
  status: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setcampaign(state, action) {
      state.items = action.payload.items;
    },

    addcampaign(state, action) {
      state.items = [action.payload, ...state.items];
    },
    updatestatus(state, action) {
      state.status = action.payload;
    },
    updatecampaignstatus(state, action) {
      state.items = state.items.map((v) => {
        if (v.id === action.payload.id) {
          v.statusId = action.payload.value;
        }
        return v;
      });
    },
    resetstatus(state) {
      state.status = null;
    },
  },
});

export const { setcampaign, addcampaign, updatestatus, resetstatus, updatecampaignstatus } = campaignSlice.actions;

export const updateCampaignStatus = (data) => async (dispatch) => {
  dispatch(updatecampaignstatus(data));
};
export const getCampaigns =
  (page, search, startDateFrom = null, startDateTo = null, branchId = null, membershipId = null) =>
  async (dispatch) => {
    const response = await axios
      .get(
        `${SERVICE_URL}/campaigns?search=${search}&page=${page}&fromDate=${startDateFrom}&toDate=${startDateTo}&branchId=${branchId}&MembershipTypeId=${membershipId}&size=15`,
        requestConfig
      )
      .catch((err) => {
        toast.error(err.response.data.message);
      });

    if (response.status === 200) {
      dispatch(setcampaign(response.data));
    }
  };

export const getCampaign = (data) => async () => {
  return axios.get(`${SERVICE_URL}/campaigns/${data}`, requestConfig);
};
export const getCampaignDiscountType = () => async () => {
  return axios.get(`${SERVICE_URL}/campaigns/discount-types`, requestConfig);
};

export const updateCampaign = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/campaigns/${data.id}`, data, requestConfig)
    .then((res) => {
      if (res.status === 200) {
        toast.success('Campaign updated');
        dispatch(updatestatus('update'));
        dispatch(resetstatus());
      }
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      dispatch(updatestatus('error'));
      dispatch(resetstatus());
    });
};

export const deleteCampaign = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/campaigns/${data}`, requestConfig);
};

export const activateCampaign = (data) => async () => {
  return axios.post(`${SERVICE_URL}/campaigns/${data}/activate`, data, requestConfig);
};

export const deactivateCampaign = (data) => async () => {
  return axios.post(`${SERVICE_URL}/campaigns/${data}/deactivate`, data, requestConfig);
};

export const addCampaign = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/campaigns`, data, requestConfig)
    .then((res) => {
      if (res.status === 200) {
        dispatch(addcampaign(res.data));
        toast.success('Campaign created');
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

const campaignReducer = campaignSlice.reducer;

export default campaignReducer;
