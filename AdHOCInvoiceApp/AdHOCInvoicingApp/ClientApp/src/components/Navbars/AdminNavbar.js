import { Link } from "react-router-dom";
//import { logout } from "../../hooks/useAuth"
import { useAuth } from "context/AuthContext";
import React, { useLayoutEffect, useState } from "react";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import { toast } from "react-toastify";
import useCustomAxios from "hooks/useCustomAxios"
import { BsFillGridFill } from "react-icons/bs";

const AdminNavbar = (props) => {
  const { getUser, user, logout, setSelectedBranch, selectedBranch } = useAuth();
  const axios = useCustomAxios()
  const [authurls, setAuthurls] = useState(null)
  useLayoutEffect(() => {

    const checkIsALoggedIn = async () => {
      try {
        const res = await getUser()
        if (!res) {
          throw new Error()
        }
      } catch (e) {
        toast.error("Login to access this page")
        login()
      }
    }
    checkIsALoggedIn()
    return () => { };
  }, []);

  const [userApps, setUserApps] = useState([]);
  const apps = async () => {

    try {

      const res = await axios.get(`/api/GetApps`);

      setUserApps(res?.data.filter(itm => itm?.id !== "00000000-0000-0000-0000-400000000000"));

      // .charAt(0).toUpperCase()

    } catch (error) {

      //toast.error("Could not fetch menus. Please try again");

    }

  };



  const getlinks = async () => {
    try {
      const geturllinks = await axios.get('/api/UserInfo')
      console.log({ geturllinks })
      setAuthurls(geturllinks?.data)
    } catch (error) {

    }

  }


  useLayoutEffect(() => {
    apps();
    getlinks()

    return () => { };

  }, []);

  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <h1 className="h1 mb-0 text-white text-uppercase d-none d-lg-inline-block">
            {user?.companyName ? user?.companyName + " " + selectedBranch?.name : selectedBranch?.name}
          </h1>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">

                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      <BsFillGridFill size="2em" />
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                {userApps?.map(app => {
                  return (
                    <>
                      <DropdownItem className="noti-title" header tag="div">
                        <a href={app?.appPath} target="_blank" className="text-overflow m-0" style={{ color: "#8898aa !important" }}>{app?.name}</a>
                      </DropdownItem>
                    </>
                  )
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      alt="..."
                      src={require("../../assets/img/theme/user.png").default}
                    />
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {user?.given_name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setSelectedBranch(null)
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Change Branch</span>
                </DropdownItem>
                <DropdownItem
                  href={
                    authurls?.authURL + "/identity/account/manage"
                  }
                  tag={"a"}
                  target="_blank"
                >
                  <i className="ni ni-single-02" />
                  <span>Profile Settings</span>
                </DropdownItem>

                <DropdownItem
                  onClick={() => {
                    logout();
                    setTimeout("location.reload(true);", 1500);
                  }}
                >
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
