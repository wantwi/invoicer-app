import React from "react";
import { createContext, useState } from "react";
const AuthContext = createContext({});
const APP_SESSION = JSON.parse(
  sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
);


export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(APP_SESSION || {});
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
