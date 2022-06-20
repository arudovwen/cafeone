/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-alert */
import React, { useState, useCallback, useRef, forwardRef } from 'react';
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
import { useReactToPrint } from 'react-to-print';
import { getTransactions, getRecentTransactions } from '../../transactions/transactionSlice';

const ComponentToPrint = forwardRef((props, ref) => {
  const transactionsData = useSelector((state) => state.transactions.items);
  return (
    <div ref={ref} style={{ padding: '20px' }}>
      <table align="left" border="1" cellSpacing="5" cellPadding="15" style={{ border: '1px solid #ccc' }}>
        <thead className="">
          <tr align="left">
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium">Date</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Name</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Campaign</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Amount</div>
            </th>

            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Naration</div>
            </th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
              <div className="text-muted text-medium ">Status </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactionsData.map((item) => (
            <tr key={item.id} className="mb-2">
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate ">{moment(item.dateCreated).format('ll')}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div className="text-alternate">
                  <span>{item.member.name}</span>
                </div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.campaign}</div>
              </td>

              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.subTotal}</div>
              </td>
              <td style={{ borderBottom: '1px solid #ccc', padding: '4px 5px' }}>
                <div>{item.naration}</div>
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

const TransactionList = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
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
  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
  });
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
        cell1: moment(item.dateCreated).format('ll'),
        cell2: item.member.name,
        cell3: item.amountPayable,
        cell4: item.discount,
        cell5: item.subTotal,
        cell6: item.status,
        cell7: item.naration,
      };
    });
    setDatas(newdata);
  }, [transactionsData]);

  const columns = [
    {
      id: 'cell1',
      displayName: 'DATE',
    },
    {
      id: 'cell2',
      displayName: 'NAME',
    },
    {
      id: 'cell3',
      displayName: 'AMOUNT',
    },
    {
      id: 'cell4',
      displayName: 'DISCOUNT',
    },
    {
      id: 'cell5',
      displayName: 'SUBTOTAL',
    },
    {
      id: 'cell6',
      displayName: 'STATUS',
    },
    {
      id: 'cell7',
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

  function resetFilter() {
    setFromDate(null);
    setToDate(null);
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
        <Col md="5" lg="4" className="mb-1 d-flex align-items-center ">
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
        <Col md="7" lg="8" className="mb-1 text-end d-none d-md-inline">
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
                <CsvDownloader filename="transactions" extension=".csv" separator=";" wrapColumnChar="'" columns={columns} datas={datas}>
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
                {transactionsData.length} Items
              </Dropdown.Toggle>
            </OverlayTrigger>
          </Dropdown>
          {/* Length End */}
        </Col>
      </Row>
      <Row className="mb-3 justify-content-between align-items-center">
        <Col sm="12" md="5" className="mb-1 d-flex align-items-center ">
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
        <Col sm="12" md="5">
          {' '}
          <div className="d-flex justify-content-end  align-items-center px-md-3 gap-1">
            <DatePicker
              className="border rounded-sm  px-2 px-lg-3 py-2 py-lg-2 text-muted me-2 w-100"
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
              className="border rounded-sm  px-2 px-lg-3 py-2 py-lg-2 text-muted w-100"
            />
          </div>
        </Col>
        <Col xs="12" md="2" className="d-flex align-items-center">
          <span onClick={() => resetFilter()} className="cursor-pointer d-flex align-items-center">
            <span className="me-1">Reset filter</span> <CsLineIcons icon="refresh-horizontal" size="13" />
          </span>
        </Col>
      </Row>

      {/* List Header Start */}
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-">
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">DATE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">NAME</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">AMOUNT </div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">DISCOUNT</div>
        </Col>

        <Col md="2" className="d-flex flex-column pe-1 justify-content-center text-center px-1">
          <div className="text-muted text-small cursor-pointer  text-left">SUBTOTAL</div>
        </Col>
        <Col md="1" className="d-flex flex-column pe-1 justify-content-center text-center px-1">
          <div className="text-muted text-small cursor-pointer  text-left">STATUS </div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center px-1">
          <div className="text-muted text-small cursor-pointer ">NARATION</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      {transactionsData && transactionsData.length ? (
        transactionsData.map((item) => (
          <Card key={item.id} className="mb-2">
            <Card.Body className="pt-md-0 pb-md-0 sh-auto sh-md-8">
              <Row className="g-0 h-100 align-content-center cursor-default">
                <Col xs="12" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3 px-1">
                  <div className="text-muted text-small d-md-none">Date</div>
                  <div className="text-alternate text-medium">
                    <span>{moment(item.dateCreated).format('l')}</span>
                  </div>
                </Col>
                <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3 px-1">
                  <div className="text-muted text-small d-md-none">Name</div>
                  <div className="text-alternate text-medium">
                    <span>{item.member.name}</span>
                  </div>
                </Col>
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Amount </div>
                  <div className="text-alternate text-medium"> {formatter.format(item.amountPayable)}</div>
                </Col>
                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Discount</div>
                  <div className="text-alternate text-medium">{formatter.format(item.discount)}</div>
                </Col>

                <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Subtotal</div>
                  <div className="text-alternate text-medium"> {formatter.format(item.subTotal)}</div>
                </Col>
                <Col xs="6" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Status</div>
                  <div className="text-alternate text-medium text-capitalize">{item.status.toLowerCase()}</div>
                </Col>
                <Col xs="12" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4 px-1">
                  <div className="text-muted text-small d-md-none">Narration</div>
                  <div className="text-alternate text-small d-none d-md-inline">{item.narration}</div>
                  <div className="text-alternate text-medium d-md-none">{item.narration}</div>
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
