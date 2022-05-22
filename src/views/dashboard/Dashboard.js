import React from 'react';
import { Row, Col, Dropdown, Card, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
// import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { SERVICE_URL, requestConfig } from 'config.js';
import axios from 'axios';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import PerformanceChart from './components/PerformanceChart';

const Dashboard = () => {
  const title = 'Dashboard';
  const description = 'Ecommerce Dashboard Page';
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${SERVICE_URL}/reports`, requestConfig).then((res) => {
      if (res.status === 200) {
        setData(res.data);
      }
    });
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
          Welcome, Admin!
        </h1>
      </div>
      {/* Title End */}

      {/* Stats Start */}
      <div className="d-flex">
        <Dropdown>
          <Dropdown.Toggle className="small-title p-0 align-top h-auto me-2" variant="link">
            Today's
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Weekly</Dropdown.Item>
            <Dropdown.Item>Monthly</Dropdown.Item>
            <Dropdown.Item>Yearly</Dropdown.Item>
          </Dropdown.Menu>
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
              <div className="text-primary cta-4">{data.summary && data.summary.booking}</div>
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
              <div className="text-primary cta-4">{data.summary && data.summary.branches}</div>
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
              <div className="text-primary cta-4">{data.summary && data.summary.campaigns}</div>
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
              <div className="text-primary cta-4">{data.summary && data.summary.members}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Stats End */}

      <Row>
        {/* Recent Orders Start */}
        <Col xl="6" className="mb-5">
          <h2 className="small-title">Recent Transactions</h2>
          <Card className="mb-2 sh-15 sh-md-6">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                  <NavLink to="/orders/detail" className="body-link stretched-link">
                    Order #54129
                  </NavLink>
                </Col>
                <Col xs="2" md="3" className="d-flex align-items-center text-muted mb-1 mb-md-0 justify-content-end justify-content-md-start">
                  <Badge bg="outline-primary" className="me-1">
                    PENDING
                  </Badge>
                </Col>
                <Col xs="12" md="2" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                  <span>
                    <span className="text-small">$</span>
                    17.35
                  </span>
                </Col>
                <Col xs="12" md="3" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
                  Today - 13:20
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 sh-15 sh-md-6">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                  <NavLink to="/orders/detail" className="body-link stretched-link">
                    Order #54128
                  </NavLink>
                </Col>
                <Col xs="2" md="3" className="d-flex align-items-center text-muted mb-1 mb-md-0 justify-content-end justify-content-md-start">
                  <Badge bg="outline-secondary" className="me-1">
                    SHIPPED
                  </Badge>
                </Col>
                <Col xs="12" md="2" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                  <span>
                    <span className="text-small">$</span>
                    145.20
                  </span>
                </Col>
                <Col xs="12" md="3" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
                  Today - 11:32
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 sh-15 sh-md-6">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                  <NavLink to="/orders/detail" className="body-link stretched-link">
                    Order #54127
                  </NavLink>
                </Col>
                <Col xs="2" md="3" className="d-flex align-items-center text-muted mb-1 mb-md-0 justify-content-end justify-content-md-start">
                  <Badge bg="outline-secondary" className="me-1">
                    SHIPPED
                  </Badge>
                </Col>
                <Col xs="12" md="2" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                  <span>
                    <span className="text-small">$</span>
                    110.85
                  </span>
                </Col>
                <Col xs="12" md="3" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
                  Today - 11:20
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 sh-15 sh-md-6">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                  <NavLink to="/orders/detail" className="body-link stretched-link">
                    Order #54126
                  </NavLink>
                </Col>
                <Col xs="2" md="3" className="d-flex align-items-center text-muted mb-1 mb-md-0 justify-content-end justify-content-md-start">
                  <Badge bg="outline-primary" className="me-1">
                    PENDING
                  </Badge>
                </Col>
                <Col xs="12" md="2" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                  <span>
                    <span className="text-small">$</span>
                    58.00
                  </span>
                </Col>
                <Col xs="12" md="3" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
                  Today - 10:20
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 sh-15 sh-md-6">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                  <NavLink to="/orders/detail" className="body-link stretched-link">
                    Order #54125
                  </NavLink>
                </Col>
                <Col xs="2" md="3" className="d-flex align-items-center text-muted mb-1 mb-md-0 justify-content-end justify-content-md-start">
                  <Badge bg="outline-primary" className="me-1">
                    PENDING
                  </Badge>
                </Col>
                <Col xs="12" md="2" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                  <span>
                    <span className="text-small">$</span>
                    22.05
                  </span>
                </Col>
                <Col xs="12" md="3" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
                  Today - 07:30
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mb-2 sh-15 sh-md-6">
            <Card.Body className="pt-0 pb-0 h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="10" md="4" className="d-flex align-items-center mb-3 mb-md-0 h-md-100">
                  <NavLink to="/orders/detail" className="body-link stretched-link">
                    Order #54124
                  </NavLink>
                </Col>
                <Col xs="2" md="3" className="d-flex align-items-center text-muted mb-1 mb-md-0 justify-content-end justify-content-md-start">
                  <Badge bg="outline-quaternary" className="me-1">
                    DELIVERED
                  </Badge>
                </Col>
                <Col xs="12" md="2" className="d-flex align-items-center mb-1 mb-md-0 text-alternate">
                  <span>
                    <span className="text-small">$</span>
                    14.25
                  </span>
                </Col>
                <Col xs="12" md="3" className="d-flex align-items-center justify-content-md-end mb-1 mb-md-0 text-alternate">
                  Monday - 17:30
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {/* Recent Orders End */}

        {/* Performance Start */}
        <Col xl="6" className="mb-5">
          <h2 className="small-title">Membership Stats</h2>
          <Card className="sh-45 h-xl-100-card">
            <Card.Body className="h-100">
              <div className="h-100">
                <PerformanceChart />
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* Performance End */}
      </Row>

      <Row className="gx-4 gy-5">
        {/* Top Selling Items Start */}
        <Col>
          <h2 className="small-title">Top Booked Spaces</h2>
          <div className="mb-2">
            {data.seatUsage &&
              data.seatUsage.map((item) => (
                <Card className="mb-2" key={item.id}>
                  <Row className="g-0 sh-14 sh-md-10">
                    <Col className="col-auto">
                      <NavLink to="#">
                        <img src={`${process.env.REACT_APP_URL}/${item.photo}`} alt="alternate text" className="card-img card-img-horizontal sw-11" />
                      </NavLink>
                    </Col>
                    <Col>
                      <Card.Body className="pt-0 pb-0 h-100">
                        <Row className="g-0 h-100 align-content-center">
                          <Col md="6" className="d-flex align-items-center mb-2 mb-md-0">
                            <NavLink to="/products/detail">{item.name}</NavLink>
                          </Col>
                          <Col md="3" className="d-flex align-items-center text-muted text-medium">
                            {item.branch}
                          </Col>
                          <Col md="3" className="d-flex align-items-center justify-content-md-end text-muted text-medium">
                            {item.bookings} bookings
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))}
          </div>
        </Col>
        {/* Top Selling Items End */}
      </Row>
    </>
  );
};

export default Dashboard;
