import {lazy} from"react"

import Index from "views/Index.js";
// import Customers from "views/Customers";
// import Items from "views/Items";
// import Refunds from "views/Refunds";
// import Reports from "views/Reports";
// import Purchases from "views/Purchases";
// import Accounts from "views/Accounts";
// import Currency from "views/Currency";
// import Dashboard from "views/Dashboard";
import Profile from "views/examples/Profile";

const Customers = lazy(()=>import("views/Customers.js"))
const Items = lazy(()=>import("views/Items.js"))
const Refunds = lazy(()=>import("views/Refunds.js"))
const Purchases = lazy(()=>import("views/Purchases.js"))
const Accounts = lazy(()=>import("views/Accounts.js"))
const Currency = lazy(()=>import("views/Currency.js"))
const Dashboard = lazy(()=>import("views/Dashboard.js"))
const Reports = lazy(()=>import("views/Reports.js"))

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-single-copy-04 text-primary",
    component: Dashboard,
    layout: "/admin",
  },

  {
    path: "/index",
    name: "Sales Invoices",
    icon: "ni ni-single-copy-04 text-primary",
    component: Index,
    layout: "/admin",
  },
  {
    path: "/purchases",
    name: "Purchase Invoices",
    icon: "ni ni-archive-2 text-primary",
    component: Purchases,
    layout: "/admin",
  },
  {
    path: "/refunds",
    name: "Refunds",
    icon: "ni ni-money-coins text-primary",
    component: Refunds,
    layout: "/admin",
  },
  {
    path: "/customers",
    name: "Business Partner Setup",
    icon: "ni ni-circle-08 text-primary",
    component: Customers,
    layout: "/admin",
  },
  {
    path: "/items",
    name: "Item Setup",
    icon: "ni ni-bag-17 text-primary",
    component: Items,
    layout: "/admin",
  },
  {
    path: "/currency",
    name: "Exchange Rate Setup",
    icon: "ni ni-money-coins text-primary",
    component: Currency,
    layout: "/admin",
  },

  {
    path: "/reports",
    name: "Reports",
    icon: "ni ni-books text-primary",
    component: Reports,
    layout: "/admin",
  },
  {
    path: "/user-accounts",
    name: "User Account Management",
    icon: "ni ni-circle-08 text-primary",
    component: Accounts,
    layout: "/admin",
  },
  // {
  //   name: 'Business Profile Settings',
  //   path: '/profile',
  //   icon: 'ni ni-settings text-primary',
  //   component: Profile,
  //   layout: '/admin',
  // },
];
export default routes;
