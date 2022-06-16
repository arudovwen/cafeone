import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { loginAdmin } from 'auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const title = 'Login';
  const description = 'Login Page';
  const [isLoading, setisloading] = React.useState(false);
  const status = useSelector((state) => state.auth.status);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });
  React.useEffect(() => {
    if (status === 'failed') {
      setisloading(false);
    }
  }, [status]);
  const initialValues = { email: '', password: '' };
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    setisloading(true);
    dispatch(loginAdmin(values));
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  const [showPassword, setShowPassword] = React.useState(false);
  function togglePassword() {

    setShowPassword(!showPassword);
  }
  const rightSide = (
    <div className="sw-lg-70 h-75 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 rounded-lg">
      <div className="sw-lg-50 px-md-5 text-center  w-75">
        <div className="mb-5">
          <NavLink to="/">
            <img src="/img/logo/cafeone-black.png" alt="logo" className="gray-logo mx-auto" />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Welcome to Café One</h2>
          <p className="h6 text-dark">Please use your credentials to login.</p>
        </div>
        <div>
          <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control type={!showPassword ? 'password' : 'text'} name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              <span className="position-absolute  e-3 cursor-pointer" style={{ top: '.7rem' }} color="black" onClick={() => togglePassword()}>
                {!showPassword ? (
                  <CsLineIcons icon="eye" className="text-small"  size="14" />
                ) : (
                  <CsLineIcons icon="eye-off" className="text-small"  size="14" />
                )}
              </span>
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>

            <Button size="lg" type="submit" className="block w-100">
              {!isLoading ? (
                'Login'
              ) : (
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Button>
          </form>
          <div className="mt-2">
            <NavLink className="text-small " to="/forgot-password">
              Forgot password?
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage right={rightSide} />
    </>
  );
};

export default Login;
