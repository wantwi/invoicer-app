import React from "react";
import style from "./sidebar.module.css";
import NavItem from "./navItem/NavItem.jsx";
import { sideMenu } from "./menu.config.js";
import { Navbar } from "reactstrap";

const Sidebar = (props) => {
  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      {props.routes.map((item, index) => {
        return <NavItem key={`${item.name}-${index}`} item={item} />;
      })}
    </Navbar>
  );
};

export default Sidebar;
