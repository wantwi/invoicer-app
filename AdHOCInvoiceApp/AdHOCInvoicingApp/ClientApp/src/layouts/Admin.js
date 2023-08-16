import React, { useState } from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routesData from "routes.js";
import graLogo from "../assets/img/theme/gra.png";
import IdleTimeOutHandler from "components/IdleTimeOutHandler";
import { renewToken } from "services/AuthService";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "components/Fallback";
import Loader from "components/Modals/Loader";

import { IdleTimerProviderWrapper } from "context/IdleTimerContext";
import useAuth from "hooks/useAuth";
import { login } from "services/AuthService";
import IdleTimerComponet from "context/IdleTimerComponet";
import { Suspense } from "react";

const adminLinks = ["/dashboard", "/reports", "/user-accounts", "/currency"];

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const [role, setRole] = useState(null);
  let [routes, setRoutes] = useState(routesData || []);
  const { getUser } = useAuth();

  React.useLayoutEffect(() => {
    //const user = sessionStorage.getItem(process.env.REACT_APP_OIDC_USER);
    //const userOBJ = JSON.parse(user);
    //// console.log(userOBJ.profile)
    //setRole((prev) => userOBJ?.profile?.role);
    //const data = await getUser()
    //console.log({data})
  }, []);

  React.useLayoutEffect(() => {
    if (role == "0") {
      setRoutes(routes.filter((route) => !adminLinks.includes(route.path)));
    }
  }, [role]);

  const getRoutes = () => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return "";
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const errorHandler = (error, errorInfo) => {
    console.log("Logging", error, errorInfo);
  };

  return (
    <>
      {/* <IdleTimerProviderWrapper /> */}
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: graLogo,
          imgAlt: "...",
        }}
      />
      <Suspense fallback={<Loader />}>
        <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
          <div className="main-content" ref={mainContent}>
            <AdminNavbar
              {...props}
              brandText={getBrandText(props.location.pathname)}
            />
            <Switch>
              {getRoutes()}
              <Redirect from="*" to="/admin/index" />
            </Switch>
            <Container fluid>
              {/* {count} */}

              <AdminFooter />
            </Container>
          </div>
        </ErrorBoundary>
        <IdleTimerComponet></IdleTimerComponet>
      </Suspense>
    </>
  );
};

export default Admin;
