/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Dropdown, Form, Card, Pagination, Tooltip, OverlayTrigger } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useDispatch, useSelector } from 'react-redux';
import { debounce } from 'lodash';
import 'react-toastify/dist/ReactToastify.css';
import CsvDownloader from 'react-csv-downloader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { getTransactions, getRecentTransactions } from '../../transactions/transactionSlice';

const TransactionList = () => {
  const title = 'Transactions List';
  const description = 'Transactions List Page';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const transactionsData = useSelector((state) => state.transactions.items);
  const dispatch = useDispatch();
  const [showing, setShowing] = useState('all');
  const [datas, setDatas] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  React.useEffect(() => {
    dispatch(getTransactions(page, search));
  }, [dispatch, page, search]);

  function nextPage() {
    if (transactionsData.length / page > page) {
      setPage(page + 1);
    }
  }
  function prevPage() {
    if (page === 1) return;
    setPage(page - 1);
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

  function handleTransaction(type) {
    setShowing(type);
    if (type === 'all') {
      dispatch(getTransactions(page, search));
    } else {
      dispatch(getRecentTransactions(page, search));
    }
  }

  React.useEffect(() => {
    const newdata = transactionsData.map((item) => {
      return {
        cell1: item.name,
        cell2: item.email,
        cell3: item.amountDue,
        cell4: item.discount,
        cell5: item.amountPaid,
        cell6: item.naration,
      };
    });
    setDatas(newdata);
  }, [transactionsData]);

  const columns = [
    {
      id: 'cell1',
      displayName: 'NAME',
    },
    {
      id: 'cell2',
      displayName: 'EMAIL',
    },
    {
      id: 'cell3',
      displayName: 'AMOUNT DUE',
    },
    {
      id: 'cell4',
      displayName: 'DISCOUNT',
    },
    {
      id: 'cell5',
      displayName: 'AMOUNT PAID',
    },
    {
      id: 'cell6',
      displayName: 'NARATION',
    },
  ];

  React.useEffect(() => {
    if (fromDate && toDate) {
      dispatch(getTransactions(page, search, moment(fromDate).format('YYYY-MM-DD'), moment(toDate).format('YYYY-MM-DD')));
      return;
    }
    dispatch(getTransactions(page, search));
  }, [fromDate, toDate]);

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
          <div className="d-inline-block float-md-start mb-1 search-input-container w-100 shadow bg-foreground">
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
        <Col md="7" lg="8" xxl="8" className="mb-1 text-end">
          {/* Export Dropdown Start */}
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <OverlayTrigger delay={{ show: 1000, hide: 0 }} placement="top" overlay={<Tooltip id="tooltip-top">Export</Tooltip>}>
              <Dropdown.Toggle variant="foreground-alternate" className="dropdown-toggle-no-arrow btn btn-icon btn-icon-only shadow">
                <CsvDownloader filename="transactions" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
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
                {transactionsData.length} Items
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
      <Row className="mb-3">
        <Col sm="12" lg="6" xxl="6" className="mb-1 d-flex align-items-center ">
          {/* TOGGLE Start */}
          <div className="d-flex align-items-center me-4 mb-1  w-100 ">
            <label className="me-4 d-flex align-items-center">
              <input type="radio" value="all" checked={showing === 'all'} className="me-1" onChange={(e) => handleTransaction(e.target.value)} />
              All transactions
            </label>
            <label className="d-flex align-items-center">
              <input type="radio" className="me-1" checked={showing === 'recent'} value="recent" onChange={(e) => handleTransaction(e.target.value)} />
              Recent transactions
            </label>
          </div>

          {/* toggle End */}
        </Col>
        <Col sm="12" md="6">
          {' '}
          <div className="d-flex justify-content-between align-items-center px-3">
            <DatePicker
              className="border rounded  px-2 px-lg-3 py-1 py-lg-2 text-muted"
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              selectsStart
              startDate={fromDate}
              endDate={toDate}
              minDate={new Date()}
              isClearable
              placeholderText="Filter from"
            />

            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              selectsEnd
              startDate={fromDate}
              endDate={toDate}
              minDate={fromDate}
              isClearable
              placeholderText="Filter to"
              className="border rounded  px-2 px-lg-3 py-1 py-lg-2 text-muted"
            />
          </div>
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">EMAIL</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">AMOUNT DUE</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">DISCOUNT</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer sort">NARATION</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center px-1">
          <div className="text-muted text-small cursor-pointer sort">AMOUNT PAID</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {transactionsData && transactionsData.length ? (
        transactionsData.map((item) => (
          <Card key={item.id} className="mb-2">
            <Card.Body className="pt-md-0 pb-md-0 sh-auto sh-md-8">
              <Row className="g-0 h-100 align-content-center cursor-default">
                <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2 px-1">
                  <div className="text-muted text-small d-md-none">Email</div>
                  <div className="text-alternate">{item.email}</div>
                </Col>
                <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3 px-1">
                  <div className="text-muted text-small d-md-none">Name</div>
                  <div className="text-alternate">
                    <span>{item.name}</span>
                  </div>
                </Col>
                <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Amount due</div>
                  <div className="text-alternate"> <span className="">₦</span>{item.amountDue}</div>
                </Col>
                <Col xs="12" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Discount</div>
                  <div className="text-alternate">{item.discount}</div>
                </Col>
                <Col xs="12" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Narration</div>
                  <div className="text-alternate">{item.narration}</div>
                </Col>
                <Col xs="12" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Amount paid</div>
                  <div className="text-alternate"> <span className="">₦</span>{item.amountPaid}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div className="text-center py-4 text-muted">No transaction available</div>
      )}

      {/* List Items End */}

      {/* Pagination Start */}
      {transactionsData.length ? (
        <div className="d-flex justify-content-center mt-5">
          <Pagination>
            <Pagination.Prev className="shadow" disabled={page === 1} onClick={() => prevPage()}>
              <CsLineIcons icon="chevron-left" />
            </Pagination.Prev>

            <Pagination.Next className="shadow" onClick={() => nextPage()} disabled={transactionsData.length / page > page}>
              <CsLineIcons icon="chevron-right" />
            </Pagination.Next>
          </Pagination>
        </div>
      ) : (
        ''
      )}
      {/* Pagination End */}
    </>
  );
};

export default TransactionList;
