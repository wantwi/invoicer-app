import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import style from "./navItem.module.css";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { VscDebugBreakpointConditionalUnverified } from "react-icons/vsc";

const resolveLinkPath = (childTo, parentTo) => `${parentTo}/${childTo}`;

const NavItemHeader = (props) => {
  const { item } = props;
  const { name:label, Icon, navicationPath: headerToPath, menus } = item;
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
        {/* <VscDebugBreakpointConditionalUnverified className={style.navIcon} /> */}
        <span className={style.navLabel}>{label}</span>
        {expanded ? <FaChevronDown /> : <FaChevronUp />}
      </button>

      {expanded && (
        <div className={style.navChildrenBlock}>
          {menus.map((item, index) => {
            const key = `${item.label}-${index}`;

            const { label, Icon, menus } = item;

            if (menus) {
              return (
                <div key={key}>
                  <NavItemHeader
                    item={{
                      ...item,
                      to: resolveLinkPath(
                        // item.navicationPath,
                        // props.item.navicationPath
                      ),
                    }}
                  />
                </div>
              );
            }

            return (
              <NavLink
                key={key}
                to={resolveLinkPath(
                  item.navicationPath,
                  props.item.navicationPath
                )}
                className={style.navItem}
                activeClassName={style.activeNavItem}
              >
                {/* <VscDebugBreakpointConditionalUnverified
                  className={style.navIcon}
                /> */}
                <span className={style.navLabel}>{label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </>
  );
};

export default NavItemHeader;
