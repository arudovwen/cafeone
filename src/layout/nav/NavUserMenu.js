import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { MENU_PLACEMENT } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import { logout } from 'auth/authSlice';

const NavUserMenuContent = ({ dispatch }) => (
  <div>
    <Row className="mb-1 ms-0 me-0">
      <Col xs="12" className="p-1 mb-3 pt-3">
        <div className="separator-light" />
      </Col>
      <Col xs="6" className="ps-1 pe-1">
        <ul className="list-unstyled">
          <li>
            <a href="#/!">
              <CsLineIcons icon="gear" className="me-2" size="17" /> <span className="align-middle">Settings</span>
            </a>
          </li>
        </ul>
      </Col>
      <Col xs="6" className="pe-1 ps-1">
        <ul className="list-unstyled">
          <li onClick={() => dispatch(logout())}>
            <a href="#/!">
              <CsLineIcons icon="logout" className="me-2" size="17" /> <span className="align-middle">Logout</span>
            </a>
          </li>
        </ul>
      </Col>
    </Row>
  </div>
);

const user = JSON.parse(localStorage.getItem('authAdmin'));

const NavUserMenuDropdownToggle = React.memo(
  React.forwardRef(({ onClick, expanded = false }, ref) => {
    if (!user) {
      return <></>;
    }
    return (
      <a
        href="#/!"
        ref={ref}
        className="d-flex user position-relative"
        data-toggle="dropdown"
        aria-expanded={expanded}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick(e);
        }}
      >
        {/* <img className="profile" alt={user.name} src={user.thumb} /> */}
        {/* <img src="/img/logo/cafeone-white.png" className="profile" alt="logo" /> */}
        {user ? <div className="name cursor-pointer">{user.role.replaceAll('_', ' ')}</div> : ''}
      </a>
    );
  })
);

// Dropdown needs access to the DOM of the Menu to measure it
const NavUserMenuDropdownMenu = React.memo(
  React.forwardRef(({ style, className }, ref) => {
    const dispatch = useDispatch();
    return (
      <div ref={ref} style={style} className={classNames('dropdown-menu dropdown-menu-end user-menu wide', className)}>
        <NavUserMenuContent dispatch={dispatch} />
      </div>
    );
  })
);

NavUserMenuDropdownMenu.displayName = 'NavUserMenuDropdownMenu';

const MENU_NAME = 'NavUserMenu';

const NavUserMenu = () => {
  const dispatch = useDispatch();
  const {
    placementStatus: { view: placement },
    behaviourStatus: { behaviourHtmlData },
    attrMobile,
    attrMenuAnimate,
  } = useSelector((state) => state.menu);

  const { isLogin, currentUser } = useSelector((state) => state.auth);
  const { color } = useSelector((state) => state.settings);
  const { showingNavMenu } = useSelector((state) => state.layout);

  const onToggle = (status, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
  };

  useEffect(() => {
    dispatch(layoutShowingNavMenu(''));
    // eslint-disable-next-line
  }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

  if (!isLogin) {
    return <></>;
  }
  return (
    <Dropdown as="div" bsPrefix="user-container d-flex" onToggle={onToggle} show={showingNavMenu === MENU_NAME} drop="down">
      <Dropdown.Toggle as={NavUserMenuDropdownToggle} user={currentUser} />
      <Dropdown.Menu
        as={NavUserMenuDropdownMenu}
        className="dropdown-menu dropdown-menu-end user-menu wide"
        popperConfig={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: () => {
                  if (placement === MENU_PLACEMENT.Horizontal) {
                    return [0, 7];
                  }
                  if (window.innerWidth < 768) {
                    return [-84, 7];
                  }

                  return [-78, 7];
                },
              },
            },
          ],
        }}
      />
    </Dropdown>
  );
};
export default React.memo(NavUserMenu);
