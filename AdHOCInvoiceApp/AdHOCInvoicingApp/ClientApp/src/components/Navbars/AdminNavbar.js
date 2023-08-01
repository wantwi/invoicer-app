import { Link } from "react-router-dom";
import { logout } from "services/AuthService";
import React from "react";
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
import useAuth from "hooks/useAuth";

const AdminNavbar = (props) => {
  const [profile, setProfile] = React.useState("");
  const { auth } = useAuth();
  React.useEffect(() => {
    //check if its logged in
    const user = sessionStorage.getItem(process.env.REACT_APP_OIDC_USER);
    const userOBJ = JSON.parse(user);
    //console.log('OIDC User:', userOBJ)

    if (!userOBJ) {
      logout();
      setTimeout("location.reload(true);", 1500);
    } else {
      //console.log('UserData', userOBJ)
      setProfile((profile) => userOBJ.profile.name);
    }
  }, []);
  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <h1 className="h1 mb-0 text-white text-uppercase d-none d-lg-inline-block">
            {auth.profile?.companyname}
          </h1>

          {/* <Form className='navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto'>
            <FormGroup className='mb-0'>
              <InputGroup className='input-group-alternative'>
                <InputGroupAddon addonType='prepend'>
                  <InputGroupText>
                    <i className='fas fa-search' />
                  </InputGroupText>
                </InputGroupAddon>
                <Input placeholder='Search Invoice' type='text' />
              </InputGroup>
            </FormGroup>
          </Form> */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
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
                      {profile}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem
                  href={
                    process.env.REACT_APP_AUTHORITY + "/identity/account/manage"
                  }
                  tag={"a"}
                >
                  <i className="ni ni-single-02" />
                  <span>Profile Settings</span>
                </DropdownItem>
                {/* <DropdownItem to='/admin/user-profile' tag={Link}>
                  <i className='ni ni-settings-gear-65' />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to='/admin/user-profile' tag={Link}>
                  <i className='ni ni-calendar-grid-58' />
                  <span>Activity</span>
                </DropdownItem> */}
                {/* <DropdownItem to='/admin/user-profile' tag={Link}>
                  <i className='ni ni-support-16' />
                  <span>Support</span>
                </DropdownItem> */}
                <DropdownItem divider />
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
