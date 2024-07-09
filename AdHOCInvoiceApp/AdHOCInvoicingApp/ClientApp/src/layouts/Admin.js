import React, { useState, useRef, useEffect } from "react";

import { useLocation, Route, Switch, Redirect } from "react-router-dom";

// reactstrap components

import { Button, Container, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

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

import { Suspense } from "react";
import useCustomAxios from "hooks/useCustomAxios";
import { useGet } from "hooks/useGet";

import SidebarComponent from "components/Sidebar/SidebarComponent";
import ProtectedRoute from "./ProtectedRoute";
import * as FaIcons from "react-icons/fa"
import BranchPrompt from "components/Modals/BranchPrompt";

const branchInfo = JSON.parse(sessionStorage.getItem("BRANCH_INFO"))

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const [branch, setBranch] = useState("");
  const [isOpen, setisOpen] = useState(false)

  const [role, setRole] = useState(null);

  let [routes, setRoutes] = useState([]);

  const [routesStructure, setRoutesStructure] = useState({
    transactions: [],
    setups: [],
    report: [],
    dashboard: [],
  })

  const { selectedBranch, setSelectedBranch, setCompanySettings } = useAuth();

  // const {
  //   auth,
  //   getBranches,
  //   branches,
  //   isLoadingBraches,
  //   selectedBranch,
  //   isErrorLoadingBranches,
  //   setSelectedBranch,
  // } = useAuth();

  const [adminLinks, setadminLinks] = useState([]);

  const axios = useCustomAxios();
  let branchRef = useRef();

  // React.useLayoutEffect(() => {
  //   getBranches();
  // });

  // useLayoutEffect(() => {
  //   const menus = async () => {
  //     try {
  //       const result = await axios.get("/api/GetMenus");

  //       const menus = result?.data?.map((resl) => resl?.navicationPath);

  //       // .charAt(0).toUpperCase()

  //       console.log({ po: result });

  //       const usemenus = routes.filter((route) => menus.includes(route.path));


  //       console.log({ usemenus });

  //       setRoutes(result?.data);

  //       setadminLinks(result?.data?.map((resl) => resl?.navicationPath));
  //     } catch (error) {
  //       console.log({ error });

  //       // toast.error("Could not fetch menus. Logging out..");

  //       setRoutes([]);
  //       window.location.href = `${process.env.REACT_APP_BASENAME}/auth/login`;
  //     }
  //   };

  //   menus();

  //   return () => { };
  // }, [role]);

  // React.useLayoutEffect(() => {
  //   const user = sessionStorage.getItem(process.env.REACT_APP_OIDC_USER);

  //   const userOBJ = JSON.parse(user);

  //   // console.log(userOBJ.profile)

  //   setRole((prev) => userOBJ?.profile?.role);
  // }, []);

  const getRoutes = () => {
    return routesData.map((prop, key) => {

      console.log({ prop })
      return (
        <Route
          path={prop.path}
          component={prop.component}
          key={key}
        />
      );

    });
  };



  const { data: userMenus, isLoading } = useGet("/api/GetMenus", ['user-menus'], (data) => {
    if (!selectedBranch?.code) {
      setisOpen(true)
    } else {
      setisOpen(false)
    }

  })

  const { data } = useGet("/api/GetBranches", ['user-branch'])

  // const { data: settingsData } = useGet("/api/GetCompanyDetailsByCompanyId", ['company-settings'], (data) => {
  //   console.log({ compaySett: data });

  //   // /setCompanySettings

  // })

  const getCompanySetting = async () => {
    try {
      const result = await axios.get("/api/GetCompanyDetailsByCompanyId")

      setCompanySettings(result?.data?.itemSettings)

    } catch (error) {

    }

  }

  // const getBrandText = (path) => {
  //   for (let i = 0; i < routes.length; i++) {
  //     if (
  //       props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
  //       -1
  //     ) {
  //       return routes[i].name;
  //     }
  //   }

  //   return "Brand";
  // };

  const errorHandler = (error, errorInfo) => {
    console.log("Logging", error, errorInfo);
  };

  // if (isLoadingBraches) {
  //   return (
  //     <div id="loading-screen">
  //       <div className="loading-branches">
  //         <img src={graLogo2} />
  //         <h1>Loading branch info</h1>
  //       </div>
  //     </div>
  //   );
  // }

  // if (isErrorLoadingBranches) {
  //   return (
  //     <div id="loading-screen">
  //       <h1>Error Loading Branches branches</h1>
  //     </div>
  //   );
  // }

  // if (!branches?.length) {
  //   return (
  //     <>No branch info available</>
  //   )
  // }

  // if (!selectedBranch?.code) {

  //   return (
  //     <SelectBranchComponent />
  //   )
  // }

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

  // const errorHandler = (error, errorInfo) => {
  //   console.log("Logging", error, errorInfo);
  // };

  useEffect(() => {
    getCompanySetting()

    return () => {

    }
  }, [])


  useEffect(() => {

    if (branchInfo?.code) {
      setisOpen(false)
    }


    return () => {

    }
  }, [selectedBranch])

  const handleBranchChange = (event) => {
    if (event.target.value) {
      const item = data?.find(x => x?.code === event.target.value)
      setBranch(item?.code)
    }

  }

  const onBranchSelected = () => {
    const item = data?.find(x => x?.code === branch)
    sessionStorage.setItem("BRANCH_INFO", JSON.stringify(item))
    setSelectedBranch(item)
    setisOpen(false)
  }

  return (
    <ProtectedRoute>

      {
        isLoading ? <Loader /> : null
      }
      {/* <Modal isOpen={isOpen} className="modal-dialog-centered modal-lg">
        <ModalHeader style={{ background: "#14539A", height: 50, padding: "5px 20px" }}> <span><FaIcons.FaNetworkWired size={30} color="#fff" /></span> <span className="ml-2" style={{ fontSize: "1.2rem", color: "#fff" }}>Choose your branch</span></ModalHeader>
        <ModalBody>
          <select className="form-control form-control-sm form-select" value={branch} onChange={handleBranchChange}>
            <option value={''}>Select branch</option>

            {
              data?.map(x => <option key={x?.code} value={x?.code}>{x?.name}</option>)
            }

          </select>
          <input type="checkbox" className="font-size-small mt-2" /><span> Remember</span>
        </ModalBody>
        <ModalFooter style={{ marginTop: -30 }}>
          <Button disabled={branch.length === 0 ? true : false} onClick={onBranchSelected} color="primary" size="sm" style={{ width: "100%" }}>Ok</Button>
        </ModalFooter>
      </Modal> */}

      <BranchPrompt showPrompt={isOpen} loading={isLoading} setshowPrompt={setisOpen} data={data} branch={branch} handleBranchChange={handleBranchChange} message="Please select your branch." eventHandler={onBranchSelected} />


      <SidebarComponent {...props}
        routes={routes}
        userMenus={userMenus}
        logo={{
          innerLink: "/index",
          imgSrc: graLogo,
          imgAlt: "...",

        }} />

      <Suspense fallback={<Loader />}>
        <ErrorBoundary FallbackComponent={Fallback} onError={errorHandler}>
          <div className="main-content" ref={mainContent}>
            <AdminNavbar
              {...props}
              brandText={getBrandText(props.location.pathname)}
              setisOpen={setisOpen}
            />

            <Switch>
              {getRoutes()}
              {/* <Route
                path={"/stockloading"}
                component={<Stockloading />}
                key={key}
              /> */}

              <Redirect from="*" to="/index" />
            </Switch>

            <Container fluid>
              {/* {count} */}

              <AdminFooter />
            </Container>
          </div>
        </ErrorBoundary>
      </Suspense>
    </ProtectedRoute>
  );
};

export default Admin;
