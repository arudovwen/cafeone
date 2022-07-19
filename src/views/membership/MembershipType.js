/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable no-alert */
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CsvDownloader from 'react-csv-downloader';
import { useReactToPrint } from 'react-to-print';
// import moment from 'moment';
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

const ComponentToPrint = forwardRef((props, ref) => {
  const membershipsData = useSelector((state) => state.membership.types);
  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <table align="left" border="1" cellSpacing="5" cellPadding="15" style={{ border: '1px solid #ccc' }}>
        <thead className="">
          <tr align="left">
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium">Name</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Description</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Daily amount</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Weekly amount</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Monthly amount</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Status</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {membershipsData.map((item) => (
            <tr key={item.id} className="mb-2">
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate ">{item.name}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">
                  <span>{item.description}</span>
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">{item.plans.find((v) => v.planTypeId === 1) ? item.plans.find((v) => v.planTypeId === 1).amount : 0}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">{item.plans.find((v) => v.planTypeId === 2) ? item.plans.find((v) => v.planTypeId === 2).amount : 0}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">{item.plans.find((v) => v.planTypeId === 3) ? item.plans.find((v) => v.planTypeId === 3).amount : 0}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.isActive ? 'Active' : 'Inactive'}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const MembershipTypeList = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const title = 'Membership Types';
  const description = 'Membership Types Page';
  const [membershipModal, setMembershipModal] = useState(false);
  const membershipsData = useSelector((state) => state.membership.types);
  const [ships, setShips] = useState([]);
  const status = useSelector((state) => state.membership.status);
  const [datas, setDatas] = useState([]);
  const [plans, setPlans] = useState([]);
  const [updatePlans, setUpdatePlans] = useState([]);

  const [isLoading, setisloading] = React.useState(false);
  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  });
  const initialValues = {
    name: '',
    plans: [
      {
        name: 'Daily',
        typeId: 1,
        amount: '',
      },
      {
        name: 'Weekly',
        typeId: 2,
        amount: '',
      },
      {
        name: 'Monthly',
        typeId: 3,
        amount: '',
      },
    ],
    description: '',
  };

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search] = useState('');
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
    setShips(membershipsData);
  }, [membershipsData]);

  React.useEffect(() => {
    dispatch(getmembershiptypes(page, search));
  }, [dispatch, page, search]);

  function nextPage() {
    if (membershipsData.length < 15) return;
    setPage(page + 1);
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

  const onSubmit = (values) => {
    dispatch(addMembershipType(values));
    setisloading(true);
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

  // highlight-ends
  function filterData(val) {
    const newData = membershipsData.filter((i) => i.name.toLowerCase().includes(val.toLowerCase()));
    setShips(newData);
  }
  // highlight-starts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((nextValue) => filterData(nextValue), 1000),
    []
  );

  const handleSearch = (e) => {
    debouncedSave(e.target.value);
  };

  React.useEffect(() => {
    if (status === 'success') {
      setMembershipModal(false);
      setisloading(false);
      values.name = '';
      values.plans = [
        {
          name: 'Daily',
          typeId: 1,
          amount: '',
        },
        {
          name: 'Weekly',
          typeId: 2,
          amount: '',
        },
        {
          name: 'Monthly',
          typeId: 3,
          amount: '',
        },
      ];
      values.description = '';
    }
    if (status === 'error') {
      setisloading(false);
    }
    if (status === 'update') {
      setisloading(false);
      dispatch(getmembershiptypes(1, ''));
      setMembershipModal(false);
      setUpdateData({
        name: '',
        description: '',
        plans: [
          {
            name: 'Daily',
            typeId: 1,
            amount: '',
          },
          {
            name: 'Weekly',
            typeId: 2,
            amount: '',
          },
          {
            name: 'Monthly',
            typeId: 3,
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
    setisloading(true);
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

      <Row className="mb-3">
        <Col md="5" lg="6" xxl="6" className="mb-1 d-flex align-items-center ">
          {/* Search Start */}
          <div className="d-inline-block float-md-start me-4 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="search" placeholder="Search" onChange={(e) => handleSearch(e)} />
            <span className="search-magnifier-icon">
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewMembership()}>
            <CsLineIcons icon="plus" /> <span>Add membership</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="6" xxl="6" className="mb-1 text-end">
          {/* Export Dropdown Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export </Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsLineIcons icon="download" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">
                {' '}
                <CsvDownloader filename="membershiptypes" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
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
                {membershipsData.length} Items
              </Dropdown.Toggle>
            </OverlayTrigger>
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
          <div className="text-muted text-small cursor-pointer ">DESCRIPTION</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">STATUS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer ">TOGGLE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer ">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {ships.length &&
        ships.map((item) => (
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
            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={membershipsData.length < 15}>
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
                      <Form.Label>{item.name} Amount</Form.Label>
                      <Form.Control type="number" required name={`plans[${index}].amount`} onChange={handleChange} value={item.amount} />
                    </div>
                  </div>
                ))}

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
                    <div className="mb-1">
                      <Form.Select
                        type="text"
                        name="planTypeId"
                        onChange={(e) => handlePlanUpdate(e, i)}
                        value={item.planTypeId || ''}
                        placeholder="Select duration"
                        disabled
                        readOnly
                        className="text-capitalize"
                      >
                        <option value="" disabled>
                          Select duration
                        </option>
                        {plans.map((plan) => (
                          <option value={plan.id} key={plan.id}>
                            {plan.name.toLowerCase()} amount
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="mb-3">
                      <Form.Control type="number" name="amount" onChange={(e) => handlePlanUpdate(e, i)} value={item.amount || ''} />
                    </div>
                  </div>
                ))}

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
