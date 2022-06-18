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

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setbooking(state, action) {
      state.items = action.payload.items;
      state.total = action.payload.total;
    },

    addbooking(state, action) {
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

export const { setbooking, addbooking, updatestatus, resetstatus } = bookingSlice.actions;

export const getBookings =
  (page, search, startTimeFrom = null, startTimeTo = null, endTimeFrom = null, endTimeTo = null, SeatId = null, MemberId = null, seatId=null) =>
  async (dispatch) => {
    const response = await axios
      .get(
        `${SERVICE_URL}/bookings?search=${search}&page=${page}&startTimeFrom=${startTimeFrom}&startTimeTo=${startTimeTo}&endTimeFrom=${endTimeFrom}&endTimeTo=${endTimeTo}&SeatId=${SeatId}}&MemberId=${MemberId}`,
        requestConfig
      )
      .catch((err) => {
        toast.error(err.response.data.message);
      });

    if (response.status === 200) {
      dispatch(setbooking(response.data));
    }
  };

export const getPaymentStatusTypes  = () => async () => {
  return axios.get(`${SERVICE_URL}/bookings/plan-types`, requestConfig);
};

export const getPlanTypes = () => async () => {
  return axios.get(`${SERVICE_URL}/bookings/payment-status-types`, requestConfig);
};
export const  getBooking = (data) => async () => {
  return axios.get(`${SERVICE_URL}/bookings/${data}`, requestConfig);
};

export const updateBooking = (data) => async () => {
  return axios.post(`${SERVICE_URL}/bookings/${data.id}`, data, requestConfig);
};

export const deleteBooking = (data) => async () => {
  return axios.delete(`${SERVICE_URL}/bookings/${data.id}`, requestConfig);
};

export const checkinBooking = (data) => async () => {
  return axios.post(`${SERVICE_URL}/bookings/${data}/checkin`, data, requestConfig);
};

export const checkoutBooking = (data) => async () => {
  return axios.post(`${SERVICE_URL}/bookings/${data}/checkout`, data, requestConfig);
};

export const addBooking = (data) => async (dispatch) => {
  axios
    .post(`${SERVICE_URL}/bookings`, data, requestConfig)
    .then((response) => {
      if (response.status === 200) {
        dispatch(addbooking(response.data));
        toast.success('Booking created');
        dispatch(updatestatus('success'));
        dispatch(resetstatus());
      }
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    });
};

const bookingReducer = bookingSlice.reducer;
export default bookingReducer;
