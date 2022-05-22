/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Pagination, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import {
  addBooking,
  getBooking,
  getBookings,
  updateBooking,
  deleteBooking,

  // eslint-disable-next-line import/extensions
} from '../../bookings/bookingSlice';
import { getMembers } from '../../members/memberSlice';
import { getBranches, getBranch } from '../../branches/branchSlice';

const BookingTypeList = () => {
  const title = 'Bookings ';
  const description = 'Bookings Page';
  const [bookingModal, setBookingModal] = useState(false);
  const bookingsData = useSelector((state) => state.bookings.items);
  const branchesData = useSelector((state) => state.branches.branches).map((item) => {
    return {
      value: item.id,
      name: item.name,
    };
  });
  const [seatData, setSeatData] = React.useState([]);
  const membersData = useSelector((state) => state.members.items).map((item) => {
    const fullname = `${item.firstName} ${item.lastName}`;
    const data = { value: item.id, name: fullname };
    return data;
  });

  const status = useSelector((state) => state.bookings.status);
  const initialValues = {
    seatId: '',
    memberId: '',
    branchId: '',
    toTime: '',
    fromTime: '',
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});

  React.useEffect(() => {
    dispatch(getBookings(page, search));
    dispatch(getMembers(page, search, 50));
    dispatch(getBranches(page, search, 50));
  }, [dispatch, page, search]);

  function nextPage() {
    if (bookingsData.length / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    seatId: Yup.string().required('seatId is required'),
    fromTime: Yup.string().required('From Time  is required'),
    toTime: Yup.string().required('To Time is required'),
    memberId: Yup.string().required('MemberId is required'),
  });

  const toggleModal = () => {
    setBookingModal(!bookingModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addBooking(values));
    resetForm({ values: '' });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  // Retrieve seats
  React.useEffect(() => {
    if (!values.branchId) return;

    dispatch(getBranch(values.branchId)).then((res) => {
      if (res.status === 200) {
        setSeatData(res.data.seats);
      }
    });
    // setSeatData(newbranch.seats);
  }, [values]);

  function deleteThisBooking(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteBooking(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Booking removed');
          dispatch(getBookings(page, search));
          toggleModal();
          setIsAdding(false);
          setIsViewing(false);
          setIsEditing(false);
        }
      });
    }
  }

  function addNewBooking() {
    setIsAdding(true);
    setIsViewing(false);
    setIsEditing(false);

    toggleModal();
  }

  function editBooking(val) {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(true);

    setUpdateData(val);
    setStartDate(new Date(val.startDate));
    setEndDate(new Date(val.expiryDate));
  }

  function viewBooking(val) {
    dispatch(getBooking(val.id)).then((res) => {
      setIsAdding(false);
      setIsEditing(false);
      setUpdateData(res.data);
      setIsViewing(true);
    });

    toggleModal();
  }

  // highlight-starts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((nextValue) => setSearch(nextValue), 1000),
    []
  );
  // eslint-disable-next-line no-shadow
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

  // highlight-ends
  const handleSearch = (e) => {
    debouncedSave(e.target.value);
  };

  React.useEffect(() => {
    if (status === 'success') {
      setBookingModal(false);
    }
    if (status === 'update') {
      dispatch(getBookings(1, ''));
      setBookingModal(false);
      setUpdateData({
        name: '',
        amount: '',
        validityPeriod: 0,
        validityPeriodTypeId: 1,
        description: '',
      });
    }
  }, [status, dispatch]);

  function handleUpdateChange(e) {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  }
  function handleUpdate(e) {
    e.preventDefault();
    dispatch(updateBooking(updateData));
  }

  React.useEffect(() => {
    values.toTime = startDate;
    values.fromTime = endDate;
    updateData.toTime = startDate;
    updateData.fromTime = endDate;
  }, [startDate, endDate]);

  function setBranch(val) {
    values.branchId = val;
    dispatch(getBranch(val)).then((res) => {
      if (res.status === 200) {
        if (!res.data.seats.length) return;
        setSeatData(
          res.data.seats.map((item) => {
            return {
              value: item.id,
              name: item.name,
            };
          })
        );
      }
    });
  }
  function setMember(val) {
    values.memberId = val;
  }
  function setSeat(val) {
    values.seatId = val;
  }
  function handleChecking(data) {}

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
        </Row>
      </div>

      <Row className="mb-3">
        <Col md="5" lg="6" xxl="6" className="mb-1 d-flex align-items-center ">
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1 me-3" onClick={() => addNewBooking()}>
            <CsLineIcons icon="plus" /> <span>Add booking</span>
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
                {bookingsData.length} Items
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
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DookingId</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">MemberId</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Name</div>
        </Col>

        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">fromTime</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">toTime</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Status</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {bookingsData.map((item) => (
        <Card key={item.id} className="mb-2">
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              {/* <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <NavLink to="/bookings/detail" className="text-truncate h-100 d-flex align-items-center">
                  {item.id}
                </NavLink>
              </Col> */}
              <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">bookingId</div>
                <div className="text-alternate">{item.bookingId}</div>
              </Col>
              <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">memberId</div>
                <div className="text-alternate">{item.memberId}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">name</div>
                <div className="text-alternate">{item.name}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">fromTime</div>
                <div className="text-alternate">
                  <span>{moment(item.fromTime).format('ll')}</span>
                </div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">toTime</div>
                <div className="text-alternate">{moment(item.toTime).format('ll')}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.isActive ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>

              <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-2 text-end order-md-last">
                <span className="d-flex">
                  {' '}
                  <span onClick={() => viewBooking(item)} className="text-muted me-3 cursor-pointer">
                    View <CsLineIcons icon="eye" style={{ width: '12px', height: '12px' }} />
                  </span>
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* List Items End */}

      {/* Pagination Start */}
      {bookingsData.length ? (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={bookingsData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      ) : (
        ''
      )}
      {/* Pagination End */}
      {!bookingsData.length && <div className="text-center p-4 text-muted">No data available</div>}
      {/* Bookinge Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={bookingModal} onHide={() => setBookingModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new booking'}
            {isEditing && 'Update new booking'}
            {isViewing && 'Booking Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label>Member</Form.Label>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(membersData)}
                    options={membersData}
                    search
                    name="members"
                    value={values.memberId}
                    onChange={(val) => setMember(val)}
                    placeholder="Select  member"
                  />

                  {errors.memberId && touched.memberId && <div className="d-block invalid-tooltip">{errors.memberId}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(branchesData)}
                    options={branchesData}
                    search
                    name="branch"
                    value={values.branchId}
                    placeholder="Select  branch"
                    onChange={(val) => setBranch(val)}
                  />

                  {errors.memberId && touched.memberId && <div className="d-block invalid-tooltip">{errors.memberId}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Select seat</Form.Label>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(seatData)}
                    options={seatData}
                    search
                    name="seat"
                    value={values.seatId}
                    placeholder="Select seat"
                    onChange={(val) => setSeat(val)}
                  />

                  {errors.seatId && touched.seatId && <div className="d-block invalid-tooltip">{errors.seatId}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Duration</Form.Label>

                  <div className="d-flex justify-content-between align-items-center">
                    <DatePicker
                      className="border rounded px-2 py-1"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                    />

                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                  {errors.startDate && touched.startDate && <div className="d-block invalid-tooltip">{errors.startDate}</div>}
                </div>

                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            )}
            {isEditing && (
              <form onSubmit={(e) => handleUpdate(e)}>
                <div className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" name="code" onChange={(e) => handleUpdateChange(e)} value={updateData.code} />
                </div>

                <div className="mb-3">
                  <Form.Label>Value</Form.Label>
                  <Form.Control type="text" name="value" onChange={(e) => handleUpdateChange(e)} value={updateData.value} />
                </div>
                <div className="mb-3">
                  <Form.Label>Total usage</Form.Label>
                  <Form.Control type="text" name="totalUsage" onChange={(e) => handleUpdateChange(e)} value={updateData.totalUsage} />
                </div>

                <div className="mb-3">
                  <Form.Label>Usage per-user </Form.Label>
                  <Form.Control type="text" name="usagePerUser" onChange={(e) => handleUpdateChange(e)} value={updateData.usagePerUser} />
                </div>

                <div className="mb-3">
                  <Form.Label>Duration</Form.Label>

                  <div className="d-flex justify-content-between align-items-center">
                    <DatePicker
                      className="border rounded px-2 py-1"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                    />

                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
                </div>

                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <table className="mb-5">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Booking Id</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.bookingId}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Member Id</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.memberId}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">name</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.name}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">from Time </td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.fromTime).format('ll')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">to Time</td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.toTime).format('ll')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">clock-In Time </td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.clockInTime).format('ll')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">clock-Out Time</td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.clockOutTime).format('ll')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">image</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.image}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">seat</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.seat}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">branch</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.branch}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">status</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1 me-3" onClick={() => editBooking(updateData)}>
                    <CsLineIcons icon="edit" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisBooking(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Delete</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => handleChecking(updateData)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Check in</span>
                  </Button>
                </div>
                <hr className="my-4" />
              </div>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Bookinge Detail Modal End */}
    </>
  );
};

export default BookingTypeList;
