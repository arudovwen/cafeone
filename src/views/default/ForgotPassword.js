import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { forgetPassword } from 'auth/authSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const title = 'Forgot Password';
  const description = 'Forgot Password Page';

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
  });
  const initialValues = { email: '', returnPath: '/reset-password' };

  const dispatch = useDispatch();
  const onSubmit = (values, { resetForm }) => {
    dispatch(forgetPassword(values)).then(() => {
      toast.success('Email sending successful');
      resetForm({ values: '' });
    });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        {/* <div>
          <div className="mb-5">
            <h1 className="display-3 text-white">Multiple Niches</h1>
            <h1 className="display-3 text-white">Ready for Your Project</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before
            process-centric communities...
          </p>
          <div className="mb-5">
            <Button size="lg" variant="outline-white" href="/">
              Learn More
            </Button>
          </div>
        </div> */}
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 h-75 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 rounded-lg text-center">
      <div className="sw-lg-50 px-5  w-75">
        <div className="">
          <NavLink to="/">
            <img src="/img/logo/cafeone-black.png" alt="logo" className="gray-logo mx-auto" />
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Password is gone?</h2>
          <h2 className="cta-1 text-primary">Let's reset it!</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Please enter your email to receive a link to reset your password.</p>
          <p className="h6">
            If you are a member, please <NavLink to="/login">login</NavLink>.
          </p>
        </div>
        <div>
          <form id="forgotPasswordForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <Button size="lg" type="submit">
              Send Reset Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default ForgotPassword;
