
/*eslint-disable*/
import { useLayoutEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  NavbarToggler,
} from "reactstrap";
import { AppVersion } from "components/Footers/Footer";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const [role, setRole] = useState(null);
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // let userDetails = JSON.parse(
  //   sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  // )

  console.log(props.routes);

  useLayoutEffect(() => {
    const user = sessionStorage.getItem(process.env.REACT_APP_OIDC_USER);
    const userOBJ = JSON.parse(user);
    // console.log(userOBJ.profile)
    // setRole((prev) => userOBJ.profile.role)
  }, []);
  // creates the links that appear in the left menu / Sidebar

  const layout = "/admin";

  const MenuItem = ({
    name = "Menu",
    items = [],
    children,
    path = "",
    sub = "",
    open = false,
    iconPath = ""
  }) => {
    const [isOpen, setIsOpen] = useState(open);
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();

    useLayoutEffect(() => {
      let temp = location.pathname;
      if (temp == "/admin" + path) {
        setIsActive(true)
        setIsOpen(true)
      } else {
        setIsActive(false)
        // setIsOpen(false)

      }

      return () => { };
    }, [location]);

    const toggle = () => setIsOpen(!isOpen);

    console.log({ items });

    if (children === undefined) {
      return (
        <>
          <div className="py-2 ">
            <Link to={layout + sub + path}>
              <span
                className={isActive ? "isActive " + iconPath : "isPending " + iconPath}
                onClick={toggle}
                style={{ marginBottom: "0.5rem" }}
              >
                <span className="pl-1" style={{ display: "inline-block" }}>

                  {name}
                </span>
              </span>
            </Link>
          </div>
        </>
      );
    }
    return (
      <div className="py-2 ">
        <span
          // color="primary"
          onClick={toggle}
          style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", width: "95%", cursor: "pointer" }}
        >
          <span>{name}</span>
          {isOpen ? <FaChevronDown /> : <FaChevronUp />}
        </span>
        <Collapse isOpen={isOpen}>
          {items?.map((prop, key) => (
            <NavItem key={key}>
              <NavLink
                to={layout + sub + items[key]?.navicationPath}
                tag={NavLinkRRD}
                onClick={closeCollapse}
              //activeStyle={{ color: "red" }}
              // activeClassName="active"
              >
                <i className={items[key]?.icon} />
                {prop.name}
              </NavLink>
            </NavItem>
          ))}
          <div
            className="d-flex"
            style={{ flexDirection: "column", paddingLeft: "10px", background: "#eff0f3", width: "95%" }}
          >
            {children}
          </div>
        </Collapse>
      </div>
    );
  };

  const MenuLayout = ({ routes = [] }) => {
    console.log({ routes });
    const transactionsIdx = routes.findIndex(
      (item) => item.name == "Transactions"
    );
    const setupIdx = routes.findIndex((item) => item.name == "Setup");
    const DashboardIdx = routes.findIndex((item) => item.name == "Dashboard");
    const ReportsIdx = routes.findIndex((item) => item.name == "Reports");
    let cancelIdx = -1;

    if (transactionsIdx != -1) {
      if (routes[transactionsIdx].menus[0] != undefined) cancelIdx = 0;
    }

    console.log({
      setupIdx,
      DashboardIdx,
      ReportsIdx,
      cancelIdx,
      transactionsIdx,
    });

    const handleComponentFetchAndFilter = (routes, allroutes) => {
      const menus = routes.map((resl) => resl?.navicationPath);

      // .charAt(0).toUpperCase()

      console.log({ po: menus });

      const usemenus = allroutes.filter((route) => menus.includes(route.path));

      console.log({ usemenus });

      return usemenus;
    };

    console.log(
      "test",
      routes[transactionsIdx]?.menus[cancelIdx],
      routes[transactionsIdx]
    );

    return (
      <div style={{ paddingLeft: "30px" }} className="pdl-3 mt-4">
        {DashboardIdx !== -1 && (
          <MenuItem
            path={routes[DashboardIdx]?.navicationPath}
            iconPath={routes[DashboardIdx]?.iconPath}
            items={[]}
            name="Dashboard"
          />
        )}
        {transactionsIdx !== -1 && (
          <MenuItem items={[]} open={true} name="Transactions">
            <MenuItem
              path={routes[transactionsIdx].menus[4]?.navicationPath}
              iconPath={routes[transactionsIdx].menus[4]?.iconPath}
              name="Sales"
            />
            <MenuItem
              path={routes[transactionsIdx].menus[1]?.navicationPath}
              iconPath={routes[transactionsIdx].menus[1]?.iconPath}
              name="Purchase"
            />
            <MenuItem
              path={routes[transactionsIdx].menus[2]?.navicationPath}
              iconPath={routes[transactionsIdx].menus[2]?.iconPath}
              name="Refund"
            />
            <MenuItem
              path={routes[transactionsIdx].menus[3]?.navicationPath}
              iconPath={routes[transactionsIdx].menus[3]?.iconPath}
              name="Purchase Return"
            />
            <MenuItem
              path={routes[transactionsIdx].menus[0]?.navicationPath}
              iconPath={routes[transactionsIdx].menus[3]?.iconPath}
              name="Credit & Debit Note"
            />


            {/* {cancelIdx != -1 && (
              <MenuItem items={[]} name="Cancelation">
                <MenuItem
                  items={[routes[transactionsIdx][3]?.menus]}
                  name="Purchase Return"
                  path={
                    routes[transactionsIdx]?.menus[cancelIdx]?.menus[0]
                      ?.navicationPath
                  }
                  iconPath={
                    routes[transactionsIdx]?.menus[cancelIdx]?.menus[0]
                      ?.iconPath
                  }
                />
                <MenuItem
                  path={
                    routes[transactionsIdx].menus[cancelIdx]?.menus[1]
                      ?.navicationPath
                  }
                  iconPath={
                    routes[transactionsIdx].menus[cancelIdx]?.menus[1]
                      ?.iconPath
                  }
                  items={[]}
                  name="Refund"
                />
              </MenuItem>
            )} */}
          </MenuItem>
        )}

        {setupIdx !== -1 && (
          <MenuItem open={true} items={[]} name="Setups">
            <MenuItem
              items={[]}
              name="Item"
              path={routes[setupIdx]?.menus[1]?.navicationPath}
              iconPath={routes[setupIdx]?.menus[1]?.iconPath}
            />
            <MenuItem
              items={[]}
              name="Business Partner"
              path={routes[setupIdx]?.menus[2]?.navicationPath}
              iconPath={routes[setupIdx]?.menus[2]?.iconPath}
            />
            <MenuItem
              items={[]}
              name="Exchange Rate"
              path={routes[setupIdx]?.menus[0]?.navicationPath}
              iconPath={routes[setupIdx]?.menus[0]?.iconPath}
            />
          </MenuItem>
        )}
        {ReportsIdx !== -1 && (
          <MenuItem
            items={[routes[ReportsIdx]]}
            name="Reports"
            path={routes[ReportsIdx]?.navicationPath}
            iconPath={routes[ReportsIdx]?.iconPath}
          />
        )}
      </div>
    );
  };
  const createLinks = (routes) => {
    //console.log({ toti: routes });
    // transactions: [],
    // setups: [],
    // report: [],
    //   dashboard: [],

    return routes.map((prop, key) => {
      if (prop.menus?.length) {
        return prop.menus.map((prop, key) => (
          <NavItem key={key}>
            <NavLink
              to={layout + prop.navicationPath}
              tag={NavLinkRRD}
              onClick={closeCollapse}
              activeClassName="active"
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        ));
      } else {
        return (
          <NavItem key={key}>
            <NavLink
              to={layout + prop.navicationPath}
              tag={NavLinkRRD}
              onClick={closeCollapse}
              activeClassName="active"
            >
              <i className={prop.icon} />
              {prop.name + "Hello"}
            </NavLink>
          </NavItem>
        );
      }
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid style={{ position: "relative" }}>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-3" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {/* User */}

        <Nav
          className="align-items-center d-md-none"
          // style={{ marginTop: -100 }}
          style={{ background: "red" }}
        >
          {/* <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
          <UncontrolledDropdown nav>
            {/* <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={
                      require("../../assets/img/theme/team-1-800x800.jpg")
                        .default
                    }
                  />
                </span>
              </Media>
            </DropdownToggle> */}
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}

          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar style={{ marginTop: -30 }} className="sideBar">
            {/* {createLinks(routes)} */}
            <MenuLayout routes={routes} />
          </Nav>

          {/* Divider */}
          <hr className="my-0" />
        </Collapse>
        <AppVersion />
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
