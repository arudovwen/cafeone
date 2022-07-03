/* eslint-disable react-hooks/exhaustive-deps */
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
  updateBranchstatus,
  updateBranchSeat,
  activateSeat,
  deactivateSeat,
} from '../../branches/branchSlice';
import { uploadPhoto } from '../../members/memberSlice';

const ComponentToPrint = forwardRef((props, ref) => {
  const branchesData = useSelector((state) => state.branches.branches);
  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <table align="left" border="1" cellSpacing="5" cellPadding="15" style={{ border: '1px solid #ccc' }}>
        <thead className="">
          <tr align="left">
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium">NAME</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Location</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Seats</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Status</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {branchesData.map((item) => (
            <tr key={item.id} className="mb-2">
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate ">{item.name}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">
                  <span>{item.location}</span>
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">{item.seatCount}</div>
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

const BranchesList = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const title = 'Branches List';
  const description = 'Branches List Page';
  const [branchModal, setBranchModal] = useState(false);
  const branchesData = useSelector((state) => state.branches.branches);
  const status = useSelector((state) => state.branches.status);
  const [datas, setDatas] = useState([]);
  const [isUploading, setIsUploading] = useState(null);
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
    city: '',
    state: '',
  };
  const [isLoading, setisloading] = React.useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  // const [isShowing, setIsShowing] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isAddSeat, setIsAddSeat] = useState(false);
  const [isSeatEditing, setIsSeatEditing] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [seats, setSeats] = useState([]);
  React.useEffect(() => {
    dispatch(getBranches(page, search));
  }, [dispatch, page, search]);

  function nextPage() {
    if (branchesData.length < 15) return;
      setPage(page + 1);

  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Branch name is required'),
    location: Yup.string().required('Location name is required'),
    state: Yup.string().required('State is required'),
  });

  const toggleModal = () => {
    setBranchModal(!branchModal);
  };

  const onSubmit = (values) => {
    dispatch(addBranch(values));

    setisloading(true);
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
          setIsSeatEditing(false);
        }
      });
    }
  }
  function editThisSeat(data) {
    setIsAdding(false);
    setIsViewing(false);
    setIsEditing(false);
    setIsSeatEditing(true);
    setSeatInfo({ ...data, branchId: updateData.id, image: data.photo });
  }

  function deleteThisSeat(id) {
    const conf = window.confirm('Are you sure?');
    if (conf) {
      dispatch(deleteBranchSeat({ seat_id: id, id: updateData.id })).then((res) => {
        if (res.status === 200) {
          dispatch(getBranches(page, search));
          const newseat = seats.filter((item) => item.id !== id);
          setSeats(newseat);
          setUpdateData({ ...updateData, seatCount: newseat.length });

          setIsAdding(false);
          setIsSeatEditing(false);
          setIsEditing(false);
          setIsViewing(true);
          toast.success('Seat removed');
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
          dispatch(updateBranchstatus({ id, value }));
        }
      });
    }
    if (value) {
      dispatch(activateBranch(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(updateBranchstatus({ id, value }));
        }
      });
    }
  }
  function toggleSeatStatus(e, id) {
    const value = e.target.checked;
    if (!value) {
      dispatch(deactivateSeat(id, updateData.id)).then((res) => {
        if (res.status === 200) {
          const newseat = seats.map((item) => {
            if (item.id === id) {
              item.statusId = 0;
            }
            return item;
          });
          setSeats(newseat);
          toast.success('Status changed');
        }
      });
    }
    if (value) {
      dispatch(activateSeat(id, updateData.id)).then((res) => {
        if (res.status === 200) {
          const newseat = seats.map((item) => {
            if (item.id === id) {
              item.statusId = 1;
            }
            return item;
          });
          setSeats(newseat);
          toast.success('Status changed');
        }
      });
    }
  }
  function addNewBranch() {
    setIsViewing(false);
    setIsEditing(false);
    setIsSeatEditing(false);
    setIsAddSeat(false);
    setIsAdding(true);
    toggleModal();
  }

  function editBranch(val) {
    setIsAdding(false);
    setIsViewing(false);
    setIsSeatEditing(false);
    setIsAddSeat(false);
    setIsEditing(true);

    dispatch(getBranch(val.id)).then((res) => {
      const info = res.data;

      setUpdateData(info);
    });
  }

  function viewBranch(val) {
    setIsAdding(false);
    setIsSeatEditing(false);
    setIsAddSeat(false);
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
      setisloading(false);
      values.name = '';
      values.location = '';
      values.description = '';
      values.location = '';
      values.city = '';
      values.state = '';
      setIsUploading(null);
    }
    if (status === 'error') {
      setisloading(false);
    }
    if (status === 'update') {
      setisloading(false);
      setIsUploading(null);
      dispatch(getBranches(1, ''));
      setBranchModal(false);
      setUpdateData({
        name: '',
        location: '',
        description: '',
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
    setisloading(true);
    e.preventDefault();
    dispatch(updateBranch(updateData));
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading('loading');
    dispatch(uploadPhoto(formData)).then((res) => {
      setIsUploading('loaded');
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
    setIsSeatEditing(false);
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
    setisloading(true);
    dispatch(addBranchSeat(seatInfo)).then((res) => {
      if (res.status === 200) {
        setisloading(false);
        dispatch(getBranches(page, search));
        const newseat = [res.data, ...seats];
        setSeats(newseat);
        setUpdateData({ ...updateData, seatCount: newseat.length });
        setIsAdding(false);
        setIsViewing(true);
        setIsSeatEditing(false);
        setIsEditing(false);
        setIsAddSeat(false);
        toast.success('Seat added');
      }
    });
  }

  React.useEffect(() => {
    const newdata = branchesData.map((item) => {
      return {
        cell1: item.name,
        cell2: item.location,
        cell3: item.seatCount,
        cell4: item.state,
      };
    });

    setDatas(newdata);
  }, [branchesData]);
  const columns = [
    {
      id: 'cell1',
      displayName: 'NAME',
    },
    {
      id: 'cell2',
      displayName: 'LOCATION',
    },
    {
      id: 'cell3',
      displayName: 'SEATS',
    },
    {
      id: 'cell4',
      displayName: 'STATE',
    },
  ];

  function handleSeatUpdate(e) {
    e.preventDefault();
    setisloading(true);
    dispatch(updateBranchSeat(seatInfo)).then((res) => {
      if (res.status === 200) {
        setisloading(false);
        const newseat = seats.map((item) => {
          if (item.id === seatInfo.id) {
            item.name = seatInfo.name;
            item.photo = seatInfo.image;
          }
          return item;
        });
        setUpdateData({ ...updateData, seatCount: newseat.length });
        setSeats(newseat);
        setIsAdding(false);
        setIsSeatEditing(false);
        setIsEditing(false);
        setIsAddSeat(false);
        setIsViewing(true);
        setSeatInfo({});
        toast.success('Seat updated');
      }
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
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export </Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsLineIcons icon="download" />
              </Dropdown.Toggle>
            </OverlayTrigger>
            <Dropdown.Menu className="shadow dropdown-menu-end">
              <Dropdown.Item href="#">
                {' '}
                <CsvDownloader filename="branches" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
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
                {branchesData.length} Items
              </Dropdown.Toggle>
            </OverlayTrigger>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 mt-5">
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">NAME</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">LOCATION</div>
        </Col>

        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">SEATS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">STATUS</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">TOGGLE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center px-1">
          <div className="text-muted text-small cursor-pointer  text-right">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {branchesData.map((item) => (
        <Card className="mb-2" key={item.id}>
          <Card.Body className="pt-md-0 pb-md-0 sh-auto sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-2 px-1">
                <div className="text-muted text-small d-md-none">Name</div>
                <div className="text-alternate">{item.name}</div>
              </Col>
              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-3 px-1">
                <div className="text-muted text-small d-md-none">Location</div>
                <div className="text-alternate">
                  <span>{item.location}</span>
                </div>
              </Col>

              <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-4 px-1">
                <div className="text-muted text-small d-md-none">Seats</div>
                <div className="text-alternate">{item.seatCount}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-5 px-1">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.statusId ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>
              <Col xs="6" md="2" className="d-flex flex-column justify-content-start align-items-md-end mb-2 mb-md-0 order-5 px-1 order-md-last">
                <div className="text-muted text-small d-md-none">Toggle Status</div>
                <Form.Switch
                  className=""
                  type="checkbox"
                  checked={item.statusId}
                  onChange={(e) => {
                    toggleStatus(e, item.id);
                  }}
                />
              </Col>
              <Col xs="12" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-last text-end order-md-last">
                <Button variant="primary" type="button" size="sm" onClick={() => viewBranch(item)} className="">
                  View
                </Button>
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
            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={branchesData.length < 15}>
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
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" onChange={handleChange} value={values.state} />
                  {errors.state && touched.state && <div className="d-block invalid-tooltip">{errors.state}</div>}
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
                  <Form.Label>Branch name</Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleUpdateChange(e)} value={updateData.name} />
                </div>
                <div className="mb-3">
                  <Form.Label>Branch location</Form.Label>
                  <Form.Control type="text" name="location" onChange={(e) => handleUpdateChange(e)} value={updateData.location} />
                </div>

                <div className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" name="state" onChange={(e) => handleUpdateChange(e)} value={updateData.state} />
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
                  <Form.Label>
                    <span className="me-1">Image</span>
                    {isUploading === 'loaded' ? <CsLineIcons icon="check" size="12" variant="primary" /> : ''}
                    {isUploading === 'loading' ? <Spinner animation="border" role="status" className="text-success" size="sm" /> : ''}
                  </Form.Label>
                  <input type="file" id="image" className="form-control" accept="image" name="image" onChange={handleFile} />
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
            {isSeatEditing && (
              <form onSubmit={(e) => handleSeatUpdate(e)}>
                <div className="mb-3">
                  <Form.Label>Seat name</Form.Label>
                  <Form.Control type="text" name="name" onChange={(e) => handleSeatChange(e)} value={seatInfo.name} />
                </div>
                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={(e) => handleSeatChange(e)} value={seatInfo.location} />
                </div>
                <div className="mb-3">
                  <Form.Label>
                    <span className="me-1">Image</span>
                    {isUploading === 'loaded' ? <CsLineIcons icon="check" size="12" variant="primary" /> : ''}
                    {isUploading === 'loading' ? <Spinner animation="border" role="status" className="text-success" size="sm" /> : ''}
                  </Form.Label>
                  <input type="file" id="image" className="form-control" accept="image" name="image" onChange={handleFile} />
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
                      <td className=" py-2 px-1 border-bottom">{updateData.location}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">State</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.state}</td>
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
                    <CsLineIcons icon="edit" size="13" /> <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="outline-danger" size="sm" className="btn-icon btn-icon-start  mb-1" onClick={() => deleteThisBranch(updateData.id)}>
                    <CsLineIcons icon="bin" className="text-small" size="13" /> <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <hr className="my-4" />

                <h5>Seat Information</h5>

                <div className="" style={{ maxHeight: '400px', overflowY: 'auto', paddingBottom:"40px" }}>
                  {seats && seats.length ? (
                    <table className="mb-5 w-100 bg-light p-3 rounded-lg w-100">
                      <thead>
                        <tr>
                          <th className="text-small text-muted  font-weight-bold  py-2 px-2  border-bottom text-uppercase text-muted">Image</th>
                          <th className="text-small text-muted font-weight-bold  py-2 px-2   border-bottom text-uppercase text-muted">Name</th>

                          <th className="text-small text-muted  font-weight-bold  py-2 px-2  border-bottom text-uppercase text-muted">Status</th>

                          <th className=" text-small text-muted font-weight-bold  py-2 px-2   border-bottom text-uppercase text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seats &&
                          seats.map((item) => (
                            <tr key={item.id} className="border-bottom ">
                              <td className="px-2  border-bottom py-2">
                                <img
                                   src={item.photo?`${process.env.REACT_APP_URL}/${item.photo}`:'https://via.placeholder.com/150'}
                                  className="rounded-full"
                                  alt="image"
                                  style={{ width: '30px', height: '30px' }}
                                />
                              </td>
                              <td className="px-2  border-bottom py-2"> {item.name}</td>
                              <td className="px-2  border-bottom py-2">
                                <Form.Switch
                                  className=""
                                  type="checkbox"
                                  checked={item.statusId}
                                  onChange={(e) => {
                                    toggleSeatStatus(e, item.id);
                                  }}
                                />
                              </td>

                              <td className=" py-2 px-2 border-bottom">

                                <Dropdown className="">
                                  <Dropdown.Toggle variant="light" as="div" className="text-center" bsPrefix="dot">
                                    <CsLineIcons icon="more-vertical" className="text-small" size="12" />{' '}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu className="shadow dropdown-menu-end">
                                    <Dropdown.Item onClick={() => editThisSeat(item)}>Edit</Dropdown.Item>
                                    <Dropdown.Item onClick={() => deleteThisSeat(item.id)}>Drop</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
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
