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
  getBranches,
  addBranch,
  getBranch,
  updateBranch,
  addBranchSeat,
  activateBranch,
  deactivateBranch,
  deleteBranch,
  deleteBranchSeat,
} from '../../branches/branchSlice';
import { uploadPhoto } from '../../members/memberSlice';

const BranchesList = () => {
  const title = 'Branches List';
  const description = 'Branches List Page';
  const [branchModal, setBranchModal] = useState(false);
  const branchesData = useSelector((state) => state.branches.branches);
  const status = useSelector((state) => state.branches.status);
  const [seatInfo, setSeatInfo] = useState({
    image: '',
    description: '',
    name: '',
    branchId: '',
  });
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
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isAddSeat, setIsAddSeat] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [seats, setSeats] = useState([]);
  React.useEffect(() => {
    dispatch(getBranches(page, search));
  }, [dispatch, page, search]);

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

  function deleteThisBranch(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteBranch(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Branch removed');
          dispatch(getBranches(page, search));
          toggleModal();
          setIsAdding(false);
          setIsViewing(false);
          setIsEditing(false);
        }
      });
    }
  }
  function deleteThisSeat(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteBranchSeat({ seat_id: id, id: updateData.id })).then((res) => {
        if (res.status === 200) {
          toast.success('Seat removed');
          dispatch(getBranches(page, search));
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
      dispatch(deactivateBranch(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getBranches(page, search));
        }
      });
    }
    if (value) {
      dispatch(activateBranch(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getBranches(page, search));
        }
      });
    }
  }
  function addNewBranch() {
    setIsAdding(true);
    setIsViewing(false);
    setIsEditing(false);
    toggleModal();
  }

  function editBranch(val) {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(true);
    dispatch(getBranch(val.id)).then((res) => {
      const info = res.data;

      setUpdateData(info);
    });
  }

  function viewBranch(val) {
    setIsAdding(false);
    setIsViewing(true);
    setIsEditing(false);
    dispatch(getBranch(val.id)).then((res) => {
      const info = res.data;
      setUpdateData(info);
      setSeats(info.seats);
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

  const handleFile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    dispatch(uploadPhoto(formData)).then((res) => {
      setSeatInfo({
        ...seatInfo,
        image: res.data.file,
      });
    });
  };

  function addNewSeat(id) {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(false);
    setIsAddSeat(true);
    setSeatInfo({
      ...seatInfo,
      branchId: id,
    });
  }
  function handleSeatChange(e) {
    setSeatInfo({
      ...seatInfo,
      [e.target.name]: e.target.value,
    });
  }
  function handleSeatAdd(e) {
    e.preventDefault();
    dispatch(addBranchSeat(seatInfo)).then((res) => {
      if (res.status === 200) {
        dispatch(getBranches(page, search));
        toggleModal();
        setIsAdding(false);
        setIsViewing(false);
        setIsEditing(false);
        setIsAddSeat(false);
        toast.success('Seat added');
      }
    });
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1 me-3" onClick={() => addNewBranch()}>
            <CsLineIcons icon="plus" /> <span>Add branch</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="8" xxl="8" className="mb-1 text-end">
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
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">LOCATION</div>
        </Col>

        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">SEATS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">TOGGLE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center px-1">
          <div className="text-muted text-small cursor-pointer sort text-right">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {branchesData.map((item) => (
        <Card className="mb-2" key={item.id}>
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-2 px-1">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate">{item.name}</div>
              </Col>
              <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-3 px-1">
                <div className="text-muted text-small d-md-none">Location</div>
                <div className="text-alternate">
                  <span>{item.address}</span>
                </div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-4 px-1">
                <div className="text-muted text-small d-md-none">Seats</div>
                <div className="text-alternate">{item.seatCount}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-6 order-md-5 px-1">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.statusId ? <Badge bg="outline-primary">{item.status}</Badge> : <Badge bg="outline-warning">{item.status}</Badge>}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-start align-items-md-end mb-2 mb-md-0 order-5 px-1 order-md-last">
                <div className="text-muted text-small d-md-none">Toggle Status</div>
                <Form.Switch
                  className="form-check mt-md-2 me-auto"
                  type="checkbox"
                  checked={item.statusId}
                  onChange={(e) => {
                    toggleStatus(e, item.id);
                  }}
                />
              </Col>
              <Col xs="6" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-last text-end order-md-last">
                <span className="d-flex">
                  {' '}
                  <Button variant="primary" type="button" size="sm" onClick={() => viewBranch(item)} className="">
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
      {branchesData.length ? (
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
      ) : (
        ''
      )}
      {/* Pagination End */}
      {!branchesData.length && <div className="text-center p-4 text-muted">No data available</div>}
      {/* Branche Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={branchModal} onHide={() => setBranchModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new branch'}
            {isEditing && 'Update new branch'}
            {isViewing && 'Branch Information'}
            {isAddSeat && 'Add Branch seat'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
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
            )}
            {isEditing && (
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
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
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
            {isAddSeat && (
              <form onSubmit={(e) => handleSeatAdd(e)}>
                <div className="mb-3">
                  <Form.Label>Seat name</Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleSeatChange(e)} value={seatInfo.name} />
                </div>
                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={(e) => handleSeatChange(e)} value={seatInfo.location} />
                </div>
                <div className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <input type="file" id="image" className="form-control" accept="image" name="image" onChange={handleFile} />
                </div>

                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3">
                  <span>Submit</span>
                </Button>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <div className="text-center d-flex justify-content-end mb-2">
                  <Button variant="primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewSeat(updateData.id)}>
                    <CsLineIcons icon="plus" /> <span>Add seat</span>
                  </Button>
                </div>
                <table className="mb-5 w-100">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Name</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.name}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Location</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.address}</td>
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
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Description</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.description}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">status</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.status}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Seats </td>
                      <td className=" py-2 px-1 border-bottom">{updateData.seatCount}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center">
                  <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1 me-3" onClick={() => editBranch(updateData)}>
                    <CsLineIcons icon="edit" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisBranch(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <hr className="my-4" />

                <h5>Seat Information</h5>

                <div className="" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {seats && seats.length ? (
                    <table className="mb-5 w-100 bg-light p-3 rounded-lg w-100">
                      <thead>
                        <tr>
                          <th className="text-small text-muted font-weight-bold  py-2 px-3   border-bottom text-uppercase text-muted">Id</th>
                          <th className="text-small text-muted  font-weight-bold  py-2 px-3  border-bottom text-uppercase text-muted">Image</th>
                          <th className="text-small text-muted font-weight-bold  py-2 px-3   border-bottom text-uppercase text-muted">Description</th>
                          <th className=" text-small text-muted font-weight-bold  py-2 px-2   border-bottom text-uppercase text-muted">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seats &&
                          seats.map((item) => (
                            <tr key={item.id} className="border-bottom ">
                              <td className="px-3  border-bottom py-2"> {item.id}</td>
                              <td className="px-3  border-bottom py-2">
                                <img
                                  src={`${process.env.REACT_APP_URL}/${item.photo}`}
                                  className="rounded-full"
                                  alt="image"
                                  style={{ width: '30px', height: '30px' }}
                                />
                              </td>
                              <td className=" py-2 px-2 border-bottom">{item.description}</td>
                              <td className=" py-2 px-2 border-bottom">
                                <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisSeat(item.id)}>
                                  <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} />{' '}
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-2 px-1 bg-light rounded px-2">No seats available</div>
                  )}
                </div>
              </div>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Branche Detail Modal End */}
    </>
  );
};

export default BranchesList;
