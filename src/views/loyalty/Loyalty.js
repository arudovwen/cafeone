/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useState, useRef, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Pagination, Tooltip, OverlayTrigger, Modal, Spinner } from 'react-bootstrap';
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
  addCampaign,
  getCampaign,
  getCampaigns,
  updateCampaign,
  activateCampaign,
  deactivateCampaign,
  deleteCampaign,
  updateCampaignStatus,
  getCampaignDiscountType,

  // eslint-disable-next-line import/extensions
} from '../../campaigns/campaignSlice';
import { getBranches } from '../../branches/branchSlice';
import { getMembers } from '../../members/memberSlice';
import {
  getmembershiptypes,

  // eslint-disable-next-line import/extensions
} from '../../membership/membershipSlice';

const ComponentToPrint = forwardRef((props, ref) => {
  const campaignsData = useSelector((state) => state.campaigns.items);
  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <table align="left" border="1" cellSpacing="5" cellPadding="15" style={{ border: '1px solid #ccc' }}>
        <thead className="">
          <tr align="left">
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium">Branch</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Membership</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Description</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Start date</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">End date</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Usage per member</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Value</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Status </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {campaignsData.map((item) => (
            <tr key={item.id} className="mb-2">
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate ">{item.branch ? item.branch : '-'}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">
                  <span>{item.membershipType ? item.membershipType : '-'}</span>
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.description}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">{moment(item.startDate).format('llll')}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{moment(item.expiryDate).format('llll')}</div>
              </td>

              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.usagePerMember}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>
                  {item.value}
                  {item.typeId === 1 ? '' : '%'}
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.status ? 'Active' : 'Inactive'}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

const CampaignTypeList = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [isLoading, setisloading] = React.useState(false);
  const [datas, setDatas] = useState([]);
  const title = 'Campaigns ';
  const description = 'Campaigns Page';
  const [campaignModal, setCampaignModal] = useState(false);
  const campaignsData = useSelector((state) => state.campaigns.items);
  const status = useSelector((state) => state.campaigns.status);
  const initialValues = {
    discountType: 1,
    description: '',
    value: '',
    startDate: null,
    expiryDate: null,
    usagePerMember: '',
    membershipTypeId: '',
    branchId: '',
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [startDateFrom, setStartDateFrom] = useState(null);
  const [startDateTo, setStartDateTo] = useState(null);
  const [branchId, setBranch] = useState(null);
  const [membershipId, setMembershipId] = useState(null);
  const branchesData = useSelector((state) => state.branches.branches).map((i) => {
    return {
      name: i.name,
      value: i.id,
    };
  });
  const membershipsData = useSelector((state) => state.membership.types).map((i) => {
    return {
      name: i.name,
      value: i.id,
    };
  });
  const [type, setType] = React.useState('branch');
  const [duration, setDuration] = React.useState(1);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [discountTypes, setDiscountTypes] = useState([]);

  React.useEffect(() => {
    dispatch(getmembershiptypes(page, search));
    dispatch(getBranches(page, search, 50));
    dispatch(getCampaigns(page, search));
    dispatch(getMembers(page, search, 50));
    dispatch(getCampaignDiscountType()).then((res) => {
      setDiscountTypes(res.data);
    });
  }, [dispatch, page, search]);

  function nextPage() {
    if (campaignsData.length < 15) return;
    setPage(page + 1);
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }
  const validationSchema = Yup.object().shape({
    discountType: Yup.string().required('Discount type is required'),
    value: Yup.string().required('Value  is required'),
    description: Yup.string().required('Description is required'),
  });

  const toggleModal = () => {
    setCampaignModal(!campaignModal);
  };

  const onSubmit = (values) => {
    dispatch(addCampaign(values));
    setisloading(true);
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
  function handleType(e) {
    setType(e.target.value);
  }

  function toggleStatus(e, id) {
    const value = e.target.checked;
    if (!value) {
      dispatch(deactivateCampaign(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(updateCampaignStatus({ id, value }));
        }
      });
    }
    if (value) {
      dispatch(activateCampaign(id)).then((res) => {
        if (res.status === 200) {
          toast.success('Status changed');
          dispatch(updateCampaignStatus({ id, value }));
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
    setStartDate(new Date(val.startDate));
    setEndDate(new Date(val.expiryDate));
    val.branchId ? setType('branch') : setType('membership');
    setUpdateData({ ...val, discountType: val.typeId });
    setIsEditing(true);
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
  // const debouncedSave = useCallback(
  //   debounce((nextValue) => setSearch(nextValue), 1000),
  //   []
  // );
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

  // highlight-ends
  // const handleSearch = (e) => {
  //   debouncedSave(e.target.value);
  // };

  React.useEffect(() => {
    if (status === 'success') {
      setCampaignModal(false);

      values.discountType = 1;
      values.description = '';
      values.value = '';
      values.startDate = null;
      values.expiryDate = null;
      values.usagePerMember = '';
      values.membershipTypeId = '';
      values.branchId = '';
      setStartDate(null);
      setEndDate(null);
      setisloading(false);
    }
    if (status === 'error') {
      setisloading(false);
    }
    if (status === 'update') {
      setisloading(false);

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
    setisloading(true);
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
    if (branchId || membershipId) {
      dispatch(getCampaigns(1, '', moment(startDateFrom).format('YYYY-MM-DD'), moment(startDateTo).format('YYYY-MM-DD'), branchId, membershipId));
      return;
    }

    dispatch(getCampaigns(1, ''));
  }, [startDateFrom, startDateTo, branchId, membershipId]);

  React.useEffect(() => {
    if (!campaignsData.length) return;
    const newdata = campaignsData.map((item) => {
      return {
        cell1: item.branch ? item.branch : '-',
        cell2: item.membershipType ? item.membershipType : '-',
        cell3: item.totalUsage,
        cell4: item.usagePerMember,
        cell5: item.value,
        cell6: moment(item.startDate).format('llll'),
        cell7: moment(item.expiryDate).format('llll'),
        cell8: item.description,
        cell9: item.status,
      };
    });
    setDatas(newdata);
  }, [campaignsData]);

  const columns = [
    {
      id: 'cell1',
      displayName: 'BRANCH',
    },
    {
      id: 'cell2',
      displayName: 'MEMBERSHIPT TYPE',
    },
    {
      id: 'cell3',
      displayName: 'USAGE',
    },
    {
      id: 'cell4',
      displayName: 'USAGE PER USER',
    },
    {
      id: 'cell5',
      displayName: 'VALUE',
    },
    {
      id: 'cell6',
      displayName: 'START DATE',
    },
    {
      id: 'cell7',
      displayName: 'EXPIRY DATE',
    },
    {
      id: 'cell8',
      displayName: 'DESCRIPTION',
    },
    {
      id: 'cell9',
      displayName: 'STATUS',
    },
  ];

  function resetFilter() {
    setStartDateFrom(null);
    setStartDateTo(null);
    setMembershipId(null);
    setBranch(null);
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
        <Col md="5" lg="7" xxl="6" className="mb-1 d-flex align-items-center ">
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

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => addNewCampaign()}>
            <CsLineIcons icon="plus" /> <span>Add campaign</span>
          </Button>

          {/* Search End */}
        </Col>
        <Col md="7" lg="5" xxl="6" className="mb-1 text-end">
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
                <CsvDownloader filename="campaigns" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
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
                {campaignsData.length} Items
              </Dropdown.Toggle>
            </OverlayTrigger>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>
      {/* Date filter starts   */}
      <Row className="mb-5 justify-content-between mb-2 mb-lg-1 gap-1 gap-md-0">
        <Col xs="12" md="5" className="mb-2 mb-md:0">
          <div className="d-flex align-items-center gap-3">
            <DatePicker
              className="border rounded-sm  px-2 px-lg-3 py-2 py-lg-2 text-muted w-100"
              selected={startDateFrom}
              onChange={(date) => setStartDateFrom(date)}
              selectsStart
              endDate={startDateTo}
              isClearable
              placeholderText="Start Date From"
              showTimeSelect
            />

            <DatePicker
              selected={startDateTo}
              onChange={(date) => setStartDateTo(date)}
              selectsEnd
              startDate={startDateFrom}
              endDate={startDateTo}
              minDate={startDateFrom}
              isClearable
              placeholderText="Start Date To"
              className="border rounded-sm px-2 px-lg-3 py-2 py-lg-2 text-muted w-100"
              showTimeSelect
            />
          </div>
        </Col>
        <Col xs="12" md="5" className="d-flex gap-3">
          <SelectSearch
            filterOptions={() => fuzzySearch(branchesData)}
            options={branchesData}
            search
            name="members"
            value={branchId}
            onChange={(val) => setBranch(val)}
            placeholder="Filter by branch"
          />
          <SelectSearch
            filterOptions={() => fuzzySearch(membershipsData)}
            options={membershipsData}
            search
            name="members"
            value={membershipId}
            onChange={(val) => setMembershipId(val)}
            placeholder="Filter by membership"
          />
        </Col>
        <Col xs="12" md="2" className="d-flex align-items-center mt-2 mt-md-0">
          <span onClick={() => resetFilter()} className="cursor-pointer d-flex align-items-center">
            <span className="me-1">Reset filter</span> <CsLineIcons icon="refresh-horizontal" size="13" />
          </span>
        </Col>
      </Row>
      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 mt-5">
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">BRANCH / MEMBERSHIP</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">START DATE</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">END DATE</div>
        </Col>

        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">USAGE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">STATUS</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer ">TOGGLE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer ">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {campaignsData.map((item) => (
        <Card key={item.id} className="mb-2">
          <Card.Body className="pt-md-0 pb-md-0 sh-auto sh-md-8">
            <Row className="g-0 h-100 align-content-center cursor-default">
              <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1">
                <div className="text-muted text-small d-md-none">{item.branch ? 'Branch' : 'Membership type'}</div>
                <div className="text-alternate">{item.branch ? item.branch : item.membershipType}</div>
              </Col>
              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-2">
                <div className="text-muted text-small d-md-none">Start Date</div>
                <div className="text-alternate">
                  <span>{item.startDate ? moment(item.startDate).format('llll') : '-'}</span>
                </div>
              </Col>

              <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-3">
                <div className="text-muted text-small d-md-none">End date</div>
                <div className="text-alternate">{item.expiryDate ? moment(item.expiryDate).format('llll') : '-'}</div>
              </Col>
              <Col xs="12" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-4">
                <div className="text-muted text-small d-md-none">Usage/Member </div>
                <div className="text-alternate">{item.usagePerMember ? item.usagePerMember : '-'}</div>
              </Col>

              <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5 px-0">
                <div className="text-muted text-small d-md-none">Status</div>
                <div>{item.statusId ? <Badge bg="outline-primary">Active</Badge> : <Badge bg="outline-warning">Inactive</Badge>}</div>
              </Col>

              <Col xs="6" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-last order-md-5 px-0">
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
              <Col xs="12" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-last text-end order-md-last">
                <Button variant="primary" type="button" size="sm" onClick={() => viewCampaign(item)} className="">
                  View
                </Button>
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

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={campaignsData.length < 15}>
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
              <form onSubmit={handleSubmit} className="pb-5">
                <div className="mb-3">
                  <Form.Label>Discount type</Form.Label>
                  <Form.Select type="text" name="discountType" onChange={handleChange} value={values.discountType}>
                    <option value="" disabled>
                      Select discount type
                    </option>
                    {discountTypes.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <Form.Label>{Number(values.discountType) === 2 ? 'Percentage Value (%)' : 'Discount Value'}</Form.Label>
                  <Form.Control type="number" name="value" onChange={handleChange} value={values.value} />
                  {errors.value && touched.value && <div className="d-block invalid-tooltip">{errors.value}</div>}
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={handleChange} value={values.description} />
                  {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}
                </div>

                <div>
                  <div className="mb-3">
                    <Form.Label>Campaign type</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        id="branch"
                        label="Branch"
                        className="me-4"
                        value="branch"
                        checked={type === 'branch'}
                        onChange={(e) => handleType(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="membership"
                        label="Membership"
                        value="membership"
                        checked={type === 'membership'}
                        onChange={(e) => handleType(e)}
                      />
                    </div>
                  </div>

                  {type === 'branch' ? (
                    <div className="mb-3">
                      <Form.Label>Select branch</Form.Label>
                      <Form.Select type="text" name="branchId" onChange={handleChange} value={values.branchId}>
                        <option value="" disabled>
                          Select branch
                        </option>
                        {branchesData.map((item) => (
                          <option value={item.value} key={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <Form.Label>Select membership</Form.Label>
                        <Form.Select type="text" name="membershipTypeId" onChange={handleChange} value={values.membershipTypeId}>
                          <option value="" disabled>
                            Select membership type
                          </option>
                          {membershipsData.map((item) => (
                            <option value={item.value} key={item.value}>
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="mb-3">
                        <Form.Label>Discount type</Form.Label>
                        <Form.Select
                          type="select"
                          name="duration"
                          onChange={(e) => {
                            setDuration(e.target.value);
                          }}
                          value={duration}
                        >
                          <option value="" disabled>
                            Select duration
                          </option>
                          <option value={1}>Limited</option>
                          <option value={2}>Unlimited</option>
                        </Form.Select>
                      </div>

                      <div className="mb-3">
                        <Form.Label>Usage per-member </Form.Label>
                        <Form.Control type="number" name="usagePerMember" onChange={handleChange} value={values.usagePerMember} />
                        {errors.usagePerMember && touched.usagePerMember && <div className="d-block invalid-tooltip">{errors.usagePerMember}</div>}
                      </div>
                    </>
                  )}
                </div>

                {duration == 1 ? (
                  <div className="mb-3 mt-3">
                    <Form.Label>Duration</Form.Label>

                    <div className="d-flex justify-content-between align-items-center">
                      <DatePicker
                        className="border rounded-sm px-2 py-1 text-muted w-100"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        minDate={new Date()}
                        startDate={startDate}
                        endDate={endDate}
                        placeholder="Start date"
                        showTimeSelect
                      />

                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="border rounded-sm px-2 py-1 text-muted w-100"
                        placeholder="Expiry date"
                        showTimeSelect
                      />
                    </div>
                    {errors.startDate && touched.startDate && <div className="d-block invalid-tooltip">{errors.startDate}</div>}
                  </div>
                ) : (
                  ''
                )}
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
                  <Form.Label>Discount type</Form.Label>
                  <Form.Select type="text" name="discountType" onChange={handleChange} value={updateData.discountType}>
                    <option value="" disabled>
                      Select discount type
                    </option>
                    {discountTypes.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="mb-3">
                  <Form.Label>{Number(values.discountType) === 2 ? 'Percentage Value (%)' : 'Discount Value'}</Form.Label>
                  <Form.Control type="number" name="value" onChange={(e) => handleUpdateChange(e)} value={updateData.value} />
                </div>

                <div className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" name="description" as="textarea" rows={3} onChange={handleChange} value={updateData.description} />
                </div>

                <div>
                  <div className="mb-3">
                    <Form.Label>Campaign type</Form.Label>
                    <div className="d-flex">
                      <Form.Check
                        type="radio"
                        id="branch"
                        label="Branch"
                        className="me-4"
                        value="branch"
                        checked={type === 'branch'}
                        onChange={(e) => handleType(e)}
                      />
                      <Form.Check
                        type="radio"
                        id="membership"
                        label="Membership"
                        value="membership"
                        checked={type === 'membership'}
                        onChange={(e) => handleType(e)}
                      />
                    </div>
                  </div>

                  {type === 'branch' ? (
                    <div className="mb-3">
                      <Form.Label>Select branch</Form.Label>
                      <Form.Select type="text" name="branchId" onChange={(e) => handleUpdateChange(e)} value={updateData.branchId}>
                        <option value="" disabled>
                          Select branch
                        </option>
                        {branchesData.map((item) => (
                          <option value={item.value} key={item.value}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <Form.Label>Select membership</Form.Label>
                        <Form.Select type="text" name="membershipTypeId" onChange={(e) => handleUpdateChange(e)} value={updateData.membershipTypeId}>
                          <option value="" disabled>
                            Select membership type
                          </option>
                          {membershipsData.map((item) => (
                            <option value={item.value} key={item.value}>
                              {item.name}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                      <div className="mb-3">
                        <Form.Label>Discount type</Form.Label>
                        <Form.Select
                          type="select"
                          name="duration"
                          onChange={(e) => {
                            setDuration(e.target.value);
                          }}
                          value={duration}
                        >
                          <option value="" disabled>
                            Select duration
                          </option>
                          <option value={1}>Limited</option>
                          <option value={2}>Unlimited</option>
                        </Form.Select>
                      </div>

                      <div className="mb-3">
                        <Form.Label>Usage per-member </Form.Label>
                        <Form.Control type="number" name="usagePerMember" onChange={(e) => handleUpdateChange(e)} value={updateData.usagePerMember} />
                      </div>
                    </>
                  )}
                </div>

                {duration == 1 ? (
                  <div className="mb-3 mt-3">
                    <Form.Label>Duration</Form.Label>

                    <div className="d-flex justify-content-between align-items-center">
                      <DatePicker
                        className="border rounded-sm px-2 py-1 text-muted"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        minDate={new Date()}
                        startDate={startDate}
                        endDate={endDate}
                        placeholder="Start date"
                        showTimeSelect
                      />

                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="border rounded-sm px-2 py-1 text-muted"
                        placeholder="Expiry date"
                        showTimeSelect
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}

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
                    {updateData.branch && (
                      <tr>
                        <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Branch</td>
                        <td className=" py-2 px-1 border-bottom">{updateData.branch}</td>
                      </tr>
                    )}
                    {updateData.membershipType && (
                      <tr>
                        <td className="font-weight-bold  py-2 px-1 border-bottom py-2 px-1 border-bottom text-uppercase text-muted"> Membership type</td>
                        <td className=" py-2 px-1 border-bottom">{updateData.membershipType}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Description</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.description}</td>
                    </tr>

                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Usage per member</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.usagePerMember || '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Start date </td>
                      <td className=" py-2 px-1 border-bottom">{updateData.startDate ? moment(updateData.startDate).format('llll') : '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">Expiry date</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.expiryDate ? moment(updateData.expiryDate).format('llll') : '-'}</td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">{updateData.type} Value</td>
                      <td className=" py-2 px-1 border-bottom">
                        {updateData.value} {updateData.typeId === 1 ? '' : '%'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-weight-bold  py-2 px-1 border-bottom text-uppercase text-muted">status</td>
                      <td className=" py-2 px-1 border-bottom">{updateData.status}</td>
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
