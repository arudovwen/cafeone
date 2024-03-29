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
    updateBranchstatus(state, action) {
      state.branches = state.branches.map((v) => {
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

export const { setbranch, addbranch, updatestatus, resetstatus, updateBranchstatus } = branchSlice.actions;

export const updateBranchStatus = (data) => async (dispatch) => {
  dispatch(updateBranchstatus(data));
};
export const getBranches = (page, search) => async (dispatch) => {
  await axios
    .get(`${SERVICE_URL}/branches?page=${page}&search=${search}&size=15`, requestConfig)
    .then((response) => {
      if (response.status === 200) {
        dispatch(setbranch(response.data));
      }
    })
    .catch((err) => {
      dispatch(updatestatus('error'));
      dispatch(resetstatus());
      toast.error(err.response.data.message);
    });
};

export const getBranch = (data) => async () => {
  return axios.get(`${SERVICE_URL}/branches/${data}`, requestConfig);
};

export const updateBranch = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/branches/${data.id}`, data, requestConfig)
    .then((res) => {
      if (res.status === 200) {
        toast.success('Branch updated');
        dispatch(updatestatus('update'));
        dispatch(resetstatus());
      }
    })
    .catch(() => {
      dispatch(updatestatus('error'));
      dispatch(resetstatus());
    });
};

export const deleteBranch = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/branches/${data}`, requestConfig);
};

export const activateBranch = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data}/activate`, data, requestConfig);
};

export const deactivateBranch = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data}/deactivate`, data, requestConfig);
};
export const activateSeat = (seatId, branchId) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${branchId}/seats/${seatId}/activate`, seatId, requestConfig);
};

export const deactivateSeat = (seatId, branchId) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${branchId}/seats/${seatId}/deactivate`, seatId, requestConfig);
};

export const addBranch = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/branches`, data, requestConfig)
    .then((response) => {
      if (response.status === 200) {
        dispatch(addbranch(response.data));
        toast.success('Branch created');
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

export const addBranchSeat = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data.branchId}/seats`, data, requestConfig);
};
export const updateBranchSeat = (data) => async () => {
  return axios.post(`${SERVICE_URL}/branches/${data.branchId}/seats/${data.id}`, data, requestConfig);
};
export const deleteBranchSeat = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/branches/${data.id}/seats/${data.seat_id}`, requestConfig);
};

const branchReducer = branchSlice.reducer;

export default branchReducer;
