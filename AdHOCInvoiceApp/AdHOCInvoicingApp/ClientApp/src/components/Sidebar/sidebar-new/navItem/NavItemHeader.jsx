import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import style from "./navItem.module.css";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { VscDebugBreakpointConditionalUnverified } from "react-icons/vsc";

const resolveLinkPath = (childTo, parentTo) => `${parentTo}/${childTo}`;

const NavItemHeader = (props) => {
  const { item } = props;
  const { name, Icon, path: headerToPath, menus } = item;
  const location = useLocation();

  const [expanded, setExpand] = useState(
    location.pathname.includes(headerToPath)
  );

  const onExpandChange = (e) => {
    e.preventDefault();
    setExpand((expanded) => !expanded);
  };

  return (
    <>
      <button
        className={`${style.navItem} ${style.navItemHeaderButton}`}
        onClick={onExpandChange}
      >
        <VscDebugBreakpointConditionalUnverified className={style.navIcon} />
        <span className={style.navLabel}>{name}</span>
      </button>

      {expanded && (
        <div className={style.navChildrenBlock}>
          {menus.map((item, index) => {
            const key = `${item.name}-${index}`;

            const { name, Icon, menus } = item;

            if (menus) {
              return (
                <div key={key}>
                  <NavItemHeader
                    item={{
                      ...item,
                      to: resolveLinkPath(item.path, props.item.path),
                    }}
                  />
                  <ChevronDownIcon
                    className={`${style.navItemHeaderChevron} ${
                      expanded && style.chevronExpanded
                    }`}
                  />
                </div>
              );
            }

            return (
              <NavLink
                key={key}
                to={resolveLinkPath(item.path, props.item.path)}
                className={style.navItem}
                activeClassName={style.activeNavItem}
              >
                {/* <VscDebugBreakpointConditionalUnverified className={style.navIcon} /> */}
                <span className={style.navLabel}>{name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export default NavItemHeader;
