import { VscDebugBreakpointConditionalUnverified } from "react-icons/vsc";

export const sideMenu = [
  {
    label: "Home",
    Icon: VscDebugBreakpointConditionalUnverified,
    to: "/",
  },
  {
    label: "Profile",
    Icon: VscDebugBreakpointConditionalUnverified,
    to: "/profile",
  },
  {
    label: "Settings",
    Icon: VscDebugBreakpointConditionalUnverified,
    to: "/settings",
    children: [
      {
        label: "Account",
        Icon: VscDebugBreakpointConditionalUnverified,
        to: "account",
      },
      {
        label: "Security",
        Icon: VscDebugBreakpointConditionalUnverified,
        to: "security",
        children: [
          {
            label: "Credentials",
            Icon: VscDebugBreakpointConditionalUnverified,
            to: "credentials",
          },
          {
            label: "2-FA",
            Icon: VscDebugBreakpointConditionalUnverified,
            to: "2fa",
          },
        ],
      },
    ],
  },
];
