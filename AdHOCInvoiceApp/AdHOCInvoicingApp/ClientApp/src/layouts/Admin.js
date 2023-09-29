import React, { useState, useRef } from "react";

import { useLocation, Route, Switch, Redirect } from "react-router-dom";

// reactstrap components

import { Container } from "reactstrap";

// core components

import AdminNavbar from "components/Navbars/AdminNavbar.js";

import AdminFooter from "components/Footers/AdminFooter.js";

import Sidebar from "components/Sidebar/Sidebar.js";

import routesData from "routes.js";

import graLogo from "../assets/img/theme/gra.png";
import graLogo2 from "../assets/img/brand/logo.png";

import SelectBranchComponent from "components/BranchesDropdown";

import { renewToken } from "services/AuthService";

import { ErrorBoundary } from "react-error-boundary";

import Fallback from "components/Fallback";

import Loader from "components/Modals/Loader";

import useAuth from "hooks/useAuth";

import { login } from "services/AuthService";

import IdleTimerComponet from "context/IdleTimerComponet";

import { Suspense } from "react";

import { useLayoutEffect } from "react";

import { toast } from "react-toastify";
import useCustomAxios from "hooks/useCustomAxios";

const Admin = (props) => {
  const mainContent = React.useRef(null);

  const [role, setRole] = useState(null);

  let [routes, setRoutes] = useState([]);

  const [routesStructure, setRoutesStructure] = useState({
    transactions: [],
    setups: [],
    report: [],
    dashboard:[],
  })

  const {
    auth,
    getBranches,
    branches,
    isLoadingBraches,
    selectedBranch,
    isErrorLoadingBranches,
    setSelectedBranch,
  } = useAuth();

  const [adminLinks, setadminLinks] = useState([]);

  const axios = useCustomAxios();
  let branchRef = useRef();

  React.useLayoutEffect(() => {
    getBranches();
  });

  useLayoutEffect(() => {
    const menus = async () => {
      try {
        const result = await axios.get("/api/GetMenus");

        const menus = result?.data?.map((resl) => resl?.navicationPath);

        // .charAt(0).toUpperCase()

        console.log({ po: result });

        const usemenus = routes.filter((route) => menus.includes(route.path));
        

        console.log({ usemenus });

        setRoutes(result?.data);

        setadminLinks(result?.data?.map((resl) => resl?.navicationPath));
      } catch (error) {
        console.log({ error });

        toast.error("Could not fetch menus. Logging out..");

        setRoutes([]);
        window.location.href = `${process.env.REACT_APP_BASENAME}/login`;
      }
    };

    menus();

    return () => {};
  }, [role]);

  React.useLayoutEffect(() => {
    const user = sessionStorage.getItem(process.env.REACT_APP_OIDC_USER);

    const userOBJ = JSON.parse(user);

    // console.log(userOBJ.profile)

    setRole((prev) => userOBJ?.profile?.role);
  }, []);

  const getRoutes = () => {
      return routesData.map((prop, key) => {
        
          console.log({prop})
        return (
          <Route
            path={"/admin" + prop.path}
            component={prop.component}
            key={key}
          />
        );
    //   if (prop.layout === "/admin") {
    //   } else {
    //     return "";
    //   }
    });
  };

  console.log({hey:selectedBranch});

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

  if (isLoadingBraches) {
    return (
      <div id="loading-screen">
        <div className="loading-branches">
          <img src={graLogo2} />
          <h1>Loading branch info</h1>
        </div>
      </div>
    );
  }

  if (isErrorLoadingBranches) {
    return (
      <div id="loading-screen">
        <h1>Error Loading Branches branches</h1>
      </div>
    );
  }

  if (!branches?.length) {
    return (
      <>No branch info available</>
    )
  }

  if ( !selectedBranch?.code ) {

      return (
          <SelectBranchComponent />
      )
  }

  return (
    <>
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
      </Suspense>
    </>
  );
};

export default Admin;
