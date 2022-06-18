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
  React.useEffect(() => {
    axios.get(`${SERVICE_URL}/reports`, requestConfig).then((res) => {
      if (res.status === 200) {
        setData(res.data);
        setSeatUsage(res.data.seatUsage)
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

      <Row>
        {/* Recent Orders Start */}
        <Col xl="6" className="mb-5">
          <h2 className="small-title">Recent Transactions</h2>
          {transactions.length ? (
            transactions.map((item) => (
              <Card className="mb-2 sh-15 sh-md-6" key={item.id}>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center justify-content-between">
                    <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                      <span className="body-link stretched-link">{item.name}</span>
                    </Col>

                    <Col xs="12" md="3" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                      <Badge>
                        <span className="">₦</span>
                        {item.amountPaid}
                      </Badge>
                    </Col>
                    <Col xs="12" md="4" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
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

        {/* Performance Start */}
        <Col xl="6" className="mb-5">
          <h2 className="small-title">Membership Stats</h2>
          <Card className="sh-45 h-xl-100-card">
            <Card.Body className="h-100">
              <div className="h-100">{data && data.membershiptStats ? <PerformanceChart statData={data.membershiptStats} /> : ''}</div>
            </Card.Body>
          </Card>
        </Col>
        {/* Performance End */}
      </Row>

      <Row className="gx-4 gy-5">
        {/* Top Selling f Items Start */}
        <Col>
          <h2 className="small-title">Top Booked Spaces</h2>
           <div className="mb-2">

            {seatUsage.length ? (
               seatUsage.map((item) => (
                <Card className="mb-2 overflow-hidden" key={item.id}>
                  <Row className="g-0 sh-14 sh-md-10 overflow-hidden">
                    <Col className="col-auto h-100">
                      <img src={`${process.env.REACT_APP_URL}/${item.photo}`} alt="alternate text" className="" style={{ width: '5rem', height: '100%' }} />
                    </Col>
                    <Col>
                      <Card.Body className="pt-0 pb-0 h-100">
                        <Row className="g-0 h-100 align-content-center">
                          <Col md="6" className="d-flex align-items-center mb-2 mb-md-0">
                            {item.branch}
                          </Col>
                          <Col md="3" className="d-flex align-items-center text-muted text-medium">
                            {item.name}
                          </Col>
                          <Col md="3" className="d-flex align-items-center justify-content-md-end text-muted text-medium">
                            {item.bookings} bookings
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <div className="text-center p-3">No information available </div>
            )}
          </div>
        </Col>
        {/* Top Selling Items End */}
      </Row>
    </>
  );
};

export default Dashboard;
