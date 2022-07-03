/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Pagination, Tooltip, OverlayTrigger, Modal, Spinner } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CsvDownloader from 'react-csv-downloader';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useReactToPrint } from 'react-to-print';
import {
  getmembershiptypes,
  // eslint-disable-next-line import/extensions
} from '../../membership/membershipSlice';
import { getBranches } from '../../branches/branchSlice';
import { getMembers, addMember, uploadPhoto, getMember, updateMember, subscribeMember, deleteMember } from '../../members/memberSlice';
import { getBookingByMember } from '../../bookings/bookingSlice';

const ComponentToPrint = forwardRef((props, ref) => {
  const usersData = useSelector((state) => state.members.items);
  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <table style={{ border: '1px solid #ccc' }}>
        <thead className="">
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
              <div className="text-muted text-medium">NAME</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
              <div className="text-muted text-medium ">Email</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
              <div className="text-muted text-medium ">Phone</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
              <div className="text-muted text-medium ">Membership Type</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
              <div className="text-muted text-medium">Branch</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((item, id) => (
            <tr key={id} className="mb-2">
              <td style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
                <div className="text-alternate ">
                  {item.firstName} {item.lastName}
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
                <div className="text-alternate">
                  <span>{item.email}</span>
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
                <div className="text-alternate">{item.phone ? item.phone : '-'}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
                <div>{item.membershipType}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '3px 2px' }}>
                <div>{item.branch}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
const UserManagementList = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [myBookings, setMyBookings] = useState([]);
  const [userModal, setUserModal] = useState(false);
  const dispatch = useDispatch();
  const title = 'Users List';
  const description = 'Users List Page';
  const usersData = useSelector((state) => state.members.items);
  const total = useSelector((state) => state.members.total);
  const status = useSelector((state) => state.members.status);
  const membershipsData = useSelector((state) => state.membership.types);
  const branchesData = useSelector((state) => state.branches.branches).map((item) => {
    return {
      value: item.id,
      name: item.name,
    };
  });
  const [isLoading, setisloading] = React.useState(false);
  const [isUploading, setIsUploading] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [branchId, setBranchId] = useState(null);
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
    phoneNumber: '',
    note: '',
    membershipTypeId: '',
    gender: '',
    branchId: '',
  };
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    membershipTypeId: 0,
    campaignCode: '',
  });
  const [datas, setDatas] = useState([]);
  React.useEffect(() => {
    dispatch(getMembers(page, search));
    dispatch(getBranches(page, search, 50));
    dispatch(getmembershiptypes(page, search, 50));
  }, [dispatch, page, search]);

  function nextPage() {
    if (total < 15) return;
    setPage(page + 1);
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    address1: Yup.string().required('Address is required'),
    city: Yup.string(),
    state: Yup.string().required('State is required'),
    gender: Yup.string().required('Gender is required'),
    birthDate: Yup.string(),
    phoneNumber: Yup.string().required('Phone number is required'),
    membershipTypeId: Yup.string().required('Field is required'),
  });

  const toggleModal = () => {
    setUserModal(!userModal);
  };

  const onSubmit = (values) => {
    setisloading(true);
    dispatch(addMember(values));
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const handleFile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading('loading');
    dispatch(uploadPhoto(formData)).then((res) => {
      values.photo = res.data.file;
      setIsUploading('loaded');
    });
  };
  const handleUpdateFile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    dispatch(uploadPhoto(formData)).then((res) => {
      updateData.photo = res.data.file;
    });
  };

  function getMyBookings(id) {
    dispatch(getBookingByMember(id)).then((res) => {
      setMyBookings(res.data.items);
      setUserModal(false);
      setBookingModal(true);
    });
  }

  function deleteThisMember(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteMember(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Member removed');
          dispatch(getMembers(page, search));
          toggleModal();
          setIsAdding(false);
          setIsViewing(false);
          setIsEditing(false);
        }
      });
    }
  }
  function editUser(val) {
    dispatch(getMember(val.id)).then((res) => {
      const info = res.data;
      info.birthDate = res.data.birthDate ? moment(res.data.birthDate).format('yyyy-MM-DD') : '';
      info.photo = res.data.avatar;
      setUpdateData(info);
      setIsAdding(false);
      setIsViewing(false);
      setIsSubscribing(false);
      setIsEditing(true);
    });
  }
  function addNewUser() {
    setIsAdding(true);
    setIsViewing(false);
    setIsEditing(false);
    toggleModal();
  }

  function viewUser(val) {
    dispatch(getMember(val.id)).then((res) => {
      setIsAdding(false);

      setIsEditing(false);
      setIsSubscribing(false);
      setIsViewing(true);
      setUpdateData(res.data);
      toggleModal();
    });
  }

  // highlight-starts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((nextValue) => setSearch(nextValue), 1000),
    [] // will be created only once initially
  );
  // highlight-ends

  const handleSearch = (e) => {
    debouncedSave(e.target.value);
  };

  function handleUpdateChange(e) {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  }
  function handleUpdate(e) {
    e.preventDefault();
    setisloading(true);
    dispatch(updateMember(updateData));
  }

  function handlSubscription(e) {
    setSubscriptionData({
      ...subscriptionData,
      [e.target.name]: e.target.value,
    });
  }
  function subscribeNow(e) {
    e.preventDefault();
    const data = {
      ...subscriptionData,
      id: updateData.id,
    };
    dispatch(subscribeMember(data))
      .then((res) => {
        if (res.status === 200) {
          dispatch(getMember(updateData.id)).then((resp) => {
            setIsAdding(false);
            setIsSubscribing(false);
            setIsEditing(false);
            setIsViewing(true);
            setUpdateData(resp.data);
            toast.success('Subscription successful');
          });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }
  function fuzzySearch(options) {
    const fuse = new Fuse(options, {
      keys: ['name', 'groupName', 'items.name'],
      threshold: 0.3,
    });

    return (value) => {
      if (!value.length) {
        return options;
      }

      return fuse.search(value).map(({ item }) => item);
    };
  }
  React.useEffect(() => {
    dispatch(getMembers(page, search, 15, branchId));
  }, [branchId]);

  function resetFilter() {
    setBranchId(null);
  }

  React.useEffect(() => {
    if (status === 'success') {
      values.email = '';
      values.firstName = '';
      values.lastName = '';
      values.address1 = '';
      values.address2 = '';
      values.city = '';
      values.state = '';
      values.middleName = '';
      values.birthDate = '';
      values.occupation = '';
      values.photo = '';
      values.gender = '';
      values.twitter = '';
      values.note = '';
      values.phoneNumber = '';
      values.membershipTypeId = '';
      setisloading(false);
      setUserModal(false);
      setIsUploading(null);
    }
    if (status === 'error') {
      setisloading(false);
    }
    if (status === 'update') {
      dispatch(getMembers(1, ''));
      setUserModal(false);
      setisloading(false);
      setIsUploading(null);
    }
  }, [status, dispatch]);

  React.useEffect(() => {
    const newdata = usersData.map((item) => {
      return {
        cell1: `${item.firstName} ${item.lastName}`,
        cell2: item.email,
        cell3: item.phone,
        cell4: item.membershipType,
         cell5: item.branch,
      };
    });
    setDatas(newdata);
  }, [usersData]);

  const columns = [
    {
      id: 'cell1',
      displayName: 'NAME',
    },
    {
      id: 'cell2',
      displayName: 'EMAIL',
    },
    {
      id: 'cell3',
      displayName: 'PHONE',
    },
    {
      id: 'cell4',
      displayName: 'MEMBERSHIP TYPE',
    },
    {
      id: 'cell5',
      displayName: 'BRANCH',
    },
  ];
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
          {/* <Col xs="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1 d-inline-block d-lg-none">
              <CsLineIcons icon="" />
            </Button>
          </Col> */}
          Top Buttons End
        </Row>
      </div>

      <Row className="mb-3 justify-content-between">
        <Col md="5" lg="6" xxl="6" className="mb-1 d-flex align-items-center">
          {/* Search Start */}
          <div className="d-inline-block float-md-start me-4 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="text" placeholder="Search" onChange={(e) => handleSearch(e)} />
            <span className="search-magnifier-icon">
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>
          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewUser()}>
            <CsLineIcons icon="plus" className="d-none d-md-inline" /> <span>Add member</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="5" xxl="5" className="mb-1 text-end d-flex align-items-center">
          <SelectSearch
            filterOptions={() => fuzzySearch(branchesData)}
            options={branchesData}
            search
            name="branchId"
            value={branchId}
            placeholder="Filter by  branch"
            onChange={(val) => setBranchId(val)}
          />
          <OverlayTrigger delay={{ show: 500, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Reset filter</Tooltip>}>
            <span onClick={() => resetFilter()} className="cursor-pointer d-flex align-items-center ms-2">
              <CsLineIcons icon="refresh-horizontal" size="16" />
            </span>
          </OverlayTrigger>

          {/* Export Dropdown Start */}
          <div style={{ display: 'none' }}>
            <ComponentToPrint ref={componentRef} />
          </div>

          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-4">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export </Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsLineIcons icon="download" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">

                <CsvDownloader filename="members" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
                  Export csv
                </CsvDownloader>
              </Dropdown.Item>
              <Dropdown.Item onClick={handlePrint}>Export pdf</Dropdown.Item>
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
              {/* <Dropdown.Item href="#">5 Items</Dropdown.Item>
              <Dropdown.Item href="#">10 Items</Dropdown.Item>
              <Dropdown.Item href="#">20 Items</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 mt-5">
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">NAME</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">Email</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">Phone</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">Membership Type</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-md-end">
          <div className="text-muted text-small cursor-pointer  text-md-right">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {usersData.map((item) => (
        <Card key={item.id} className="mb-2">
          <Card.Body className="pt-md-0 pb-md-0 sh-auto sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-2">
                <div className="text-muted text-small d-md-none">Name</div>

                <div className="text-alternate dflex align-items-center">
                  <img
                    src={item.avatar ? `${process.env.REACT_APP_URL}/${item.avatar}` : 'https://via.placeholder.com/150'}
                    alt="avatar"
                    className="avatar avatar-sm me-2 rounded d-none d-md-inline"
                    style={{ width: '30px', height: '30px' }}
                  />
                  {item.firstName} {item.lastName}
                </div>
              </Col>
              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-3">
                <div className="text-muted text-small d-md-none">Email</div>
                <div className="text-alternate">
                  <span>{item.email}</span>
                </div>
              </Col>
              <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-4">
                <div className="text-muted text-small d-md-none">Phone</div>
                <div className="text-alternate">{item.phoneNumber ? item.phoneNumber : '-'}</div>
              </Col>
              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5">
                <div className="text-muted text-small d-md-none">Membership Type</div>
                <div>
                  <Badge bg="outline-secondary">{item.membershipType}</Badge>
                </div>
              </Col>
              <Col xs="12" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-last order-md-last">
                <Button variant="primary" type="button" size="sm" onClick={() => viewUser(item)} className="">
                  View
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      {/* Pagination Start */}
      {total ? (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={total < 15}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      ) : (
        ''
      )}
      {/* Pagination End */}

      {!usersData.length && <div className="text-center p-4 text-muted">No member available</div>}

      {/* User Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={userModal} onHide={() => setUserModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new member'}
            {isEditing && 'Update new member'}
            {isViewing && 'Member Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
              <form onSubmit={handleSubmit} className="pb-5">
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" id="email" name="email" onChange={handleChange} value={values.email} />
                  {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>
                    <span className="me-1">Photo</span>
                    {isUploading === 'loaded' ? <CsLineIcons icon="check" size="12" variant="primary" /> : ''}
                    {isUploading === 'loading' ? <Spinner animation="border" role="status" className="text-success" size="sm" /> : ''}
                  </Form.Label>
                  <input type="file" id="photo" className="form-control" accept="image/*" name="photo" onChange={handleFile} />
                </div>
                <div className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select type="select" name="gender" onChange={handleChange} value={values.gender} placeholder="Select gender">
                    <option disabled value="">
                      Select gender
                    </option>
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
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" id="address1" name="address1" onChange={handleChange} value={values.address1} />
                  {errors.address1 && touched.address1 && <div className="d-block invalid-tooltip">{errors.address1}</div>}
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
                  <Form.Control type="number" id="phoneNumber" name="phoneNumber" onChange={handleChange} value={values.phoneNumber} />
                  {errors.phoneNumber && touched.phoneNumber && <div className="d-block invalid-tooltip">{errors.phoneNumber}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Membership type</Form.Label>
                  <Form.Select type="text" id="membershipTypeId" name="membershipTypeId" onChange={handleChange} value={values.membershipTypeId}>
                    <option value="" disabled>
                      Select membership type
                    </option>
                    {membershipsData.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.membershipTypeId && touched.membershipTypeId && <div className="d-block invalid-tooltip">{errors.membershipTypeId}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Select type="text" id="branchId" name="branchId" onChange={handleChange} value={values.branchId}>
                    <option value="" disabled>
                      Select branch
                    </option>
                    {branchesData.map((item) => (
                      <option value={Number(item.value)} key={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errors.branchId && touched.branchId && <div className="d-block invalid-tooltip">{errors.branchId}</div>}
                </div>

                <div className="border-0 mt-3 mb-5">
                  <Button variant="primary" type="submit" disabled={isLoading} className="btn-icon btn-icon-start w-100">
                    {!isLoading ? (
                      'Submit'
                    ) : (
                      <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    )}
                  </Button>
                </div>
              </form>
            )}
            {isEditing && (
              <form onSubmit={(e) => handleUpdate(e)} className="pb-5">
                <div className="mb-3">
                  <Form.Label>First name</Form.Label>
                  <Form.Control type="text" name="firstName" onChange={(e) => handleUpdateChange(e)} value={updateData.firstName} />
                </div>

                <div className="mb-3">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control type="text" id="lastName" name="lastName" onChange={(e) => handleUpdateChange(e)} value={updateData.lastName} />
                </div>
                <div className="mb-3">
                  <Form.Label>Middle name</Form.Label>
                  <Form.Control type="text" id="middleName" name="middleName" onChange={(e) => handleUpdateChange(e)} value={updateData.middleName} />
                </div>
                <div className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" id="email" name="email" onChange={(e) => handleUpdateChange(e)} value={updateData.email} />
                </div>
                <div className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <input type="file" id="photo" className="form-control" accept="image/*" name="photo" onChange={handleUpdateFile} />
                </div>
                <div className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select type="select" name="gender" onChange={(e) => handleUpdateChange(e)} value={updateData.gender} placeholder="Select gender">
                    <option disabled value="">
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <Form.Label>Dob</Form.Label>
                  <input type="date" className="form-control" name="birthDate" onChange={(e) => handleUpdateChange(e)} value={updateData.birthDate} />
                </div>
                <div className="mb-3">
                  <Form.Label>Address 1</Form.Label>
                  <Form.Control type="text" id="address1" name="address1" onChange={(e) => handleUpdateChange(e)} value={updateData.address1} />
                </div>

                <div className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" id="city" name="city" onChange={(e) => handleUpdateChange(e)} value={updateData.city} />
                </div>
                <div className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" id="state" name="state" onChange={(e) => handleUpdateChange(e)} value={updateData.state} />
                </div>
                <div className="mb-3">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Control type="text" id="occupation" name="occupation" onChange={(e) => handleUpdateChange(e)} value={updateData.occupation} />
                </div>

                <div className="mb-3">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control type="number" id="phoneNumber" name="phoneNumber" onChange={(e) => handleUpdateChange(e)} value={updateData.phoneNumber} />
                </div>
                <div className="mb-3">
                  <Form.Label>Membership type</Form.Label>
                  <Form.Select
                    type="text"
                    id="membershipTypeId"
                    name="membershipTypeId"
                    onChange={(e) => handleUpdateChange(e)}
                    value={updateData.membershipTypeId}
                  >
                    <option value={0} disabled>
                      Select membership type
                    </option>
                    {membershipsData.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <Form.Select type="text" id="branchId" name="branchId" onChange={(e) => handleUpdateChange(e)} value={updateData.branchId}>
                    <option value="" disabled>
                      Select branch
                    </option>
                    {branchesData.map((item) => (
                      <option value={Number(item.value)} key={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className="border-0 mt-3 mb-5">
                  <Button variant="primary" type="submit" disabled={isLoading} className="btn-icon btn-icon-start w-100">
                    {!isLoading ? (
                      'Update member'
                    ) : (
                      <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <div className="d-flex justify-content-between align-items-end  mb-3">
                  <img
                    src={updateData.avatar ? `${process.env.REACT_APP_URL}/${updateData.avatar}` : 'https://via.placeholder.com/150'}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px' }}
                  />

                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => getMyBookings(updateData.id)}>
                    <span className="">View bookings</span>
                  </Button>
                </div>
                <table className="mb-5">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold border-bottom  py-2 px-1 border-bottom text-uppercase text-muted"> Name</td>
                      <td className=" py-2 px-1 border-bottom">
                        {updateData.firstName} {updateData.middleName} {updateData.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Email</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.email}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Phone</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Address 1</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.address1}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">DOB</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.birthDate ? moment(updateData.birthDate).format('l') : '-'}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">City</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.city}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">State</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.state}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Occupation</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.occupation || '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Membership type</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.membershipType}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Branch</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.branch}</td>
                    </tr>
                    {/* <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Membership start date</td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.membershipStartDate).format('l')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Membership expiry date</td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.membershipExpiryDate).format('l')}</td>
                    </tr> */}

                    {updateData.note && (
                      <tr>
                        <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Note</td>
                        <td className=" py-2 px-1 border-bottom">{updateData.note}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1 me-3" onClick={() => editUser(updateData)}>
                    <CsLineIcons icon="edit" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisMember(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <hr className="my-4" />
              </div>
            )}
            {isSubscribing && (
              <form onSubmit={(e) => subscribeNow(e)}>
                <div className="mb-3">
                  <Form.Label>Membership type</Form.Label>
                  <Form.Select
                    type="text"
                    id="membershipTypeId"
                    name="membershipTypeId"
                    onChange={(e) => handlSubscription(e)}
                    value={subscriptionData.membershipTypeId}
                  >
                    <option value={0} disabled>
                      Select membership type
                    </option>
                    {membershipsData.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <Form.Label>Campaign</Form.Label>
                  <Form.Control type="text" name="campaignCode" onChange={(e) => handlSubscription(e)} value={subscriptionData.campaignCode} />
                </div>
                <div className="border-0 mt-3 mb-5">
                  <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100">
                    <span>Subscribe member</span>
                  </Button>
                </div>
              </form>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* User Detail Modal End */}

      <Modal size="xl" className="modal-center scroll-out-negative" show={bookingModal} onHide={() => setBookingModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">Booking History</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            <div>
              {myBookings.length ? (
                <Row className="mt-5">
                  {myBookings.map((item) => (
                    <Col xs="12" md="4" key={item.id} className="mb-3">
                      <Card className="mb-2">
                        <Card.Body className="px-3 py-3">
                          <table className="w-full">
                            <tbody>
                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">Type :</td>
                                <td className="text-capitalize text-alternate border-bottom py-2">{item.type}</td>
                              </tr>
                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">name :</td>
                                <td className="text-alternate border-bottom py-2">{item.member.name}</td>
                              </tr>
                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">Date :</td>
                                <td className="text-alternate border-bottom py-2">
                                  <span>{moment(item.startDate).format('ll')}</span>
                                </td>
                              </tr>
                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">Time :</td>
                                <td className="text-alternate text-alternate border-bottom py-2">
                                  <span>{item.startTime}</span>
                                </td>
                              </tr>

                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">Plan :</td>
                                <td className="text-capitalize text-alternate border-bottom py-2">{item.plan.toLowerCase()}</td>
                              </tr>
                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">Payment Status :</td>
                                <td className="text-capitalize text-alternate border-bottom py-2"> {item.paymentStatus.toLowerCase()}</td>
                              </tr>

                              <tr className="">
                                <td className="text-muted  text-uppercase border-bottom py-2">Status :</td>
                                <td className="text-capitalize text-alternate border-bottom py-2"> {item.status.toLowerCase()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="p-4 text-center">No booking available</div>
              )}
            </div>
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserManagementList;
