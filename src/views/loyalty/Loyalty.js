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
  const [members, setMembers] = useState([]);
  const initialValues = {
    code: '',
    description: '',
    value: 0,
    totalUsage: 0,
    usagePerUser: 0,
    startDate: '',
    expiryDate: '',
    members: [],
  };

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});

  React.useEffect(() => {
    dispatch(getCampaigns(page, search));
    dispatch(getMembers());
  }, [dispatch, page, search]);

  const [selectedItems, setSelectedItems] = useState([]);
  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const toggleCheckAll = () => {
    if (selectedItems.length !== campaignsData.length) {
      const ids = campaignsData.map((item) => item.id);
      setSelectedItems(ids);
    } else {
      setSelectedItems([]);
    }
  };

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
  function addNewCampaign(val) {
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
  }

  function viewCampaign(val) {
    dispatch(getCampaign(val.id)).then((res) => {
      setIsAdding(false);
      setIsViewing(true);
      setIsEditing(false);
      res.data.members = res.data.users;
      setUpdateData(res.data);
    });

    toggleModal();
  }

  // highlight-starts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((nextValue) => setSearch(nextValue), 1000),
    []
  );
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1 me-3" onClick={() => addNewCampaign()}>
            <CsLineIcons icon="plus" /> <span>Add campaign</span>
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
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {campaignsData.map((item) => (
        <Card className={`mb-2 ${selectedItems.includes(1) && 'selected'}`} key={item.id}>
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              {/* <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <NavLink to="/campaigns/detail" className="text-truncate h-100 d-flex align-items-center">
                  {item.id}
                </NavLink>
              </Col> */}
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">Code</div>
                <div className="text-alternate">{item.code}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">Start Date</div>
                <div className="text-alternate">
                  <span>{item.startDate}</span>
                </div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">End date</div>
                <div className="text-alternate">{item.expiryDate}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">Total usage</div>
                <div className="text-alternate">{item.totalUsage}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.isActive ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>

              <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-2 order-md-last">
                <Form.Switch
                  className="form-check mt-2 ps-5 ps-md-2"
                  type="checkbox"
                  checked={item.statusId}
                  onChange={(e) => {
                    toggleStatus(e, item.id);
                  }}
                />
              </Col>
              <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-2 text-end order-md-last">
                <span className="d-flex">
                  {' '}
                  <span onClick={() => viewCampaign(item)} className="text-muted me-3 cursor-pointer">
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
      {
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>
            {/* <Pagination.Item className="shadow"  onClick={() = handleActive(page)}>
              {page}
            </Pagination.Item>
            <Pagination.Item className="shadow" onClick={() = handleActive(page+1)}> {page + 1}</Pagination.Item>
            <Pagination.Item className="shadow" onClick={() = handleActive(page+2)}>{page + 2}</Pagination.Item> */}
            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={campaignsData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      }
      {/* Pagination End */}

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
                  <Form.Label>Value</Form.Label>
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
                  <Form.Label>Start date </Form.Label>
                  <input type="date" name="startDate" className="form-control" onChange={handleChange} value={values.startDate} />
                  {errors.startDate && touched.startDate && <div className="d-block invalid-tooltip">{errors.startDate}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>End date </Form.Label>
                  <input type="date" name="expiryDate" className="form-control" onChange={handleChange} value={values.expiryDate} />
                  {errors.usagePerUser && touched.expiryDateexpiryDate && <div className="d-block invalid-tooltip">{errors.expiryDate}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={handleChange} value={values.description} />
                  {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                </div>

                <div>
                  <h6>Select members</h6>
                  <Row>
                    <Col xs={6}>
                      <label className="d-flex align-items-center">
                        <input type="checkbox" className="form-check-input me-1" name="members" />
                      </label>
                      John doe
                    </Col>
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
                  <Form.Label>Start date </Form.Label>
                  <input type="date" name="startDate" className="form-control" onChange={(e) => handleUpdateChange(e)} value={updateData.startDate} />
                </div>

                <div className="mb-3">
                  <Form.Label>End date </Form.Label>
                  <input type="date" name="expiryDate" className="form-control" onChange={(e) => handleUpdateChange(e)} value={updateData.expiryDate} />
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
                </div>

                <div>
                  <h6>Select members</h6>
                  <Row>
                    <Col xs={6}>
                      <label className="d-flex align-items-center">
                        <input type="checkbox" className="form-check-input me-1" name="members" />
                      </label>
                      John doe
                    </Col>
                  </Row>
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
                      <td className="font-weight-bold  px-4 py-3 border-bottom px-4 py-3 border-bottom text-uppercase"> Code</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.code}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Description</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.description}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Todal usage</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.totalUsage}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Usage per user</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.usagePerUser}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Start date </td>
                      <td className=" px-4 py-3 border-bottom">{updateData.startDate}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Expiry date</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.expiryDate}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Value</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.value}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">status</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.isActive ? 'Active' : 'Inactive'}</td>
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
