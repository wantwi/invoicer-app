import React from "react";
import style from "./sidebar.module.css";
import NavItem from "./navItem/NavItem.jsx";
import { sideMenu } from "./menu.config.js";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import { AppVersion } from "components/Footers/Footer";
import graLogo from "assets/img/theme/gra.png";

const Sidebar = (props) => {
  console.log({ jska: props.routes });
  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white "
      expand="md"
      id="sidenav-main"
    >
      <button className="navbar-toggler" type="button" onClick={null}>
        <span className="navbar-toggler-icon" />
      </button>
      <div id="sidebar-wrapper">
        <NavbarBrand className="pt-3">
          <img alt={"logo"} className="navbar-brand-img" src={graLogo} />
        </NavbarBrand>
        {/* User */}
        {props.routes.map((item, index) => {
          return <NavItem key={`${item?.name}-${index}`} item={item} />;
        })}

        <hr className="my-0" />
      </div>

      <AppVersion />
    </Navbar>
  );
};

export default Sidebar;
