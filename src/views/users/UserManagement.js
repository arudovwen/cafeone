import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Pagination, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import CheckAll from 'components/check-all/CheckAll';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { getMembers, addMember, uploadPhoto } from '../../members/memberSlice';

const UserManagementList = () => {
  const [userModal, setUserModal] = useState(false);
  const dispatch = useDispatch();
  const title = 'Users List';
  const description = 'Users List Page';

  const allItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [selectedItems, setSelectedItems] = useState([]);
  const usersData = useSelector((state) => state.members.items);
  const total = useSelector((state) => state.members.total);
  const status = useSelector((state) => state.members.status);
  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    middleName: '',
    birthDate: '',
    occupation: '',
    photo: '',
    gender: 'male',
    twitter: '',
    note: '',
    phoneNumber: '',
  };

  React.useEffect(() => {
    dispatch(getMembers());
  }, [dispatch]);

  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const toggleCheckAll = (allSelect) => {
    if (allSelect) {
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    address1: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    gender: Yup.string().required('Gender is required'),
    birthDate: Yup.string().required('Dob is required'),
  });

  const toggleModal = () => {
    setUserModal(!userModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addMember(values));

    resetForm({ values: '' });
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  const handleFile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    dispatch(uploadPhoto(formData)).then((res) => {
      values.photo = res.data.file;
    });
  };

  React.useEffect(() => {
    if (status === 'success') {
      setUserModal(false);
    }
  }, [status]);

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          {/* Title Start */}
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Home</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col xs="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1 d-inline-block d-lg-none">
              <CsLineIcons icon="sort" />
            </Button>
            <div className="btn-group ms-1 check-all-container">
              <CheckAll
                allItems={allItems}
                selectedItems={selectedItems}
                onToggle={toggleCheckAll}
                inputClassName="form-check"
                className="btn btn-outline-primary btn-custom-control py-0"
              />
              <Dropdown align="end">
                <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" variant="outline-primary" />
                <Dropdown.Menu>
                  <Dropdown.Item>Move</Dropdown.Item>
                  <Dropdown.Item>Archive</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          {/* Top Buttons End */}
        </Row>
      </div>

      <Row className="mb-3 justify-content-between">
        <Col md="5" lg="4" xxl="4" className="mb-1 d-flex align-items-center">
          {/* Search Start */}
          <div className="d-inline-block float-md-start me-4 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="text" placeholder="Search" />
            <span className="search-magnifier-icon">
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => toggleModal()}>
            <CsLineIcons icon="plus" /> <span>Add User</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="6" xxl="6" className="mb-1 text-end">
          {/* Print Button Start */}
          <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Print</Tooltip>}>
            <Button variant="foreground-alternate" className="btn-icon btn-icon-only shadow">
              <CsLineIcons icon="print" />
            </Button>
          </OverlayTrigger>
          {/* Print Button End */}

          {/* Export Dropdown Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsLineIcons icon="download" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">Copy</Dropdown.Item>
              <Dropdown.Item href="#">Excel</Dropdown.Item>
              <Dropdown.Item href="#">Cvs</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Export Dropdown End */}

          {/* Length Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
                {total} {total > 1 ? 'items' : 'item'}
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">5 Items</Dropdown.Item>
              <Dropdown.Item href="#">10 Items</Dropdown.Item>
              <Dropdown.Item href="#">20 Items</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
        <Col md="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
          <div className="text-muted text-small cursor-pointer sort">ID</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Email</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Phone</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Membership Type</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {usersData.length > 0 &&
        usersData.map((item, index) => (
          <Card className={`mb-2 ${selectedItems.includes(1) && 'selected'}`} key={item.id}>
            <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
              <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(1)}>
                <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                  <div className="text-muted text-small d-md-none">Id</div>
                  <NavLink to="/users/detail" className="text-truncate h-100 d-flex align-items-center">
                    {index + 1}
                  </NavLink>
                </Col>
                <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                  <div className="text-muted text-small d-md-none">Name</div>
                  <div className="text-alternate dflex align-items-center">
                    <img src={item.avatar} alt="avatar" className="avatar avatar-sm mr-2" />
                    {item.firstName} {item.lastName}
                  </div>
                </Col>
                <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                  <div className="text-muted text-small d-md-none">Email</div>
                  <div className="text-alternate">
                    <span>{item.email}</span>
                  </div>
                </Col>
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                  <div className="text-muted text-small d-md-none">Phone</div>
                  <div className="text-alternate">{item.phoneNumber ? item.phoneNumber : '-'}</div>
                </Col>
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                  <div className="text-muted text-small d-md-none">Status</div>
                  <div>
                    {item.membershipStatusId ? (
                      <Badge bg="outline-primary">{item.membershipStatus}</Badge>
                    ) : (
                      <Badge bg="outline-secondary">{item.membershipStatus}</Badge>
                    )}
                  </div>
                </Col>
                <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
                  <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(1)} onChange={() => {}} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
      {/* Pagination Start */}
      {usersData.length && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>
            <Pagination.Item className="shadow" active>
              1
            </Pagination.Item>
            <Pagination.Item className="shadow">2</Pagination.Item>
            <Pagination.Item className="shadow">3</Pagination.Item>
            <Pagination.Next className="shadow">
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      )}
      {/* Pagination End */}

      {!usersData.length && <div className="text-center p-4 text-muted">No member available</div>}

      {/* User Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={userModal} onHide={() => setUserModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add new user</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <Form.Label>First name</Form.Label>
                <Form.Control type="text" name="firstName" onChange={handleChange} value={values.firstName} />
                {errors.firstName && touched.firstName && <div className="d-block invalid-tooltip">{errors.firstName}</div>}
              </div>

              <div className="mb-3">
                <Form.Label>Last name</Form.Label>
                <Form.Control type="text" id="lastName" name="lastName" onChange={handleChange} value={values.lastName} />
                {errors.lastName && touched.lastName && <div className="d-block invalid-tooltip">{errors.lastName}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Middle name</Form.Label>
                <Form.Control type="text" id="middleName" name="middleName" onChange={handleChange} value={values.middleName} />
                {errors.middleName && touched.middleName && <div className="d-block invalid-tooltip">{errors.middleName}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Photo</Form.Label>
                <input type="file" id="photo" className="form-control" accept="image" name="photo" onChange={handleFile} />
              </div>
              <div className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select type="select" name="gender" onChange={handleChange} value={values.gender} placeholder="Select gender">
                  <option disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Form.Select>
                {errors.gender && touched.gender && <div className="d-block invalid-tooltip">{errors.gender}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Dob</Form.Label>
                <input type="date" className="form-control" name="birthDate" onChange={handleChange} value={values.birthDate} />
                {errors.birthDate && touched.birthDate && <div className="d-block invalid-tooltip">{errors.birthDate}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Address 1</Form.Label>
                <Form.Control type="text" id="address1" name="address1" onChange={handleChange} value={values.address1} />
                {errors.address1 && touched.address1 && <div className="d-block invalid-tooltip">{errors.address1}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Address 2</Form.Label>
                <Form.Control type="text" id="address2" name="address2" onChange={handleChange} value={values.address2} />
                {errors.address2 && touched.address2 && <div className="d-block invalid-tooltip">{errors.address2}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" id="city" name="city" onChange={handleChange} value={values.city} />
                {errors.city && touched.city && <div className="d-block invalid-tooltip">{errors.city}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" id="state" name="state" onChange={handleChange} value={values.state} />
                {errors.state && touched.state && <div className="d-block invalid-tooltip">{errors.state}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Occupation</Form.Label>
                <Form.Control type="text" id="occupation" name="occupation" onChange={handleChange} value={values.occupation} />
                {errors.occupation && touched.occupation && <div className="d-block invalid-tooltip">{errors.occupation}</div>}
              </div>

              <div className="mb-3">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="text" id="phoneNumber" name="phoneNumber" onChange={handleChange} value={values.phoneNumber} />
                {errors.phoneNumber && touched.phoneNumber && <div className="d-block invalid-tooltip">{errors.phoneNumber}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" id="email" name="email" onChange={handleChange} value={values.email} />
                {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
              </div>
              {/* <div className="mb-3">
                <Form.Label>Twitter handle</Form.Label>
                <Form.Control type="text" id="twitter" name="twitter" onChange={handleChange} value={values.twitter} />
                {errors.twitter && touched.twitter && <div className="d-block invalid-tooltip">{errors.twitter}</div>}
              </div>
              <div className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control type="text" id="note" name="note" onChange={handleChange} value={values.note} />
                {errors.note && touched.note && <div className="d-block invalid-tooltip">{errors.note}</div>}
              </div> */}
              <div className="border-0 mt-3 mb-5">
                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100">
                  <span>Submit</span>
                </Button>
              </div>
            </form>
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* User Detail Modal End */}
    </>
  );
};

export default UserManagementList;
