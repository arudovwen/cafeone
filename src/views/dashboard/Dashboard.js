/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Row, Col, Dropdown, Card, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
// import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import PerformanceChart from './components/PerformanceChart';
import { getRecentDashboardTransactions } from '../../transactions/transactionSlice';

const Dashboard = () => {
  const title = 'Dashboard';
  const description = 'Ecommerce Dashboard Page';
  const [data, setData] = React.useState({});
  const [seatUsage, setSeatUsage] = React.useState([]);
  const transactions = useSelector((state) => state.transactions.items);
  const dispatch = useDispatch();
  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  });
  React.useEffect(() => {
    axios.get(`${SERVICE_URL}/reports`, requestConfig).then((res) => {
      if (res.status === 200) {
        setData(res.data);
        setSeatUsage(res.data.seatUsage);
      }
    });
    dispatch(getRecentDashboardTransactions());
  }, []);

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-container">
        <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
          <span className="align-middle text-small ms-1">&nbsp;</span>
        </NavLink>
        <h1 className="mb-0 pb-0 display-4" id="title">
          Welcome!
        </h1>
      </div>
      {/* Title End */}

      {/* Stats Start */}
      <div className="d-flex">
        <Dropdown>
          <Dropdown.Toggle className="small-title p-0 align-top h-auto me-2" variant="link">
            Today's
          </Dropdown.Toggle>
          {/* <Dropdown.Menu>
            <Dropdown.Item>Weekly</Dropdown.Item>
            <Dropdown.Item>Monthly</Dropdown.Item>
            <Dropdown.Item>Yearly</Dropdown.Item>
          </Dropdown.Menu> */}
        </Dropdown>
        <h2 className="small-title">Stats</h2>
      </div>
      <Row className="mb-5 g-2">
        <Col xs="6" md="4" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                <CsLineIcons icon="dollar" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">BOOKINGS</div>
              <div className="text-primary cta-4">{data && data.summary && data.summary.booking}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="6" md="4" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                <CsLineIcons icon="database" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">BRANCHES</div>
              <div className="text-primary cta-4">{data && data.summary && data.summary.branches}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="6" md="4" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                <CsLineIcons icon="server" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">CAMPAIGNS</div>
              <div className="text-primary cta-4">{data && data.summary && data.summary.campaigns}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="6" md="4" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column align-items-center">
              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                <CsLineIcons icon="user" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">MEMBERS</div>
              <div className="text-primary cta-4">{data && data.summary && data.summary.members}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Stats End */}

      <Row className="mb-5">
        {/* Recent Orders Start */}
        <Col xl="6" className="mb-5 mb-xl-0">
          <h2 className="small-title">Recent Transactions</h2>
          {transactions.length ? (
            transactions.map((item) => (
              <Card className="mb-2 sh-15 sh-md-6" key={item.paymnetId}>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center justify-content-between">
                    <Col xs="12" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100 px-1">
                      <span className="">{item.member ? item.member.name : '-'}</span>
                    </Col>

                    <Col xs="12" md="4" className="d-flex align-items-center mb-1 mb-md-0 text-alternate px-1">
                      <Badge>{formatter.format(item.subTotal)}</Badge>
                    </Col>
                    <Col xs="12" md="4" className="d-flex align-items-center mb-1 mb-md-0 text-alternate text-small px-1">
                      {item.narration}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          ) : (
            <div className="text-center p-3">No recent transaction </div>
          )}
        </Col>
        {/* Recent Orders End */}
        {/* Top Selling f Items Start */}
        <Col xl="6" className="d-flex flex-column">
          <h2 className="small-title">Top Booked Spaces</h2>
          <div className="mb-2 rounded-md flex-grow-1">
            {seatUsage.length ? (
              seatUsage.map((item) => (
                <Card className="mb-2 sh-15 sh-md-6" key={item.id}>
                  <Card.Body className="pt-0 pb-0 h-100">
                    <Row className="g-0 h-100 align-content-center">
                      <Col md="6" className="d-flex align-items-center mb-2 mb-md-0">
                        {item.name}
                      </Col>

                      <Col md="6" className="d-flex align-items-center justify-content-md-end text-muted text-medium">
                        {item.bookings} bookings
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="text-center p-3">No information available </div>
            )}
          </div>
        </Col>
        {/* Top Selling Items End */}
      </Row>

      <Row className="gx-4 gy-5">
        {/* Performance Start */}
        <Col className="mb-5">
          <h2 className="small-title">Membership Stats</h2>
          <Card className="sh-45">
            <Card.Body className="h-100">
              <div className="h-100">{data && data.membershipStats ? <PerformanceChart statData={data.membershipStats} /> : ''}</div>
            </Card.Body>
          </Card>
        </Col>
        {/* Performance End */}
      </Row>
    </>
  );
};

export default Dashboard;
