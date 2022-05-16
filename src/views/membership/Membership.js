import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Button, Dropdown, Form, Card, Badge, Pagination, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import CheckAll from 'components/check-all/CheckAll';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import Select from 'react-select';

const MembershipList = () => {
  const title = 'Membership List';
  const description = 'Membership List Page';

  const allItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [selectedItems, setSelectedItems] = useState([]);
  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  const toggleCheckAll = (allSelect) => {
    if (allSelect) {
      setSelectedItems(allItems);
    } else {
      setSelectedItems([]);
    }
  };
  const [membershipModal, setMembershipModal] = useState(false);

   const options = [
     { value: 'type', label: 'Type' },

   ];
  const toggleModal = () => {
    setMembershipModal(!membershipModal);
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

          {/* Top Buttons Start */}
          <Col xs="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1 d-inline-block d-lg-none">
              <CsLineIcons icon="sort" />
            </Button>
            <div className="btn-group ms-1 check-all-container">
              <CheckAll
                allItems={allItems}
                selectedItems={selectedItems}
                onToggle={toggleCheckAll}
                inputClassName="form-check"
                className="btn btn-outline-primary btn-custom-control py-0"
              />
              <Dropdown align="end">
                <Dropdown.Toggle className="dropdown-toggle dropdown-toggle-split" variant="outline-primary" />
                <Dropdown.Menu>
                  <Dropdown.Item>Move</Dropdown.Item>
                  <Dropdown.Item>Archive</Dropdown.Item>
                  <Dropdown.Item>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
          {/* Top Buttons End */}
        </Row>
      </div>

      <Row className="mb-3 justify-content-between">
        <Col md="5" lg="4" xxl="4" className="mb-1 d-flex align-items-center">
          {/* Search Start */}
          <div className="d-inline-block float-md-start me-4 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="text" placeholder="Search" />
            <span className="search-magnifier-icon">
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>

          <Button variant="outline-primary" className="btn-icon btn-icon-start w-100 w-md-auto mb-1" onClick={() => toggleModal()}>
            <CsLineIcons icon="plus" /> <span>Add membership</span>
          </Button>
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
                10 Items
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
        <Col md="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
          <div className="text-muted text-small cursor-pointer sort">ID</div>
        </Col>
        <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">TYPE</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">AMOUNT</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">VALIDITY</div>
        </Col>
        <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">STATUS</div>
        </Col>
      </Row>
      {/* List Header End */}

      {/* List Items Start */}
      <Card className={`mb-2 ${selectedItems.includes(1) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(1)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1239
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  321.75
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-primary">Active</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(1)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(2) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(2)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1251
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  59.00
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-primary">Active</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(2)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(3) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(3)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1397
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  128.25
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-secondary">Pending</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(3)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(4) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(4)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1421
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  252.75
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-secondary">Pending</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(4)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(5) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(5)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1438
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  189.50
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-secondary">Pending</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(5)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(6) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(6)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1573
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  63.10
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-secondary">Pending</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(6)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(7) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(7)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1633
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  45.10
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-secondary">Pending</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(7)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(8) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(8)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1633
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  45.10
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-secondary">Pending</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(8)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(9) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(9)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                1633
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  79.75
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-tertiary">SHIPPED</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(9)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className={`mb-2 ${selectedItems.includes(10) && 'selected'}`}>
        <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
          <Row className="g-0 h-100 align-content-center cursor-default" onClick={() => checkItem(10)}>
            <Col xs="11" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
              <div className="text-muted text-small d-md-none">Id</div>
              <NavLink to="/membership/detail" className="text-truncate h-100 d-flex align-items-center">
                2743
              </NavLink>
            </Col>
            <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
              <div className="text-muted text-small d-md-none">Name</div>
              Membership 1
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3">
              <div className="text-muted text-small d-md-none">Purchase</div>
              <div className="text-alternate">
                <span>
                  <span className="text-small">$</span>
                  124.75
                </span>
              </div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-4">
              <div className="text-muted text-small d-md-none">Date</div>
              <div className="text-alternate">1 month</div>
            </Col>
            <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
              <div className="text-muted text-small d-md-none">Status</div>
              <div>
                <Badge bg="outline-tertiary">SHIPPED</Badge>
              </div>
            </Col>
            <Col xs="1" md="1" className="d-flex flex-column justify-content-center align-items-md-end mb-2 mb-md-0 order-2 text-end order-md-last">
              <Form.Check className="form-check mt-2 ps-5 ps-md-2" type="checkbox" checked={selectedItems.includes(10)} onChange={() => {}} />
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* List Items End */}

      {/* Pagination Start */}
      <div className="d-flex justify-content-center mt-5">
        <Pagination>
          <Pagination.Prev className="shadow" disabled>
            <CsLineIcons icon="chevron-left" />
          </Pagination.Prev>
          <Pagination.Item className="shadow" active>
            1
          </Pagination.Item>
          <Pagination.Item className="shadow">2</Pagination.Item>
          <Pagination.Item className="shadow">3</Pagination.Item>
          <Pagination.Next className="shadow">
            <CsLineIcons icon="chevron-right" />
          </Pagination.Next>
        </Pagination>
      </div>
      {/* Pagination End */}
      {/* Membership Detail Modal Start */}
      <Modal className="modal-right scroll-out-negative" show={membershipModal} onHide={() => setMembershipModal(false)} scrollable dialogClassName="full">
        <Modal.Header closeButton>
          <Modal.Title as="h5">Add new membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <OverlayScrollbarsComponent options={{ overflowBehavior: { x: 'hidden', y: 'scroll' } }} className="scroll-track-visible">
            <Form>
              <div className="mb-3">
                <Form.Label>Membership type</Form.Label>
                <Select classNamePrefix="react-select" options={options} value="" placeholder="" />
              </div>
              <div className="mb-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" defaultValue="" />
              </div>

              <div className="mb-3">
                <Form.Label>Validity</Form.Label>
                <Select classNamePrefix="react-select" options={options} value="" placeholder="" />
              </div>
              <div className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" defaultValue=""/>
              </div>
            </Form>
          </OverlayScrollbarsComponent>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="primary" className="btn-icon btn-icon-start w-100">
            <span>Submit</span>
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Membership Detail Modal End */}
    </>
  );
};

export default MembershipList;
