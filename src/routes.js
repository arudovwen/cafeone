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
// const customers = {
//   list: lazy(() => import('views/customers/list/CustomersList')),
//   detail: lazy(() => import('views/customers/detail/CustomersDetail')),
// };

// const storefront = {
//   home: lazy(() => import('views/storefront/home/Home')),
//   filters: lazy(() => import('views/storefront/filters/Filters')),
//   categories: lazy(() => import('views/storefront/categories/Categories')),
//   detail: lazy(() => import('views/storefront/detail/Detail')),
//   cart: lazy(() => import('views/storefront/cart/Cart')),
//   checkout: lazy(() => import('views/storefront/checkout/Checkout')),
//   invoice: lazy(() => import('views/storefront/invoice/Invoice')),
// };
// const shipping = lazy(() => import('views/shipping/Shipping'));
// const discount = lazy(() => import('views/discount/Discount'));

// const settings = {
//   home: lazy(() => import('views/settings/home/Home')),
//   general: lazy(() => import('views/settings/general/General')),
// };

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
          roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANCE', 'OPERATION_MANAGER', 'SHOP_MANAGER', 'OPERATION_REPRESENTATIVE'],
        },
        { path: '/admins', label: 'Admins', component: usermanagement.admins },
        // { path: '/detail', label: 'menu.detail', component: usermanagement.detail },
      ],
    },

    {
      path: `${appRoot}/branches`,
      component: branches,
      label: 'Branches',
      icon: 'list',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANCE', 'OPERATION_MANAGER', 'SHOP_MANAGER'],
    },
    {
      path: `${appRoot}/membership`,
      component: membership,
      label: 'Membership',
      icon: 'tag',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANCE', 'OPERATION_MANAGER', 'SHOP_MANAGER'],
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
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANCE', 'OPERATION_MANAGER', 'SHOP_MANAGER', 'OPERATION_REPRESENTATIVE'],
    },
    {
      path: `${appRoot}/loyalty`,
      component: loyalty,
      label: 'Campaigns',
      icon: 'gift',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANCE', 'OPERATION_MANAGER', 'SHOP_MANAGER'],
    },

    {
      path: `${appRoot}/transactions`,
      component: transactions,
      label: 'Transactions',
      icon: 'invoice',
      protected: true,
      roles: ['SUPER_ADMIN', 'OPERATION_ASSISTANCE', 'OPERATION_MANAGER', 'SHOP_MANAGER'],
    },
    {
      path: `${appRoot}/logout`,
      component: logout,
      label: 'Logout',
      icon: 'logout',
      protected: true,
    },

    // {
    //   path: `${appRoot}/products`,
    //   exact: true,
    //   redirect: true,
    //   to: `${appRoot}/products/list`,
    //   label: 'menu.products',
    //   icon: 'cupcake',
    //   subs: [
    //     { path: '/list', label: 'menu.list', component: products.list },
    //     { path: '/detail', label: 'menu.detail', component: products.detail },
    //   ],
    // },
    //  {
    //   path: `${appRoot}/orders`,
    //   exact: true,
    //   redirect: true,
    //   to: `${appRoot}/orders/list`,
    //   label: 'menu.orders',
    //   icon: 'cart',
    //   subs: [
    //     { path: '/list', label: 'menu.list', component: orders.list },
    //     { path: '/detail', label: 'menu.detail', component: orders.detail },
    //   ],
    // },
    // {
    //   path: `${appRoot}/customers`,
    //   exact: true,
    //   redirect: true,
    //   to: `${appRoot}/customers/list`,
    //   label: 'menu.customers',
    //   icon: 'user',
    //   subs: [
    //     { path: '/list', label: 'menu.list', component: customers.list },
    //     { path: '/detail', label: 'menu.detail', component: customers.detail },
    //   ],
    // },
    // {
    //   path: `${appRoot}/storefront`,
    //   exact: true,
    //   redirect: true,
    //   to: `${appRoot}/storefront/home`,
    //   label: 'menu.storefront',
    //   icon: 'screen',
    //   subs: [
    //     { path: '/home', label: 'menu.home', component: storefront.home },
    //     { path: '/filters', label: 'menu.filters', component: storefront.filters },
    //     { path: '/categories', label: 'menu.categories', component: storefront.categories },
    //     { path: '/detail', label: 'menu.detail', component: storefront.detail },
    //     { path: '/cart', label: 'menu.cart', component: storefront.cart },
    //     { path: '/checkout', label: 'menu.checkout', component: storefront.checkout },
    //     { path: '/invoice', label: 'menu.invoice', component: storefront.invoice },
    //   ],
    // },
    // {
    //   path: `${appRoot}/shipping`,
    //   component: shipping,
    //   label: 'menu.shipping',
    //   icon: 'shipping',
    // },
    // {
    //   path: `${appRoot}/discount`,
    //   component: discount,
    //   label: 'menu.discount',
    //   icon: 'tag',
    // },
    // {
    //   path: `${appRoot}/settings`,
    //   component: settings.home,
    //   label: 'menu.settings',
    //   icon: 'gear',
    //   subs: [{ path: '/general', component: settings.general, hideInMenu: true }],
    // },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
