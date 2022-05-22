import React, { useState, useCallback } from 'react';
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
import { debounce } from 'lodash';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAdmins, addAdmin, getAdmin, updateAdmin, activateAdmin, deactivateAdmin, getRoles, removeadmin } from '../../admin/adminSlice';

const AdminManagementList = () => {
  const [adminModal, setAdminModal] = useState(false);
  const dispatch = useDispatch();
  const title = 'Admins List';
  const description = 'Admins List Page';

  const allItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [selectedItems, setSelectedItems] = useState([]);
  const adminsData = useSelector((state) => state.admins.items);
  const total = useSelector((state) => state.admins.total);
  const status = useSelector((state) => state.admins.status);
  const roles = useSelector((state) => state.admins.roles);
  const initialValues = {
    email: '',
    firstName: '',
    lastName: '',
    role: '',
  };
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});

  React.useEffect(() => {
    dispatch(getAdmins(page, search));
    dispatch(getRoles());
  }, [dispatch, page, search]);

  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const toggleCheckAll = () => {
    if (selectedItems.length !== adminsData.length) {
      const ids = adminsData.map((item) => item.id);
      setSelectedItems(ids);
    } else {
      setSelectedItems([]);
    }
  };

  function nextPage() {
    if (total / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    role: Yup.string().required('Role is required'),
  });

  const toggleModal = () => {
    setAdminModal(!adminModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addAdmin(values));
    resetForm({ values: '' });
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  function deleteAdmin(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(removeadmin(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Admin removed');
          dispatch(getAdmins(page, search));
          toggleModal();
          setIsAdding(false);
          setIsViewing(false);
          setIsEditing(false);
        }
      });
    }
  }
  function editAdmin(val) {
    setUpdateData(val);
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(true);
  }
  function addNewAdmin() {
    setIsAdding(true);
    setIsViewing(false);
    setIsEditing(false);
    toggleModal();
  }

  function viewAdmin(val) {
    setIsAdding(false);
    setIsViewing(true);
    setIsEditing(false);
    setUpdateData(val);
    toggleModal();
  }
  function toggleStatus(e, id) {
    const value = e.target.checked;
    if (!value) {
      dispatch(deactivateAdmin(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getAdmins(page, search));
        }
      });
    }
    if (value) {
      dispatch(activateAdmin(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(getAdmins(page, search));
        }
      });
    }
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
      setAdminModal(false);
    }
    if (status === 'update') {
      dispatch(getAdmins(1, ''));
      setAdminModal(false);
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
    dispatch(updateAdmin(updateData));
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
                allItems={allItems}
                selectedItems={selectedItems}
                onToggle={toggleCheckAll}
                inputClassName="form-check"
                className="btn btn-outline-primary btn-custom-control py-0"
              />
              <Dropdown align="end">
                <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" variant="outline-primary" />
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => deleteAdmin()}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          {/* Top Buttons End */}
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewAdmin()}>
            <CsLineIcons icon="plus" /> <span>Add Admin</span>
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
              {/* <Dropdown.Item href="#">5 Items</Dropdown.Item>
              <Dropdown.Item href="#">10 Items</Dropdown.Item>
              <Dropdown.Item href="#">20 Items</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Email</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Role</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">Status</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-start">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {adminsData.map((item) => (
        <Card key={item.id} className="mb-2">
          <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate dflex align-items-center">
                  {item.firstName} {item.lastName}
                </div>
              </Col>
              <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">Email</div>
                <div className="text-alternate">
                  <span>{item.email}</span>
                </div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                <div className="text-muted text-small d-md-none">Role</div>
                <div className="text-alternate">
                  <span>{item.role}</span>
                </div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.isActive ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>
              <Col xs="6" md="1" className="d-flex flex-column justify-content-end align-items-md-start mb-2 mb-md-0 order-2 text-end order-md-last">
                <Form.Switch
                  className="form-check mt-2 ps-5 ps-md-2"
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => {
                    toggleStatus(e, item.id);
                  }}
                />
              </Col>

              <Col xs="6" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
                <span className="d-flex">
                  {' '}
                  <span onClick={() => viewAdmin(item)} className="text-muted me-3">
                    View
                  </span>
                </span>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      {/* Pagination Start */}
      {adminsData.length ? (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={total / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      ) : (
        ''
      )}
      {/* Pagination End */}

      {!adminsData.length && <div className="text-center p-4 text-muted">No admin available</div>}

      {/* Admin Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={adminModal} onHide={() => setAdminModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {' '}
            {isAdding && 'Add new admin'}
            {isEditing && 'Update new admin'}
            {isViewing && 'Admin Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            {isAdding && (
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
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" id="email" name="email" onChange={handleChange} value={values.email} />
                  {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <Form.Label>Roles</Form.Label>
                  <Form.Select name="role" onChange={handleChange} value={values.role} placeholder="Select role">
                    <option value="" disabled>
                      Select role
                    </option>
                    {roles.map((item) => (
                      <>
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      </>
                    ))}
                  </Form.Select>
                  {errors.role && touched.role && <div className="d-block invalid-tooltip">{errors.role}</div>}
                </div>

                <div className="border-0 mt-3 mb-5">
                  <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100">
                    <span>Submit</span>
                  </Button>
                </div>
              </form>
            )}
            {isEditing && (
              <form onSubmit={(e) => handleUpdate(e)}>
                <div className="mb-3">
                  <Form.Label>First name</Form.Label>
                  <Form.Control type="text" name="firstName" onChange={(e) => handleUpdateChange(e)} value={updateData.firstName} />
                </div>

                <div className="mb-3">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control type="text" id="lastName" name="lastName" onChange={(e) => handleUpdateChange(e)} value={updateData.lastName} />
                </div>

                <div className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" id="email" name="email" onChange={(e) => handleUpdateChange(e)} value={updateData.email} />
                </div>
                <div className="mb-3">
                  <Form.Label>Roles</Form.Label>
                  <Form.Select name="role" onChange={handleChange} value={values.role} placeholder="Select role">
                    <option value="" disabled>
                      Select role
                    </option>
                    {roles.map((item) => (
                      <>
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      </>
                    ))}
                  </Form.Select>
                  {errors.role && touched.role && <div className="d-block invalid-tooltip">{errors.role}</div>}
                </div>

                <div className="border-0 mt-3 mb-5">
                  <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100">
                    <span>Update admin</span>
                  </Button>
                </div>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <table className="mb-5">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Name</td>
                      <td className=" py-2 px-1 border-bottom">
                        {updateData.firstName} {updateData.lastName}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Email</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.email}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Role</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.role}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center">
                  {/* <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-start  mb-1 me-3" onClick={() => editAdmin(updateData)}>
                    <CsLineIcons icon="edit" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Edit</span>
                  </Button> */}
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteAdmin(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" style={{ width: '13px', height: '13px' }} /> <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <hr className="my-4" />
              </div>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Admin Detail Modal End */}
    </>
  );
};

export default AdminManagementList;
