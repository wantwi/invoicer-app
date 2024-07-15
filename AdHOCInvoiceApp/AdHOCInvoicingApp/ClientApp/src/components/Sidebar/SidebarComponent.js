/*!



=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import { useLayoutEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { Sidebar, Menu, MenuItem, SubMenu, } from 'react-pro-sidebar';

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
import { useLocation } from "react-router-dom";
import "./sidebar.module.css"

import { FaHandshakeSimple } from "react-icons/fa6";
import { MdOutlineNoteAlt } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa6";
import { FaCog } from "react-icons/fa";
import { FaDesktop } from "react-icons/fa6";
import { FaCartPlus } from "react-icons/fa";
import { FaPeopleCarryBox } from "react-icons/fa6";
import { MdNoteAlt } from "react-icons/md";
import { MdCurrencyExchange } from "react-icons/md";
import { GiBoxUnpacking } from "react-icons/gi";
import { FaHandHolding } from "react-icons/fa6";
import { RiFileChartFill } from "react-icons/ri";

const getIcon = (name) => {
  switch (name) {
    case "Transactions": return <FaHandshakeSimple size={22} />
    case "Debit-Credit Note": return <MdNoteAlt size={20} />
    case "Purchase": return <GiBoxUnpacking size={20} />
    case "Exchange Rate Setup": return <MdCurrencyExchange size={20} />
    case "Refund": return <FaHandHolding size={20} />
    case "Purchase Return": return <FaPeopleCarryBox size={20} />
    case "Reports": return <RiFileChartFill size={20} />
    case "Item": return <FaCartPlus size={20} />
    case "Dashboard": return <FaDesktop size={22} />
    case "Sales": return <FaCartArrowDown size={20} />
    case "Business Partner": return <FaUserTie size={20} />
    case "Setup": return <FaCog size={22} />
    default: return <FaCartArrowDown size={20} />

  }
}

const SidebarComponent = (props) => {
  const location = useLocation();

  const isActive = (navicationPath) => navicationPath === location.pathname;

  const [openMenuId, setOpenMenuId] = useState(null);

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


  const { bgColor, routes, logo, userMenus = [] } = props;
  console.log({ routes });
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

  const myMenuItemStyles = (active) => ({
    ".menu-anchor": {
      backgroundColor: active ? "blue" : "green",
      color: active ? "cyan" : "yellow",
    },
    ".menu-anchor:hover": {
      backgroundColor: "red",
      color: "#eee",
    },
  });

  const handleSubMenuClick = (id) => {
    setOpenMenuId((prevOpenMenuId) => (prevOpenMenuId === id ? null : id));
  };



  // const renderMenuItem = (menuItem) => {
  //   const isActive = menuItem.navicationPath === location.pathname;
  //   console.log({ isActive, pathname: location.pathname, navicationPath: menuItem.navicationPath });

  //   return (
  //     <MenuItem key={menuItem.id} component={<Link to={menuItem.navicationPath} />} active={isActive} className={isActive ? "active" : ''} >
  //       {menuItem.name}
  //     </MenuItem>)
  // };

  // const renderSubMenu = (submenu) => (
  //   <SubMenu key={submenu.id} label={submenu.name}>
  //     {submenu.menus.map(menuItem => (
  //       menuItem.menus.length > 0 ? renderSubMenu(menuItem) : renderMenuItem(menuItem)
  //     ))}
  //   </SubMenu>
  // );

  // const renderUserMenus = (menus) => menus.map(menu => (
  //   menu.menus.length > 0 ? renderSubMenu(menu) : renderMenuItem(menu)
  // ));

  // const renderUserMenus = () => {
  //   return userMenus.map(menu => {
  //     if (menu.length > 0) {
  //       <SubMenu label={menu?.name}>
  //         {
  //           x?.menus?.map(x => <MenuItem> {x?.name} </MenuItem>)
  //         }

  //       </SubMenu>
  //     } else {
  //       <MenuItem component={<Link to="/dashboard" />}>{menu?.name}</MenuItem>
  //     }

  //   });

  // }
  //function sortByOrderKey(arr) {
  //  console.log({ sortByOrderKey: arr, sortted: arr.sort((a, b) => +a.orderKey - +b.orderKey) });
  //  return arr.sort((a, b) => a.orderKey - b.orderKey);
  //  }

  const sortByOrderKey = (menus=[]) => {
    return menus?.map(menu => {
      if (menu.menus && menu.menus.length > 0) {
        menu.menus = sortByOrderKey(menu.menus);
      }
      return menu;
    }).sort((a, b) => a.orderKey.localeCompare(b.orderKey));
  };

  const renderMenuItem = (menuItem) => {
    const active = isActive(menuItem.navicationPath);
    return (
      <MenuItem key={menuItem.id} component={<Link to={menuItem.navicationPath} />} active={active}
        className={active ? "active" : ''}
        icon={getIcon(menuItem.name)}
      >
        {menuItem.name}
      </MenuItem>
    );
  };

  const renderSubMenu = (submenu) => {
    const hasActiveChild = submenu.menus.some(menuItem => isActive(menuItem.navicationPath) || (menuItem.menus && menuItem.menus.some(childItem => isActive(childItem.navicationPath))));
    const isOpen = openMenuId === submenu.id || hasActiveChild;

    return (
      <SubMenu
        key={submenu.id}
        label={submenu.name}
        defaultOpen={hasActiveChild}
        open={isOpen}
        onOpenChange={() => handleSubMenuClick(submenu.id)}
        icon={getIcon(submenu.name)}
      >
        {submenu.menus.map(menuItem => (
          menuItem.menus.length > 0 ? renderSubMenu(menuItem) : renderMenuItem(menuItem)
        ))}
      </SubMenu>
    );
  };

  const renderUserMenus = (menus) => menus.map(menu => (
    menu.menus.length > 0 ? renderSubMenu(menu) : renderMenuItem(menu)
  ));

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

          <UncontrolledDropdown nav>

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
          {/* <Form className="mt-4 mb-3 d-md-none">
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
          </Form> */}
          {/* Navigation */}
          <Nav navbar className="sideBar">
            <Sidebar>
              <Menu
                style={{ background: "#f1f1fi", borderRight: '2px solid #e1e2e3', height: '80vh' }}
                menuItemStyles={{
                  button: ({ level, active, disabled, open, isSubmenu }) => ({
                    marginLeft: -10,
                    fontSize: 14,
                    color: active ? '#ffffff' : undefined,
                    backgroundColor: active ? '#5e72e4' : undefined,
                    borderLeft: active ? "5px solid #14539A" : undefined,
                    '&:hover': {
                      backgroundColor: active ? '#14539A' : undefined, // Red background on hover when active
                    },
                  }),
                  label: ({ level, active, disabled, open, isSubmenu }) => ({
                    color: active ? '#ffffff' : undefined,
                  }),
                  icon: ({ level, active, disabled, open, isSubmenu }) => ({
                    color: active ? '#ffffff' : undefined,
                  }),
                  menuItem: ({ level, active, disabled, open, isSubmenu }) => ({
                    color: active ? '#ffffff' : undefined,
                  }),
                }}
              >
                {renderUserMenus(sortByOrderKey(userMenus))}
              </Menu>
            </Sidebar>

            {/* <MenuLayout routes={routes} /> */}
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

export default SidebarComponent;
