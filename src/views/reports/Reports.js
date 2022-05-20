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
  getReport,
  // eslint-disable-next-line import/extensions
} from '../../Report/ReportSlice';

const ReportList = () => {
  const title = 'Report';
  const description = 'Report  Page';
  const [ReportModal, setReportModal] = useState(false);
  const ReportsData = useSelector((state) => state.Report.Reports);
  const total = useSelector((state) => state.Report.total);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [updateData, setUpdateData] = useState({});

  React.useEffect(() => {
    dispatch(getReport(page, search));
  }, [dispatch, page, search]);

  function nextPage() {
    if (ReportsData.length / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
  }

  const toggleModal = () => {
    setReportModal(!ReportModal);
  };

  function viewReport(val) {
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
                {ReportsData.length} Items
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
          <div className="text-muted text-small cursor-pointer sort">EMAIL</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">TYPE</div>
        </Col>

        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DESCRIPTION</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">EXPIRED</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center">
          <div className="text-muted text-small cursor-pointer sort">Action</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {ReportsData.length ? (
        ReportsData.map((item) => (
          <Card key={item.id}>
            <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
              <Row className="g-0 h-100 align-content-center cursor-default">
                {/* <Col xs="11" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                <div className="text-muted text-small d-md-none">Id</div>
                <NavLink to="/Reports/detail" className="text-truncate h-100 d-flex align-items-center">
                  {item.id}
                </NavLink>
              </Col> */}
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                  <div className="text-muted text-small d-md-none">Email</div>
                  <div className="text-alternate">{item.email}</div>
                </Col>
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
                  <div className="text-muted text-small d-md-none">Name</div>
                  <div className="text-alternate">
                    <span>
                      {item.firstName} {item.lastName}
                    </span>
                  </div>
                </Col>
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                  <div className="text-muted text-small d-md-none">Type</div>
                  <div className="text-alternate">{item.ReportType}</div>
                </Col>

                <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
                  <div className="text-muted text-small d-md-none">Description</div>
                  <div className="text-alternate">{item.description}</div>
                </Col>

                <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                  <div className="text-muted text-small d-md-none">Status</div>
                  <div className="text-alternate text-capitalize">{item.expired}</div>
                </Col>

                <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-center mb-2 mb-md-0 order-2 text-end order-md-last">
                  <span className="d-flex">
                    {' '}
                    <span onClick={() => viewReport(item)} className="text-muted me-3 cursor-pointer">
                      View <CsLineIcons icon="eye" style={{ width: '12px', height: '12px' }} />
                    </span>
                  </span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="py-5 text-center">No information available </div>
      )}

      {/* List Items End */}

      {/* Pagination Start */}
      {ReportsData.length ? (
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
            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={ReportsData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      ) : (
        ''
      )}
      {/* Pagination End */}

      {/* Reporte Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={ReportModal} onHide={() => setReportModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">
            {isAdding && 'Add new Report'}
            {isEditing && 'Update new Report'}
            {isViewing && 'Report Information'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
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

                <hr className="my-4" />
              </div>
            )}
          </OverlayScrollbarsComponent>
        </Modal.Body>
      </Modal>
      {/* Reporte Detail Modal End */}
    </>
  );
};

export default ReportList;
