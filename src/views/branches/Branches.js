import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Pagination, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import CheckAll from 'components/check-all/CheckAll';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { debounce } from 'lodash';
import moment from 'moment';
import { getBranches, addBranch, getBranch, updateBranch } from '../../branches/branchSlice';

const BranchesList = () => {
  const title = 'Branches List';
  const description = 'Branches List Page';
  const [branchModal, setBranchModal] = useState(false);
  const branchesData = useSelector((state) => state.branches.branches);
  const status = useSelector((state) => state.branches.status);
  const initialValues = {
    name: '',
    location: '',
    description: '',
    address: '',
    city: '',
    state: '',
  };
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updateData, setUpdateData] = useState({});
  React.useEffect(() => {
    dispatch(getBranches(page, search));
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
    if (selectedItems.length !== branchesData.length) {
      const ids = branchesData.map((item) => item.id);
      setSelectedItems(ids);
    } else {
      setSelectedItems([]);
    }
  };

  function nextPage() {
    if (branchesData.length / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Branch name is required'),
    location: Yup.string().required('Location name is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    description: Yup.string().required('Description is required'),
  });

  const toggleModal = () => {
    setBranchModal(!branchModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addBranch(values));
    resetForm({ values: '' });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  function deleteBranch() {}
  function editBranch(val) {
    setIsEditing(true);
    dispatch(getBranch(val.id)).then((res) => {
      const info = res.data;

      setUpdateData(info);
    });
    toggleModal();
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

  React.useEffect(() => {
    if (status === 'success') {
      setBranchModal(false);
    }
    if (status === 'update') {
      dispatch(getBranches(1, ''));
      setBranchModal(false);
      setUpdateData({
        name: '',
        location: '',
        description: '',
        address: '',
        city: '',
        state: '',
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
    dispatch(updateBranch(updateData));
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

          {/* Top Buttons Start */}
          <Col xs="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1 d-inline-block d-lg-none">
              <CsLineIcons icon="sort" />
            </Button>
            <div className="btn-group ms-1 check-all-container">
              <CheckAll
                allItems={branchesData.map((item) => item.id)}
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

      <Row className="mb-3">
        <Col md="5" lg="4" xxl="4" className="mb-1 d-flex align-items-center ">
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => toggleModal()}>
            <CsLineIcons icon="plus" /> <span>Add branch</span>
          </Button>
          {/* Search End */}
        </Col>
        <Col md="7" lg="8" xxl="8" className="mb-1 text-end">
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
                {branchesData.length} Items
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
          <div className="text-muted text-small cursor-pointer sort">LOCATION</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DESCRIPTION</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">SEATS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {branchesData.map((item) => (
        <Card className={`mb-2 ${selectedItems.includes(1) && 'selected'}`} key={item.id}>
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              {/* <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <NavLink to="/branches/detail" className="text-truncate h-100 d-flex align-items-center">
                  {item.id}
                </NavLink>
              </Col> */}
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate">{item.name}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">Location</div>
                <div className="text-alternate">
                  <span>{item.address}</span>
                </div>
              </Col>
              <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">Description</div>
                <div className="text-alternate">{item.description}</div>
              </Col>
              <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                <div className="text-muted text-small d-md-none">Seats</div>
                <div className="text-alternate">{item.seatCount}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.statusId ? <Badge bg="outline-primary">{item.status}</Badge> : <Badge bg="outline-secondary">{item.status}</Badge>}</div>
              </Col>
              <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
                <span className="d-flex">
                  {' '}
                  <span onClick={() => editBranch(item)} className="text-muted me-3">
                    View
                  </span>
                  <span onClick={() => editBranch(item)} className="text-muted ">
                    Edit
                  </span>
                </span>
              </Col>
              <Col
                xs="1"
                md="1"
                className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last"
                onClick={() => checkItem(item.id)}
              >
                <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => {}} />
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
            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={branchesData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      }
      {/* Pagination End */}

      {/* Branche Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={branchModal} onHide={() => setBranchModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add new branches</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {!isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <Form.Label>Branch name</Form.Label>
                  <Form.Control type="text" name="name" onChange={handleChange} value={values.name} />
                  {errors.name && touched.name && <div className="d-block invalid-tooltip">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Branch location</Form.Label>
                  <Form.Control type="text" name="location" onChange={handleChange} value={values.location} />
                  {errors.location && touched.location && <div className="d-block invalid-tooltip">{errors.location}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={handleChange} value={values.description} />
                  {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Address </Form.Label>
                  <Form.Control type="text" name="address" onChange={handleChange} value={values.address} />
                  {errors.address && touched.address && <div className="d-block invalid-tooltip">{errors.address}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" onChange={handleChange} value={values.city} />
                  {errors.city && touched.city && <div className="d-block invalid-tooltip">{errors.city}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" onChange={handleChange} value={values.state} />
                  {errors.state && touched.state && <div className="d-block invalid-tooltip">{errors.state}</div>}
                </div>
                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            ) : (
              <form onSubmit={(e) => handleUpdate(e)}>
                <div className="mb-3">
                  <Form.Label>Branch name</Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleUpdateChange(e)} value={updateData.name} />
                </div>
                <div className="mb-3">
                  <Form.Label>Branch location</Form.Label>
                  <Form.Control type="text" name="location" onChange={(e) => handleUpdateChange(e)} value={updateData.location} />
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
                </div>
                <div className="mb-3">
                  <Form.Label>Address </Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleUpdateChange(e)} value={updateData.address} />
                </div>
                <div className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" onChange={(e) => handleUpdateChange(e)} value={updateData.city} />
                </div>
                <div className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" onChange={(e) => handleUpdateChange(e)} value={updateData.state} />
                </div>
                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Branche Detail Modal End */}
    </>
  );
};

export default BranchesList;
