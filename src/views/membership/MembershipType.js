/* eslint-disable prefer-const */
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
import CsvDownloader from 'react-csv-downloader';
import moment from 'moment';
import {
  getmembershiptypes,
  addMembershipType,
  updateMembership,
  activateMembership,
  deactivateMembership,
  deleteMembership,
  updatemembershipStatus,
  getPlanType,

  // eslint-disable-next-line import/extensions
} from '../../membership/membershipSlice';

const MembershipTypeList = () => {
  const title = 'Membership Types';
  const description = 'Membership Types Page';
  const [membershipModal, setMembershipModal] = useState(false);
  const membershipsData = useSelector((state) => state.membership.types);
  const status = useSelector((state) => state.membership.status);
  const [datas, setDatas] = useState([]);
  const [plans, setPlans] = useState([]);
  const [updatePlans, setUpdatePlans] = useState([]);
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  });
  const initialValues = {
    name: '',
    plans: [
      {
        typeId: '',
        amount: '',
      },
    ],
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
    dispatch(getPlanType()).then((res) => {
      setPlans(res.data);
    });
  }, []);
  React.useEffect(() => {
    dispatch(getmembershiptypes(page, search));
  }, [dispatch, page, search]);

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
    description: Yup.string().required('Description is required'),
  });

  const toggleModal = () => {
    setMembershipModal(!membershipModal);
  };

  const onSubmit = (values, { resetForm }) => {
    dispatch(addMembershipType(values)).then(() => {
      resetForm({ values: '' });
    });
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
          dispatch(updatemembershipStatus({ id, value }));
        }
      });
    }
    if (value) {
      dispatch(activateMembership(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(updatemembershipStatus({ id, value }));
        }
      });
    }
  }

  function addPlan() {
    values.plans.push({
      typeId: '',
      amount: '',
    });
    forceUpdate();
  }

  function dropPlan() {
    values.plans.pop();
    forceUpdate();
  }

  function addUpdatePlan() {
    updatePlans.push({
      typeId: '',
      amount: '',
    });
    forceUpdate();
  }

  function dropUpdatePlan() {
    updatePlans.pop();
    forceUpdate();
  }

  function addNewMembership() {
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
    setUpdatePlans([...val.plans]);
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
        description: '',
        plans: [
          {
            planTypeId: '',
            amount: '',
          },
        ],
      });
    }
  }, [status, dispatch]);

  function handleUpdateChange(e) {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  }
  function handlePlanUpdate(e, i) {
    let newobj = { ...updatePlans[i], [e.target.name]: Number(e.target.value) };
    let newvalues = [...updatePlans];
    newvalues[i] = newobj;

    setUpdatePlans(newvalues);
  }

  function handleUpdate(e) {
    e.preventDefault();
    let newplans = updatePlans.map((i) => {
      return {
        typeId: i.planTypeId,
        amount: i.amount,
      };
    });

    let newdata = { ...updateData, plans: newplans };
    console.log(newdata);
    dispatch(updateMembership(newdata));
  }

  React.useEffect(() => {
    const newdata = membershipsData.map((item) => {
      return {
        cell1: item.name,
        cell2: item.description,
        cell3: item.plans.find((v) => v.planTypeId === 1) ? item.plans.find((v) => v.planTypeId === 1).amount : 0,
        cell4: item.plans.find((v) => v.planTypeId === 2) ? item.plans.find((v) => v.planTypeId === 2).amount : 0,
        cell5: item.plans.find((v) => v.planTypeId === 3) ? item.plans.find((v) => v.planTypeId === 3).amount : 0,
        cell6: item.status,
      };
    });

    setDatas(newdata);
  }, [membershipsData]);
  const columns = [
    {
      id: 'cell1',
      displayName: 'NAME',
    },

    {
      id: 'cell2',
      displayName: 'DESCRIPTION',
    },
    {
      id: 'cell3',
      displayName: 'DAILY AMOUNT',
    },
    {
      id: 'cell4',
      displayName: 'WEEKLY AMOUNT',
    },
    {
      id: 'cell5',
      displayName: 'MONTHLY AMOUNT',
    },

    {
      id: 'cell6',
      displayName: 'STATUS',
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
        </Row>
      </div>

      <Row className="mb-3">
        <Col md="5" lg="6" xxl="6" className="mb-1 d-flex align-items-center ">
          {/* Search Start */}
          {/* <div className="d-inline-block float-md-start me-4 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="text" placeholder="Search" onChange={(e) => handleSearch(e)} />
            <span className="search-magnifier-icon">
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div> */}

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewMembership()}>
            <CsLineIcons icon="plus" /> <span>Add membership</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="6" xxl="6" className="mb-1 text-end">
          {/* Export Dropdown Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export csv</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsvDownloader filename="membership" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
                  <CsLineIcons icon="download" />
                </CsvDownloader>
              </Dropdown.Toggle>
            </OverlayTrigger>
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
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>

        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DESCRIPTION</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">TOGGLE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {membershipsData.map((item) => (
        <Card className="mb-2" key={item.id}>
          <Card.Body className="pt-md-0 pb-md-0 sh-auto sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-2">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate">{item.name}</div>
              </Col>

              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-4">
                <div className="text-muted text-small d-md-none">Description</div>
                <div className="text-alternate">{item.description}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-5">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.isActive ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>

              <Col xs="6" md="2" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-5 order-md-last">
                <div className="text-muted text-small d-md-none">Toggle Status</div>
                <Form.Switch
                  className=""
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => {
                    toggleStatus(e, item.id);
                  }}
                />
              </Col>
              <Col xs="12" md="2" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-last text-end order-md-last">
                <Button variant="primary" type="button" size="sm" onClick={() => viewMembership(item)} className="">
                  View
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {/* List Items End */}

      {/* Pagination Start */}
      {membershipsData.length ? (
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
      ) : (
        ''
      )}
      {/* Pagination End */}
      {!membershipsData.length && <div className="text-center p-4 text-muted">No data available</div>}

      {/* Membershipe Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={membershipModal} onHide={() => setMembershipModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new membership'}
            {isEditing && 'Update membership'}
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
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={handleChange} value={values.description} />
                  {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                </div>

                {values.plans.map((item, index) => (
                  <div key={index}>
                    <div className="mb-3">
                      <Form.Label>Period {index + 1}</Form.Label>
                      <Form.Select type="text" name={`plans[${index}].typeId`} onChange={handleChange} value={item.typeId} placeholder="Select validity period">
                        <option value="" disabled>
                          Select duration
                        </option>
                        {plans.map((plan) => (
                          <option value={plan.id} key={plan.id}>
                            {plan.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control type="number" name={`plans[${index}].amount`} onChange={handleChange} value={item.amount} />
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-end">
                  {values.plans.length > 1 && (
                    <Button variant="link" type="button" size="sm" onClick={() => dropPlan()} className="me-3 px-0">
                      Drop plan <CsLineIcons icon="minus" size="12" className="" />
                    </Button>
                  )}
                  <Button variant="link" type="button" size="sm" onClick={() => addPlan()} className=" px-0" disabled={values.plans.length === 3}>
                    Add plan <CsLineIcons icon="plus" size="12" className="" />
                  </Button>
                </div>

                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-4  mb-5">
                  <span>Submit</span>
                </Button>
              </form>
            )}
            {isEditing && (
              <form onSubmit={(e) => handleUpdate(e)} className="pb-5">
                <div className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleUpdateChange(e)} value={updateData.name} />
                </div>
                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={(e) => handleUpdateChange(e)} value={updateData.description} />
                </div>
                {updatePlans.map((item, i) => (
                  <div key={i}>
                    <div className="mb-3">
                      <Form.Label>Period {i + 1}</Form.Label>
                      <Form.Select
                        type="text"
                        name="planTypeId"
                        onChange={(e) => handlePlanUpdate(e, i)}
                        value={item.planTypeId || ''}
                        placeholder="Select duration"
                      >
                        <option value="" disabled>
                          Select duration
                        </option>
                        {plans.map((plan) => (
                          <option value={plan.id} key={plan.id}>
                            {plan.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control type="number" name="amount" onChange={(e) => handlePlanUpdate(e, i)} value={item.amount || ''} />
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-end">
                  {updatePlans.length > 1 && (
                    <Button variant="link" type="button" size="sm" onClick={() => dropUpdatePlan()} className="me-3 px-0">
                      Drop plan <CsLineIcons icon="minus" size="12" className="" />
                    </Button>
                  )}
                  <Button variant="link" type="button" size="sm" onClick={() => addUpdatePlan()} className=" px-0" disabled={updatePlans.length === 3}>
                    Add plan <CsLineIcons icon="plus" size="12" className="" />
                  </Button>
                </div>

                <Button variant="primary" type="submit" className="btn-icon btn-icon-start w-100 mt-3  mb-5">
                  <span>Submit</span>
                </Button>
              </form>
            )}

            {isViewing && updateData && (
              <div className="">
                <table className="mb-5">
                  <tbody>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Name</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.name}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Description</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.description}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">status</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.isActive ? 'Active' : 'Inactive'}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="mb-5">
                  <thead>
                    <tr>
                      <th className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted">Plan type</th>
                      <th className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {updateData.plans.map((item, index) => (
                      <tr key={index}>
                        <td className=" py-2 px-1 border-bottom">{item.planType}</td>
                        <td className=" py-2 px-1 border-bottom"> {formatter.format(item.amount)}</td>
                      </tr>
                    ))}
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
