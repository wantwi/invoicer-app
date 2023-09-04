import React from "react";
import { NavLink } from "react-router-dom";
import style from "./navItem.module.css";
import NavItemHeader from "./NavItemHeader.jsx";

console.log({ style });
const NavItem = (props) => {
  console.log({ pl: props.item });
  const { label, Icon, path, children, navicationPath, menus } = props.item;

  if (menus?.length) {
    return <NavItemHeader item={props.item} />;
  }

  return (
    <NavLink
      exact
      to={"/admin" + navicationPath}
      className={style.navItem}
      activeClassName={style.activeNavItem}
    >
      <span className={style.navLabel}>{label}</span>
    </NavLink>
  );
};

export default NavItem;
