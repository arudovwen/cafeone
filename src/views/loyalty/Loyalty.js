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
  addCampaign,
  getCampaign,
  getCampaigns,
  updateCampaign,
  activateCampaign,
  deactivateCampaign,
  deleteCampaign,

  // eslint-disable-next-line import/extensions
} from '../../campaigns/campaignSlice';
import { getMembers } from '../../members/memberSlice';

const CampaignTypeList = () => {
  const title = 'Campaigns ';
  const description = 'Campaigns Page';
  const [campaignModal, setCampaignModal] = useState(false);
  const campaignsData = useSelector((state) => state.campaigns.items);
  const status = useSelector((state) => state.campaigns.status);
  const initialValues = {
    code: '',
    description: '',
    value: '',
    totalUsage: '',
    usagePerUser: '',
    startDate: '',
    expiryDate: '',
    members: [],
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [startDateFrom, setstartDateFrom] = useState(null);
  const [startDateTo, setstartDateTo] = useState(null);
  const [expiryDateFrom, setExpiryDateFrom] = useState(null);
  const [expiryDateTo, setExpiryDateTo] = useState(null);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [members, setmembers] = useState([]);

  React.useEffect(() => {
    dispatch(getCampaigns(page, search));
    dispatch(getMembers(page, search, 50));
  }, [dispatch, page, search]);
  const usersData = useSelector((state) => state.members.items).map((item) => {
    const fullname = `${item.firstName} ${item.lastName}`;
    const data = { value: item.id, name: fullname };
    return data;
  });

  function nextPage() {
    if (campaignsData.length / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    code: Yup.string().required('name is required'),
    value: Yup.string().required('value  is required'),
    startDate: Yup.string().required('startDate is required'),
    expiryDate: Yup.string().required('expiryDate is required'),
    totalUsage: Yup.string().required('Total Usage is required'),
    usagePerUser: Yup.string().required('UsagePerUser is required'),
  });

  const toggleModal = () => {
    setCampaignModal(!campaignModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addCampaign(values));
    resetForm({ values: '' });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  function deleteThisCampaign(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteCampaign(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Campaign removed');
          dispatch(getCampaigns(page, search));
          toggleModal();
          setIsAdding(false);
          setIsViewing(false);
          setIsEditing(false);
        }
      });
    }
  }

  function toggleStatus(e, id) {
    const value = e.target.checked;
    if (!value) {
      dispatch(deactivateCampaign(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getCampaigns(page, search));
        }
      });
    }
    if (value) {
      dispatch(activateCampaign(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getCampaigns(page, search));
        }
      });
    }
  }
  function addNewCampaign() {
    setIsAdding(true);
    setIsViewing(false);
    setIsEditing(false);

    toggleModal();
  }

  function editCampaign(val) {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(true);

    setUpdateData(val);
    setStartDate(new Date(val.startDate));
    setEndDate(new Date(val.expiryDate));
    values.member = [...val.members.map((item) => item.userId)];

    const fullmembers = val.members.map((item) => {
      const user = usersData.find((v) => Number(v.value) === Number(item.userId));

      return {
        name: user.name,
        id: user.value,
      };
    });

    setmembers(fullmembers);
  }

  function viewCampaign(val) {
    dispatch(getCampaign(val.id)).then((res) => {
      setIsAdding(false);
      setIsEditing(false);
      res.data.members = res.data.users;
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

  function addMember(val) {
    if (values.members.includes(val)) return;

    values.members.push(val);
    const user = usersData.find((item) => Number(item.value) === Number(val));

    const userarr = [user, ...members];
    setmembers(userarr);
  }
  function removeMember(id, index) {
    values.members.splice(index, 1);
    setmembers(members.filter((item) => item.value !== id));
  }
  // highlight-ends
  const handleSearch = (e) => {
    debouncedSave(e.target.value);
  };

  React.useEffect(() => {
    if (status === 'success') {
      setCampaignModal(false);
    }
    if (status === 'update') {
      dispatch(getCampaigns(1, ''));
      setCampaignModal(false);
      setUpdateData({
        name: '',
        amount: '',
        validityPeriod: 0,
        validityPeriodTypeId: 1,
        description: '',
      });
    }
  }, [status, dispatch]);
  function selectAllMembers(e) {
    if (e.target.checked) {
      const users = usersData.map((item) => item.value);
      values.members = [...users];
      setmembers([...usersData]);
      return;
    }

    values.members = [];
    setmembers([]);
  }
  function handleUpdateChange(e) {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  }
  function handleUpdate(e) {
    e.preventDefault();
    dispatch(updateCampaign(updateData));
  }

  React.useEffect(() => {
    values.startDate = startDate;
    values.expiryDate = endDate;
    updateData.startDate = startDate;
    updateData.expiryDate = endDate;
    return () => {};
  }, [startDate, endDate]);

  React.useEffect(() => {
    if (startDateFrom && startDateTo) {
      dispatch(getCampaigns(1, '', moment(startDateFrom).format('YYYY-MM-DD'), moment(startDateTo).format('YYYY-MM-DD')));
      return;
    }
    if (expiryDateFrom && expiryDateTo) {
      dispatch(getCampaigns(page, '', null, null, moment(expiryDateFrom).format('YYYY-MM-DD'), moment(expiryDateTo).format('YYYY-MM-DD')));
      return;
    }

    dispatch(getCampaigns(1, ''));
  }, [startDateFrom, startDateTo, expiryDateFrom, expiryDateTo]);

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
        <Col md="5" lg="7" xxl="6" className="mb-1 d-flex align-items-center ">
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewCampaign()}>
            <CsLineIcons icon="plus" /> <span>Add campaign</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="5" xxl="6" className="mb-1 text-end">
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
                {campaignsData.length} Items
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
      {/* Date filter starts   */}
      <Row className="mb-4 justify-content-between mb-2 mb-lg-1">
        <Col xs="12" md="5" className="mb-2 mb-md:0">
          <div className="d-flex justify-content-between align-items-center">
            <DatePicker
              className="border rounded  px-2 px-lg-3 py-1 py-lg-2 text-muted"
              selected={startDateFrom}
              onChange={(date) => setstartDateFrom(date)}
              selectsStart
              startDate={startDateFrom}
              endDate={startDateTo}
              isClearable
              placeholderText="Start Date From"
            />

            <DatePicker
              selected={startDateTo}
              onChange={(date) => setstartDateTo(date)}
              selectsEnd
              startDate={startDateFrom}
              endDate={startDateTo}
              minDate={startDateFrom}
              isClearable
              placeholderText="Start Date To"
              className="border rounded px-2 px-lg-3 py-1 py-lg-2 text-muted"
            />
          </div>
        </Col>
        <Col xs="12" md="5">
          <div className="d-flex justify-content-between align-items-center">
            <DatePicker
              className="border rounded  px-2 px-lg-3 py-1 py-lg-2 text-muted"
              selected={expiryDateFrom}
              onChange={(date) => setExpiryDateFrom(date)}
              selectsStart
              startDate={expiryDateFrom}
              endDate={expiryDateTo}
              isClearable
              placeholderText="Expiry Date From"
            />

            <DatePicker
              selected={expiryDateTo}
              onChange={(date) => setExpiryDateTo(date)}
              selectsEnd
              startDate={expiryDateFrom}
              endDate={expiryDateTo}
              minDate={expiryDateFrom}
              isClearable
              placeholderText="Expiry Date To"
              className="border rounded  px-2 px-lg-3 py-1 py-lg-2 text-muted"
            />
          </div>
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">CODE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">START DATE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">END DATE</div>
        </Col>

        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">TOTAL USAGE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">TOGGLE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {campaignsData.map((item) => (
        <Card key={item.id} className="mb-2">
          <Card.Body className="pt-0 pb-0 sh-25 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              {/* <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <NavLink to="/campaigns/detail" className="text-truncate h-100 d-flex align-items-center">
                  {item.id}
                </NavLink>
              </Col> */}
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1">
                <div className="text-muted text-small d-md-none">Code</div>
                <div className="text-alternate">{item.code}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-2">
                <div className="text-muted text-small d-md-none">Start Date</div>
                <div className="text-alternate">
                  <span>{moment(item.startDate).format('DD-MMM-YYYY hh:mm')}</span>
                </div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-3">
                <div className="text-muted text-small d-md-none">End date</div>
                <div className="text-alternate">{moment(item.expiryDate).format('DD-MMM-YYYY hh:mm')}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-6 order-md-4">
                <div className="text-muted text-small d-md-none">Total usage</div>
                <div className="text-alternate">{item.totalUsage}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-6">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.isActive ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>

              <Col xs="6" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-4 order-md-5">
                <div className="text-muted text-small d-md-none">Toggle Status</div>
                <Form.Switch
                  className="form-check ps-md-2"
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => {
                    toggleStatus(e, item.id);
                  }}
                />
              </Col>
              <Col xs="6" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-last text-end order-md-last">
                <span className="d-flex">
                  {' '}
                  <Button variant="primary" type="button" size="sm" onClick={() => viewCampaign(item)} className="">
                    View
                  </Button>
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* List Items End */}

      {/* Pagination Start */}
      {campaignsData.length ? (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={campaignsData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      ) : (
        ''
      )}
      {/* Pagination End */}
      {!campaignsData.length && <div className="text-center p-4 text-muted">No data available</div>}
      {/* Campaigne Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={campaignModal} onHide={() => setCampaignModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new campaign'}
            {isEditing && 'Update new campaign'}
            {isViewing && 'Campaign Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" name="code" onChange={handleChange} value={values.code} />
                  {errors.code && touched.code && <div className="d-block invalid-tooltip">{errors.code}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Percentage Value (%)</Form.Label>
                  <Form.Control type="text" name="value" onChange={handleChange} value={values.value} />
                  {errors.value && touched.value && <div className="d-block invalid-tooltip">{errors.value}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>Total usage</Form.Label>
                  <Form.Control type="text" name="totalUsage" onChange={handleChange} value={values.totalUsage} />
                  {errors.totalUsage && touched.totalUsage && <div className="d-block invalid-tooltip">{errors.totalUsage}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Usage per-user </Form.Label>
                  <Form.Control type="text" name="usagePerUser" onChange={handleChange} value={values.usagePerUser} />
                  {errors.usagePerUser && touched.usagePerUser && <div className="d-block invalid-tooltip">{errors.usagePerUser}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Duration</Form.Label>

                  <div className="d-flex justify-content-between align-items-center">
                    <DatePicker
                      className="border rounded px-2 py-1 text-muted"
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
                      className="border rounded px-2 py-1 text-muted"
                    />
                  </div>
                  {errors.startDate && touched.startDate && <div className="d-block invalid-tooltip">{errors.startDate}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={handleChange} value={values.description} />
                  {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                </div>

                <div>
                  <h6>Select members</h6>
                  <SelectSearch
                    filterOptions={() => fuzzySearch(usersData)}
                    options={usersData}
                    search
                    name="members"
                    onChange={(e) => addMember(e)}
                    placeholder="Select campaign members"
                  />
                  <div className="py-2">
                    <label className="d-flex align-items-center">
                      <input type="checkbox" onChange={(e) => selectAllMembers(e)} className=" me-2" />
                      Select all members
                    </label>
                  </div>
                  <Row className="rounded p-2 mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {members.length
                      ? members.map((item, index) => (
                          <Col xs="12" key={item.value}>
                            <p className="py-1 px-2 mb-0  d-flex justify-content-between">
                              {' '}
                              <span> {item.name}</span>{' '}
                              <span className="cursor-pointer" onClick={() => removeMember(item.value, index)}>
                                x
                              </span>
                            </p>
                          </Col>
                        ))
                      : ''}
                  </Row>
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
                  <Form.Label>Percentage Value (%)</Form.Label>
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
                      className="border rounded px-2 py-1 text-muted"
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
                      className="border rounded px-2 py-1 text-muted"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
                </div>

                <div>
                  <h6>Select members</h6>
                  <SelectSearch
                    options={usersData}
                    filterOptions={() => fuzzySearch(usersData)}
                    search
                    name="members"
                    onChange={(e) => addMember(e)}
                    placeholder="Select campaign members"
                  />
                  <Row className="border rounded p-2 mt-3">
                    {members.length
                      ? members.map((item, index) => (
                          <Col xs="12" key={index}>
                            <p className="py-1 px-2 mb-0 d-flex justify-content-between">
                              {' '}
                              <span> {item.name}</span>{' '}
                              <span className="cursor-pointer" onClick={() => removeMember(item.value, index)}>
                                x
                              </span>
                            </p>
                          </Col>
                        ))
                      : ''}
                  </Row>
                </div>
                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <table className="mb-5 w-100">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Code</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.code}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Description</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.description}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Todal usage</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.totalUsage}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Usage per user</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.usagePerUser}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Start date </td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.startDate).format('DD-MMM-YYYY hh:mm')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Expiry date</td>
                      <td className=" py-2 px-1 border-bottom">{moment(updateData.expiryDate).format('DD-MMM-YYYY hh:mm')}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Percentage Value (%)</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.value}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">status</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1 me-3" onClick={() => editCampaign(updateData)}>
                    <CsLineIcons icon="edit" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisCampaign(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <hr className="my-4" />
              </div>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Campaigne Detail Modal End */}
    </>
  );
};

export default CampaignTypeList;
