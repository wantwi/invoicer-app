import React from "react";
import { NavLink } from "react-router-dom";
import style from "./navItem.module.css";
import NavItemHeader from "./NavItemHeader.jsx";
import { VscDebugBreakpointConditionalUnverified } from "react-icons/vsc";

console.log({ style });
const NavItem = (props) => {
  const { name, Icon, navicationPath: path, menus = [] } = props.item;

  console.log("I rendered");

  console.log("kkad", props.item);

  if (menus?.length) {
    return <NavItemHeader item={props.item} />;
  }

  return (
    <NavLink
      exact
      to={path}
      className={style.navItem}
      activeClassName={style.activeNavItem}
    >
      {/* <VscDebugBreakpointConditionalUnverified className={style.navIcon} /> */}
      <span className={style.navLabel}>{name}</span>
    </NavLink>
  );
};

export default NavItem;
