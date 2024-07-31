import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Login from "views/examples/Login";
import AdminLayout from "./layouts/Admin";
import SelectBranchComponent from "./layouts/SelectBranchComponent";
import AuthLayout from "./layouts/Auth.js";
import "./assets/js/zendesk-static";
import { ToastContainer } from "react-toastify";
import { IdleTimerProviderWrapper } from "context/IdleTimerContext";
import useAuth from "hooks/useAuth";
import { useLayoutEffect } from "react";
import BranchCompo from "components/BranchesDropdown";

const AdminLayoutWrapper = (props) => {
  return (
    <>
      <IdleTimerProviderWrapper />
      <AdminLayout {...props} />
    </>
  );
};

const App = () => {
  return (
    <>
      <Switch>
        <Route path="/auth/login" render={(props) => <Login {...props} />} />
        <Route
          path="/auth/logout"
          render={(props) => <BranchCompo loggingOut={true} />}
        />
        <Route path="/" render={(props) => <AdminLayoutWrapper {...props} />} />
        <Route
          path="/customers"
          render={(props) => <AdminLayout {...props} />}
        />
        <Route path="/items" render={(props) => <AdminLayout {...props} />} />
        <Route path="/device" render={(props) => <AdminLayout {...props} />} />
        <Route path="/refunds" render={(props) => <AdminLayout {...props} />} />
        <Route path="/reports" render={(props) => <AdminLayout {...props} />} />
        <Route
          path="/user-accounts"
          render={(props) => <AdminLayout {...props} />}
        />
        <Route
          path="/currency"
          render={(props) => <AdminLayout {...props} />}
        />
        <Route
          path="/dashboard"
          render={(props) => <AdminLayout {...props} />}
        />
        <Route path="/profile" render={(props) => <AdminLayout {...props} />} />
        <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
        <Redirect from="/" to="/auth/login" />
      </Switch>

      <ToastContainer />
    </>
  );
};

export default App;

 console.log = console.warn = console.error = () => {};
