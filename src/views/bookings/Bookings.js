/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useState, useRef, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Pagination, Tooltip, OverlayTrigger, Modal, Spinner } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
// import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectSearch from 'react-select-search';
import Fuse from 'fuse.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import CsvDownloader from 'react-csv-downloader';
import { useReactToPrint } from 'react-to-print';
import {
  addBooking,
  getBooking,
  getBookings,
  updateBooking,
  checkinBooking,
  checkoutBooking,
  getPaymentStatusTypes,
  getPlanTypes,
  addEventBooking,
  getbookedseats,
  // eslint-disable-next-line import/extensions
} from '../../bookings/bookingSlice';
import { getMembers, getMember } from '../../members/memberSlice';
import { getBranches } from '../../branches/branchSlice';

const ComponentToPrint = forwardRef((props, ref) => {
  const bookingsData = useSelector((state) => state.bookings.items);
  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <table align="left" border="1" cellSpacing="5" cellPadding="15" style={{ border: '1px solid #ccc' }}>
        <thead className="">
          <tr align="left">
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium">Type</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium">Name</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Date</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Branch</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Plan</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Amount</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Payment status</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Booking status</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookingsData.map((item) => (
            <tr key={item.id} className="mb-2">
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate ">{item.type}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">
                  <span>{item.member.name}</span>
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">{moment(item.startDate).format('ll')}</div>
              </td>

              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{`${item.branch}`}</div>
              </td>

              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.plan}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.amountPaid}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.paymentStatus}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.status}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const BookingTypeList = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [isLoading, setisloading] = React.useState(false);
  const title = 'Bookings ';
  const description = 'Bookings Page';
  const [bookingModal, setBookingModal] = useState(false);
  const bookingsData = useSelector((state) => state.bookings.items);
  const branchesData = useSelector((state) => state.branches.branches).map((item) => {
    return {
      value: item.id,
      name: item.name,
      seats: item.seats,
    };
  });
  const [datas, setDatas] = useState([]);
  const [seatData, setSeatData] = React.useState(0);
  const [isEvent, setIsEvent] = React.useState(false);
  const [type, setType] = useState('');
  const [eventData, setEventData] = React.useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    amountDue: '',
    branchId: '',
    startTime: '',
    planType: '',
    startDate: null,
    paymentStatus: '',
  });
  const membersData = useSelector((state) => state.members.items).map((item) => {
    const fullname = `${item.firstName} ${item.lastName}`;
    const data = { value: item.id, name: fullname, branch: item.branch, branchId: item.branchId };
    return data;
  });
  const [usedSeats, setUsedSeats] = React.useState(0);
  const status = useSelector((state) => state.bookings.status);
  const initialValues = {
    seats: 0,
    memberId: '',
    branchId: '',
    planType: '',
    startDate: null,
    paymentStatus: '',
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate] = useState(null);
  const [planTypes, setPlanTypes] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [fromDate] = useState(null);
  const [toDate] = useState(null);
  const [startTimeFrom, setstartTimeFrom] = useState(null);
  const [startTimeTo, setstartTimeTo] = useState(null);
  const [, setEndDateFrom] = useState(null);
  const [, setEndDateTo] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [branchId, setBranchId] = useState(null);
  const [, setUpdate] = useState(null);
  const [isShowingSeats, setIsShowingSeats] = useState(null);
  React.useEffect(() => {
    dispatch(getBookings(page, search));
    dispatch(getMembers(page, search, 50));
    dispatch(getBranches(page, search, 50));
    dispatch(getPaymentStatusTypes()).then((res) => {
      setPaymentTypes(res.data);
    });
    dispatch(getPlanTypes()).then((res) => {
      setPlanTypes(res.data);
    });
  }, [dispatch, page, search]);

  function nextPage() {
    if (bookingsData.length < 15) return;
    setPage(page + 1);
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    startDate: Yup.string().required('Start date is required'),
    memberId: Yup.string().required('Member is required'),

    planType: Yup.string().required('Plan type is required'),
    paymentStatus: Yup.string().required('Payment status is required'),
    seats: Yup.number().required('Seats is required'),
  });

  const toggleModal = () => {
    setBookingModal(!bookingModal);
  };

  const onSubmit = (values) => {
    setisloading(true);
    values.startDate = moment(values.startDate).format('YYYY-MM-DD');
    dispatch(addBooking(values));
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  function addNewBooking() {
    setIsViewing(false);
    setIsEditing(false);
    setIsEvent(false);
    setIsAdding(true);
    toggleModal();
  }

  function addEvent() {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(false);
    setIsEvent(true);
    toggleModal();
  }

  function viewBooking(val) {
    dispatch(getBooking(val.id)).then((res) => {
      setIsAdding(false);
      setIsEditing(false);
      setIsEvent(false);
      setUpdateData(res.data);
      setIsViewing(true);
      toggleModal();
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
    if (status === 'success') {
      setBookingModal(false);
      setIsShowingSeats(false);
      setisloading(false);
      values.seats = 0;
      values.memberId = '';
      values.branchId = '';
      values.planType = '';
      values.startDate = null;
      values.paymentStatus = '';
      setStartDate(null);
    }
    if (status === 'update') {
      setisloading(false);
      dispatch(getBookings(1, ''));
      setBookingModal(false);
      setIsShowingSeats(false);
      setUpdateData({
        name: '',
        amount: '',
        validityPeriod: 0,
        validityPeriodTypeId: 1,
        description: '',
      });
    }
    if (status === 'error') {
      setisloading(false);
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
    setisloading(true);
    dispatch(updateBooking(updateData));
  }
  function handleEventChange(e) {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  }
  function handleEventData(e) {
    setisloading(true);
    e.preventDefault();
    setisloading(true);

    eventData.startDate = moment(eventData.startDate).format('YYYY-MM-DD');
    eventData.planType = 1;
    dispatch(addEventBooking(eventData));
  }

  function setBranch(val) {
    values.branchId = val;
    const newseats = branchesData.find((item) => item.value == val);
    setSeatData(newseats.seats);
    values.seats = 0;
  }
  function setMember(val) {
    values.memberId = val;
  }

  function similarDate(date) {
    const today = moment(new Date());
    const varDate = moment(date);
    const val = today.isSame(varDate, 'date');

    return val;
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    currencyDisplay: "narrowSymbol",
  });
  // function afterDate(date) {
  //   const today = moment(new Date());
  //   const varDate = moment(date);
  //   const val = today.isAfter(varDate, 'date');

  //   return val;
  // }
  function handleChecking(id, stat) {
    if (stat === 'clockOut') {
      dispatch(checkoutBooking(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Checked out successful');
          dispatch(getBooking(updateData.id)).then((resp) => {
            setUpdateData(resp.data);
          });
        }
      });
    } else {
      dispatch(checkinBooking(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Checked in successful');
          dispatch(getBooking(updateData.id)).then((resp) => {
            setUpdateData(resp.data);
          });
        }
      });
    }
  }

  React.useEffect(() => {
    const newdata = bookingsData.map((item) => {
      return {
        cell1: item.id,
        cell2: item.member.id,
        cell3: item.member.name,
        cell4: `${item.branch}`,
        cell5: item.startDate,
        cell6: item.paymentStatus,
        cell7: formatter.format(item.amountPaid),
        cell9: item.seatCount,

        cell10: item.plan,
        cell11: item.type,
        cell12: item.status,
        cell13: moment(item.dateCreated).format('llll'),
      };
    });
    setDatas(newdata);
  }, [bookingsData]);

  const columns = [
    {
      id: 'cell1',
      displayName: 'BOOKINGID',
    },
    {
      id: 'cell2',
      displayName: 'MEMBERID',
    },
    {
      id: 'cell3',
      displayName: 'NAME',
    },
    {
      id: 'cell4',
      displayName: 'BRANCH',
    },
    {
      id: 'cell5',
      displayName: 'START-DATE',
    },
    {
      id: 'cell6',
      displayName: 'PAYMENT-STATUS',
    },
    {
      id: 'cell7',
      displayName: 'AMOUNT',
    },

    {
      id: 'cell9',
      displayName: 'SEATS',
    },
    {
      id: 'cell10',
      displayName: 'PLAN',
    },
    {
      id: 'cell11',
      displayName: 'TYPE',
    },
    {
      id: 'cell12',
      displayName: 'STATUS',
    },
    {
      id: 'cell13',
      displayName: 'DATE CREATED',
    },
  ];

  function handleMember(val) {
    setMember(val);
    dispatch(getMember(val)).then((res) => {
      values.branchId = res.data.branchId;
      setBranch(res.data.branchId);
      setUpdate(val);
    });
  }
  React.useEffect(() => {
    if (fromDate && toDate) {
      dispatch(getBookings(page, search, moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD')));
      return;
    }
    dispatch(getBookings(page, search));
  }, [fromDate, toDate]);

  React.useEffect(() => {
    dispatch(getBookings(page, search, moment(startTimeFrom).format('YYYY-MM-DD'), moment(startTimeTo).format('YYYY-MM-DD'), memberId, branchId, type));
  }, [memberId, branchId, startTimeFrom, startTimeTo, type]);

  function resetFilter() {
    setstartTimeFrom(null);
    setstartTimeTo(null);
    setEndDateFrom(null);
    setEndDateTo(null);
    setMemberId(null);
    setBranchId(null);
    setIsShowingSeats(false);
    setType('');
  }
  function getBookedSeats() {
    const data = {
      branchId: values.branchId,
      fromDate: moment(values.startDate).format('YYYY-MM-DD'),
      toDate: null,
    };

    if (Number(values.planType) === 1) {
      data.toDate = moment(values.startDate).add().format('YYYY-MM-DD');
    }
    if (Number(values.planType) === 2) {
      data.toDate = moment(values.startDate).add(7, 'days').format('YYYY-MM-DD');
    }
    if (Number(values.planType) === 3) {
      data.toDate = moment(values.startDate).add(30, 'days').format('YYYY-MM-DD');
    }

    dispatch(getbookedseats(data)).then((res) => {
      const sum = res.data
        .map((i) => i.seats)
        .sort()
        .pop();
      setUsedSeats(sum);
      setIsShowingSeats(true);
    });
  }

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <div style={{ display: 'none' }}>
          <ComponentToPrint ref={componentRef} />
        </div>

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

      <Row className="mb-4">
        <Col xs="7" md="6" lg="6" xxl="6" className="mb-1 d-flex align-items-center ">
          <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start w-100 w-md-auto mb-1 me-3" onClick={() => addNewBooking()}>
            <CsLineIcons icon="plus" size="12" /> <span className="">Add booking</span>
          </Button>
          <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start w-100 w-md-auto mb-1 " onClick={() => addEvent()}>
            <CsLineIcons icon="plus" size="12" /> <span className="">Add event</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col xs="5" md="6" lg="6" xxl="6" className="mb-1  d-flex justify-content-end align-items-center">
          {/* Export Dropdown Start */}

          <div>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option disabled value="">
                Filter by type{' '}
              </option>
              <option value="">Both</option>
              <option value={1}>Coworking </option>
              <option value={2}>Event </option>
            </Form.Select>
          </div>
          <Dropdown align={{ xs: 'end' }} className="d-none d-md-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export </Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsLineIcons icon="download" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">
                {' '}
                <CsvDownloader filename="bookings" extension=".csv" separator="," wrapColumnChar="" columns={columns} datas={datas}>
                  Export csv
                </CsvDownloader>
              </Dropdown.Item>
              <Dropdown.Item onClick={handlePrint}>Export pdf</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {/* Export Dropdown End */}

          {/* Length Start */}
          <Dropdown align={{ xs: 'end' }} className="d-none d-md-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Item Count</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
                {bookingsData.length} Items
              </Dropdown.Toggle>
            </OverlayTrigger>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>
      {/* Date filter starts   */}
      <Row className="mb-4 justify-content-between mb-2 mb-lg-1">
        <Col xs="12" md="5" className="mb-2 mb-md:0">
          <div className="d-flex align-items-center gap-1">
            <DatePicker
              className="border rounded-sm px-2 px-lg-3 py-2 py-lg-2 text-muted me-2 w-100"
              selected={startTimeFrom}
              onChange={(date) => setstartTimeFrom(date)}
              selectsStart
              startDate={startTimeFrom}
              endDate={startTimeTo}
              isClearable
              placeholderText="Start Date From"
            />

            <DatePicker
              selected={startTimeTo}
              onChange={(date) => setstartTimeTo(date)}
              selectsEnd
              startDate={startTimeFrom}
              endDate={startTimeTo}
              minDate={startTimeFrom}
              isClearable
              placeholderText="Start Date To"
              className="border rounded-sm px-2 px-lg-3 py-2 py-lg-2 text-muted me-2 w-100"
            />
          </div>
        </Col>
        <Col xs="12" md="5">
          <div className="d-flex align-items-center gap-1">
            <SelectSearch
              filterOptions={() => fuzzySearch(membersData)}
              options={membersData}
              search
              name="members"
              value={memberId}
              onChange={(val) => setMemberId(val)}
              placeholder="Filter by  member"
            />

            <SelectSearch
              filterOptions={() => fuzzySearch(branchesData)}
              options={branchesData}
              search
              name="branchId"
              value={branchId}
              placeholder="Filter by  branch"
              onChange={(val) => setBranchId(val)}
            />
          </div>
        </Col>
        <Col xs="4" md="2" className="d-flex align-items-center justify-content-center mt-3 mt-md-0">
          <span onClick={() => resetFilter()} className="cursor-pointer d-flex align-items-center">
            <span className="me-1">Reset filter</span> <CsLineIcons icon="refresh-horizontal" size="13" />
          </span>
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-none ps-5 pe-5 mb-2 custom-sort">
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>

        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DATE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">PLAN</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">PAID STATUS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">AMOUNT</div>
        </Col>

        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      <Row className="mt-5">
        {bookingsData.map((item) => (
          <Col xs="12" md="6" lg="4" key={item.id} className="mb-3">
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
                      <td className="text-muted  text-uppercase border-bottom py-2">Amount :</td>
                      <td className="text-alternate text-alternate border-bottom py-2">
                        <span>{formatter.format(item.amountPaid)}</span>
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

                <div className="d-flex  justify-content-end align-items-md-center mt-2">
                  <Button variant="primary" type="button" size="sm" onClick={() => viewBooking(item)} className="">
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* List Items End */}

      {/* Pagination Start */}
      {bookingsData.length ? (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={bookingsData.length < 15}>
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
            {isEvent && 'Event Booking'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
              <form onSubmit={handleSubmit}>
                <p className="text-medium mb-3 text-primary">Fields with (*) are required</p>
                <div className="mb-3">
                  <Form.Label>
                    Member <span className="text-danger">*</span>
                  </Form.Label>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(membersData)}
                    options={membersData}
                    search
                    name="members"
                    value={values.memberId}
                    onChange={(val) => handleMember(val)}
                    placeholder="Select  member"
                  />

                  {errors.memberId && touched.memberId && <div className="d-block invalid-tooltip">{errors.memberId}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>
                    Branch <span className="text-danger">*</span>
                  </Form.Label>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(branchesData)}
                    options={branchesData}
                    search
                    name="branch"
                    value={values.branchId}
                    placeholder="Select  branch"
                    onChange={(val) => setBranch(val)}
                  />

                  {errors.branchId && touched.branchId && <div className="d-block invalid-tooltip">{errors.branchId}</div>}
                </div>

                <Row>
                  <Col md="12">
                    <div className="mb-3">
                      <Form.Label>Start Date</Form.Label>

                      <div className="d-flex justify-content-between align-items-center w-100">
                        <DatePicker
                          className="border rounded-sm px-2 py-1 w-100"
                          selected={startDate}
                          onChange={(date) => {
                            values.startDate = date;
                            setStartDate(date);
                          }}
                          selectsStart
                          startDate={startDate}
                          minDate={new Date()}
                          endDate={endDate}
                          placeholderText="Select a date"
                        />
                      </div>
                      {errors.startDate && touched.startDate && <div className="d-block invalid-tooltip">{errors.startDate}</div>}
                    </div>
                  </Col>
                </Row>
                <div className="mb-3">
                  <Form.Label>Plan type</Form.Label>
                  <Form.Select type="text" name="planType" onChange={handleChange} value={values.planType}>
                    <option value="" disabled>
                      Select plan
                    </option>
                    {planTypes.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <div className="d-flex justify-content-end mb-5">
                  {' '}
                  <Button type="button" size="sm" variant="outline-primary" onClick={() => getBookedSeats()}>
                    Check seats
                  </Button>
                </div>
                {isShowingSeats && (
                  <>
                    <div className="mb-3">
                      <Form.Label className="mb-0">Select seat(s)</Form.Label>
                      <div className="text-medium text-muted">{`Maximum seats : ${seatData}`}</div>
                      <div className="text-medium text-muted">{`Available seats : ${seatData - usedSeats}`}</div>

                      <div className="d-flex align-items-center">
                        {' '}
                        <input
                          disabled={!seatData}
                          type="range"
                          required
                          min="0"
                          max={seatData - usedSeats}
                          name="seats"
                          onChange={handleChange}
                          value={values.seats}
                        />
                        <div className="me-3 px-3 py-2">{values.seats}</div>
                      </div>
                      {errors.seats && touched.seats && <div className="d-block invalid-tooltip">{errors.seats}</div>}
                    </div>
                    <div className="mb-3">
                      <Form.Label>Payment status</Form.Label>
                      <Form.Select type="text" name="paymentStatus" onChange={handleChange} value={values.paymentStatus}>
                        <option value="" disabled>
                          Select type
                        </option>
                        {paymentTypes.map((item) => (
                          <option value={Number(item.id)} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>

                    <Button variant="primary" type="submit" disabled={isLoading} className="btn-icon btn-icon-start w-100">
                      {!isLoading ? (
                        'Submit'
                      ) : (
                        <Spinner animation="border" role="status" size="sm">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      )}
                    </Button>
                  </>
                )}
              </form>
            )}
            {isEvent && (
              <form onSubmit={(e) => handleEventData(e)}>
                <div className="mb-3">
                  <Form.Label>First name</Form.Label>
                  <Form.Control required type="text" name="firstName" onChange={(e) => handleEventChange(e)} value={eventData.firstName} />
                </div>

                <div className="mb-3">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control required type="text" id="lastName" name="lastName" onChange={(e) => handleEventChange(e)} value={eventData.lastName} />
                </div>

                <div className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control required type="email" id="email" name="email" onChange={(e) => handleEventChange(e)} value={eventData.email} />
                </div>
                <div className="mb-3">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    required
                    type="number"
                    id="phoneNumber"
                    name="phoneNumber"
                    onChange={(e) => handleEventChange(e)}
                    value={eventData.phoneNumber}
                  />
                </div>
                <div className="mb-3">
                  <Form.Label>Amount due</Form.Label>
                  <Form.Control required type="number" id="amountDue" name="amountDue" onChange={(e) => handleEventChange(e)} value={eventData.amountDue} />
                </div>

                <div className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <SelectSearch
                    required
                    filterOptions={() => fuzzySearch(branchesData)}
                    options={branchesData}
                    search
                    name="branch"
                    value={eventData.branchId}
                    placeholder="Select  branch"
                    onChange={(val) => {
                      setBranch(val);
                      eventData.branchId = val;
                    }}
                  />
                </div>

                <Row>
                  <Col md="5">
                    <div className="mb-3">
                      <Form.Label>Start Date</Form.Label>

                      <div className="d-flex justify-content-between align-items-center">
                        <DatePicker
                          className="border rounded-sm px-2 py-1"
                          selected={startDate}
                          onChange={(date) => {
                            eventData.startTime = moment(date).format('hh:mm');
                            eventData.startDate = date;

                            setStartDate(date);
                          }}
                          selectsStart
                          startDate={startDate}
                          minDate={new Date()}
                          endDate={endDate}
                          required
                          placeholderText="Select a date"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="mb-3">
                  <Form.Label>Payment status</Form.Label>
                  <Form.Select required type="text" name="paymentStatus" onChange={(e) => handleEventChange(e)} value={eventData.paymentStatus}>
                    <option value="" disabled>
                      Select status
                    </option>
                    {paymentTypes.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <Button variant="primary" type="submit" disabled={isLoading} className="btn-icon btn-icon-start w-100">
                  {!isLoading ? (
                    'Submit'
                  ) : (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Button>
              </form>
            )}
            {isEditing && (
              <form onSubmit={(e) => handleUpdate(e)}>
                <div className="mb-3">
                  <Form.Label>Branch</Form.Label>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(branchesData)}
                    options={branchesData}
                    search
                    name="branch"
                    value={updateData.branchId}
                    placeholder="Select  branch"
                    onChange={(val) => {
                      setBranch(val);
                      updateData.branchId = val;
                    }}
                  />
                </div>

                <div className="mb-3">
                  <Form.Label className="mb-0">
                    Select seat(s) <span className="text-small"> (Member & branch required, {updateData.branchId && `max:${seatData}`})</span>
                  </Form.Label>

                  <div className="d-flex align-items-center">
                    {' '}
                    <Form.Range required min="0" max={seatData} name="seats" onChange={(e) => handleUpdateChange(e)} value={updateData.seats} />
                    <div className="me-3 px-3 py-2">{updateData.seats}</div>
                  </div>
                </div>

                <Row>
                  <Col md="5">
                    <div className="mb-3">
                      <Form.Label>Start Date</Form.Label>

                      <div className="d-flex justify-content-between align-items-center">
                        <DatePicker
                          className="border rounded-sm px-2 py-1"
                          selected={startDate}
                          onChange={(date) => {
                            values.startTime = moment(date).format('hh:mm');
                            values.startDate = date;
                            updateData.startTime = moment(date).format('hh:mm');
                            updateData.startDate = date;
                            setStartDate(date);
                          }}
                          selectsStart
                          startDate={startDate}
                          minDate={new Date()}
                          endDate={endDate}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="mb-3">
                  <Form.Label>Plan type</Form.Label>
                  <Form.Select type="text" name="planType" onChange={(e) => handleUpdateChange(e)} value={updateData.planType}>
                    <option value="" disabled>
                      Select plan
                    </option>
                    {planTypes.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <Form.Label>Payment status</Form.Label>
                  <Form.Select type="text" name="paymentStatus" onChange={(e) => handleUpdateChange(e)} value={updateData.paymentStatus}>
                    <option value="" disabled>
                      Select status
                    </option>
                    {paymentTypes.map((item) => (
                      <option value={Number(item.id)} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>

                <Button variant="primary" type="submit" disabled={isLoading} className="btn-icon btn-icon-start w-100">
                  {!isLoading ? (
                    'Submit'
                  ) : (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  )}
                </Button>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <table className="mb-5 w-100">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Member</td>
                      <td className=" py-2 border-bottom">{updateData.member.name}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Email</td>
                      <td className=" py-2 border-bottom">{updateData.member.email}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Phone</td>
                      <td className=" py-2 border-bottom">{updateData.member.phoneNumber}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom py-2 border-bottom text-uppercase text-muted"> Type</td>
                      <td className=" py-2 border-bottom">{updateData.type}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom py-2 border-bottom text-uppercase text-muted"> Branch</td>
                      <td className=" py-2 border-bottom">{updateData.branch}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom py-2 border-bottom text-uppercase text-muted"> Campaign</td>
                      <td className=" py-2 border-bottom text-capitalize">{updateData.campaign}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom py-2 border-bottom text-uppercase text-muted"> Plan</td>
                      <td className=" py-2 border-bottom">{updateData.plan}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom py-2 border-bottom text-uppercase text-muted"> Amount</td>
                      <td className=" py-2 border-bottom">{formatter.format(updateData.amountPaid)}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Start date </td>
                      <td className=" py-2 border-bottom">{moment(updateData.startDate).format('ll')}</td>
                    </tr>
                    {/* <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Start Time</td>
                      <td className=" py-2 border-bottom">{updateData.startTime}</td>
                    </tr> */}
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">End Date</td>
                      <td className=" py-2 border-bottom">{moment(updateData.endDate).format('ll')}</td>
                    </tr>
                    {/* <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">End time</td>
                      <td className=" py-2 border-bottom">{updateData.endTime}</td>
                    </tr> */}

                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Seat count</td>
                      <td className=" py-2 border-bottom">{updateData.seats}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">Payment status</td>
                      <td className=" py-2 border-bottom">{updateData.paymentStatus}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 border-bottom text-uppercase text-muted">status</td>
                      <td className=" py-2 border-bottom">{updateData.status}</td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <div className="text-center mt-5 ">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={!similarDate(updateData.startDate)}
                      className="btn-icon btn-icon-start text-primary me-4"
                      onClick={() => handleChecking(updateData.id, 'clockIn')}
                    >
                      Check in
                    </Button>

                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={!similarDate(updateData.endDate)}
                      className="btn-icon btn-icon-start text-primary"
                      onClick={() => handleChecking(updateData.id, 'clockOut')}
                    >
                      Check out
                    </Button>
                  </div>
                </div>
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
