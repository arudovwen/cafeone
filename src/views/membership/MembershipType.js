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
  getmembershiptypes,
  addMembershipType,
  getMembership,
  updateMembership,
  activateMembership,
  deactivateMembership,
  deleteMembership,

  // eslint-disable-next-line import/extensions
} from '../../membership/membershipSlice';

const MembershipTypeList = () => {
  const title = 'Membership Types';
  const description = 'Membership Types Page';
  const [membershipModal, setMembershipModal] = useState(false);
  const membershipsData = useSelector((state) => state.membership.types);
  const status = useSelector((state) => state.membership.status);

  const initialValues = {
    name: '',
    amount: 0,
    validityPeriod: 0,
    validityPeriodTypeId: 1,
    description: '',
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
    dispatch(getmembershiptypes(page, search));
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
    if (selectedItems.length !== membershipsData.length) {
      const ids = membershipsData.map((item) => item.id);
      setSelectedItems(ids);
    } else {
      setSelectedItems([]);
    }
  };

  function nextPage() {
    if (membershipsData.length / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name name is required'),
    amount: Yup.string().required('Amount name is required'),
    validityPeriod: Yup.string().required('Address is required'),
    validityPeriodTypeId: Yup.string().required('Field is required'),
    description: Yup.string().required('Description is required'),
  });

  const toggleModal = () => {
    setMembershipModal(!membershipModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addMembershipType(values));
    resetForm({ values: '' });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  function deleteThisMembership(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteMembership(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Membership removed');
          dispatch(getmembershiptypes(page, search));
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
      dispatch(deactivateMembership(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getmembershiptypes(page, search));
        }
      });
    }
    if (value) {
      dispatch(activateMembership(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getmembershiptypes(page, search));
        }
      });
    }
  }
  function addNewMembership(val) {
    setIsAdding(true);
    setIsViewing(false);
    setIsEditing(false);

    toggleModal();
  }

  function editMembership(val) {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(true);

    setUpdateData(val);
  }

  function viewMembership(val) {
    setIsAdding(false);
    setIsViewing(true);
    setIsEditing(false);
    setUpdateData(val);

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
      setMembershipModal(false);
    }
    if (status === 'update') {
      dispatch(getmembershiptypes(1, ''));
      setMembershipModal(false);
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
    dispatch(updateMembership(updateData));
    console.log('🚀 ~ file: Membership.js ~ line 202 ~ handleUpdate ~ updateData', updateData);
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1 me-3" onClick={() => addNewMembership()}>
            <CsLineIcons icon="plus" /> <span>Add membership</span>
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
                {membershipsData.length} Items
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
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">AMOUNT</div>
        </Col>

        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DESCRIPTION</div>
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
      {membershipsData.map((item) => (
        <Card className={`mb-2 ${selectedItems.includes(1) && 'selected'}`} key={item.id}>
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              {/* <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <NavLink to="/memberships/detail" className="text-truncate h-100 d-flex align-items-center">
                  {item.id}
                </NavLink>
              </Col> */}
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate">{item.name}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">Amount</div>
                <div className="text-alternate">
                  <span>{item.amount}</span>
                </div>
              </Col>

              <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">Description</div>
                <div className="text-alternate">{item.description}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.statusId ? <Badge bg="outline-primary">{item.status}</Badge> : <Badge bg="outline-warning">{item.status}</Badge>}</div>
              </Col>

              <Col xs="1" md="2" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-2 order-md-last">
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
                  <span onClick={() => viewMembership(item)} className="text-muted me-3 cursor-pointer">
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
            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={membershipsData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      }
      {/* Pagination End */}

      {/* Membershipe Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={membershipModal} onHide={() => setMembershipModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new membership'}
            {isEditing && 'Update new membership'}
            {isViewing && 'Membership Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" onChange={handleChange} value={values.name} />
                  {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="text" name="amount" onChange={handleChange} value={values.amount} />
                  {errors.amount && touched.amount && <div className="d-block invalid-tooltip">{errors.amount}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>Validity Period</Form.Label>
                  <Form.Control type="text" name="validityPeriod" onChange={handleChange} value={values.validityPeriod} />
                  {errors.validityPeriod && touched.validityPeriod && <div className="d-block invalid-tooltip">{errors.validityPeriod}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Period TypeId </Form.Label>
                  <Form.Control type="text" name="validityPeriodTypeId" onChange={handleChange} value={values.validityPeriodTypeId} />
                  {errors.validityPeriodTypeId && touched.validityPeriodTypeId && <div className="d-block invalid-tooltip">{errors.validityPeriodTypeId}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={handleChange} value={values.description} />
                  {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                </div>

                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            )}
            {isEditing && (
              <form onSubmit={(e) => handleUpdate(e)}>
                <div className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleUpdateChange(e)} value={updateData.name} />
                </div>

                <div className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="text" name="amount" onChange={(e) => handleUpdateChange(e)} value={updateData.amount} />
                </div>
                <div className="mb-3">
                  <Form.Label>Validity Period</Form.Label>
                  <Form.Control type="text" name="validityPeriod" onChange={(e) => handleUpdateChange(e)} value={updateData.validityPeriod} />
                </div>

                <div className="mb-3">
                  <Form.Label>Period TypeId </Form.Label>
                  <Form.Control type="text" name="validityPeriodTypeId" onChange={(e) => handleUpdateChange(e)} value={updateData.validityPeriodTypeId} />
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
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
                      <td className="font-weight-bold  px-4 py-3 border-bottom px-4 py-3 border-bottom text-uppercase"> Name</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.name}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Description</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.description}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Amount</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.amount}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Validity period</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.validityPeriod}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">Period type</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.validityPeriodType}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  px-4 py-3 border-bottom text-uppercase">status</td>
                      <td className=" px-4 py-3 border-bottom">{updateData.status}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1 me-3" onClick={() => editMembership(updateData)}>
                    <CsLineIcons icon="edit" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisMembership(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <hr className="my-4" />
              </div>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Membershipe Detail Modal End */}
    </>
  );
};

export default MembershipTypeList;
