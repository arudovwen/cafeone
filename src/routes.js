/* eslint-disable */
import { lazy } from 'react';
import { USER_ROLE } from 'constants.js';
import { DEFAULT_PATHS } from 'config.js';

const dashboard = lazy(() => import('views/dashboard/Dashboard'));
const usermanagement = {
  members: lazy(() => import('views/users/UserManagement')),
  admins: lazy(() => import('views/admins/Admins')),
};
const branches = lazy(() => import('views/branches/Branches'));
const bookings = lazy(() => import('views/bookings/Bookings'));
const transactions = lazy(() => import('views/transactions/Transactions'));
const loyalty = lazy(() => import('views/loyalty/Loyalty'));
const logout = lazy(() => import('views/membership/logout'));
const membership = {
  types: lazy(() => import('views/membership/MembershipType')),
  list: lazy(() => import('views/membership/Membership')),
};

// const products = {
//   list: lazy(() => import('views/products/list/ProductsList')),
//   detail: lazy(() => import('views/products/detail/ProductsDetail')),
// };
const orders = {
  list: lazy(() => import('views/orders/list/OrdersList')),
  detail: lazy(() => import('views/orders/detail/OrdersDetail')),
};

const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
      protected: true,
    },
    {
      path: `${appRoot}/dashboard`,
      component: dashboard,
      label: 'Dashboard',
      icon: 'shop',
      protected: true,
    },

    {
      path: `${appRoot}/users`,
      exact: true,
      redirect: true,
      to: `${appRoot}/users/list`,
      label: 'User Management',
      icon: 'user',
      protected: true,
      subs: [
        {
          path: '/members',
          label: 'Members',
          component: usermanagement.members,
          roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER', 'SHOP_MANAGER', 'SALES_REPRESENTATIVE'],
        },
        {
          path: '/admins',
          label: 'Admins',
          component: usermanagement.admins,
          roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER'],
        },
      ],
    },

    {
      path: `${appRoot}/branches`,
      component: branches,
      label: 'Branches',
      icon: 'list',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER', 'SHOP_MANAGER'],
    },
    {
      path: `${appRoot}/membership`,
      component: membership,
      label: 'Membership',
      icon: 'tag',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER'],
      subs: [
        // { path: '/list', label: 'List', component: membership.list },
        { path: '/types', label: 'Types', component: membership.types },
      ],
    },

    {
      path: `${appRoot}/bookings`,
      component: bookings,
      label: 'Bookings',
      icon: 'menu-bookmark',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER', 'SHOP_MANAGER', 'SALES_REPRESENTATIVE'],
    },
    {
      path: `${appRoot}/loyalty`,
      component: loyalty,
      label: 'Campaigns',
      icon: 'gift',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER'],
    },

    {
      path: `${appRoot}/transactions`,
      component: transactions,
      label: 'Transactions',
      icon: 'invoice',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANT', 'OPERATION_MANAGER', 'SHOP_MANAGER', 'SALES_REPRESENTATIVE'],
    },
    {
      path: `${appRoot}/logout`,
      component: logout,
      label: 'Logout',
      icon: 'logout',
      protected: true,
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
