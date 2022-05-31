/* eslint-disable no-alert */
import React from 'react';

import { useDispatch } from 'react-redux';
import { logout } from 'auth/authSlice';

const Logout = () => {
  const dispatch = useDispatch();
  dispatch(logout());
  return <></>;
};

export default Logout;
