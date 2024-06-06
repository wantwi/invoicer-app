import React, { useState, useContext } from "react";
import useCustomAxios from "../hooks/useCustomAxios";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

// let branchName = localStorage.getItem(
//   process.env.REACT_APP_URL + "BRANCH_NAME"
// ) || "";
// let branchId = localStorage.getItem(process.env.REACT_APP_URL + "BRANCH_VALUE") || "";
const branchInfo = JSON.parse(sessionStorage.getItem("BRANCH_INFO")) || {}

console.log({ branchInfo });

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState({
    name: branchInfo?.name || null,
    code: branchInfo?.code || null,
    taxScheme: branchInfo?.taxScheme || null
  });

  console.log({ selectedBranch });


  const [user, setUser] = useState();
  const axios = useCustomAxios();

  const fetchUser = async () => {
    const response = await axios.get(`/bff/user`);
    console.log({ response });
    return response?.data;
  };
  const login = () => {
    //window.location.href = `${process.env.REACT_APP_BASENAME}/bff/login?returnUrl=${process.env.REACT_APP_BASENAME}/admin/index`
    console.log("green", process.env.REACT_APP_BASENAME);
    // const temp = "/gra-invoicer";
    window.location.href = `${process.env.REACT_APP_BASENAME}/bff/login?returnUrl=${process.env.REACT_APP_BASENAME}/index`;
    console.log(
      "Location",
      process.env.REACT_APP_BASENAME,
      window.location.href
    );
  };

  const logout = () => {
    const logoutUrl = user["bff:logout_url"];
    // window.location.href = `${logoutUrl}&returnUrl=${process.env.REACT_APP_BASENAME}/admin/index`
    window.location.href = `${logoutUrl}&returnUrl=/auth/logout`;
    //    window.location = `${logoutUrl}&returnUrl=${process.env.REACT_APP_POST_LOGOUT_REDIRECT}`
  };

  const onSuccessResponse = async (res) => {
    const obj = {};
    res.forEach((x) => {
      obj[x?.type] = x?.value;
    });
    setIsAuthenticated(true);
    setUser(obj);
    const { data } = await axios.get("/api/GetCompanyName");
    setUser((prev) => ({ ...prev, companyName: data + ", " }));
  };
  const onErrorResponse = (err) => {
    console.log({ onErrorResponse: err });
    setIsAuthenticated(false);
    window.location = `${process.env.REACT_APP_BASENAME}/login`;
  };

  const fakeBrances = [
    {
      branchId: "2107000d-8b72-44e9-91b8-bf7fd42243a6",
      branchName: "Ksi Branch",
    },
    {
      branchId: "2107000d-8b72-44e9-91b8-bf71d47943a6",
      branchName: "Accra Branch",
    },
    {
      branchId: "2107000d-8b72-44e9-91b8-bf7fd33943a6",
      branchName: "Tema Branch",
    },
  ];

  const fecthBranches = async () => {
    const res = await axios.get("/api/GetBranches");
    return res?.data;
  };

  const { refetch: getUser, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    enabled: false,
    onSuccess: onSuccessResponse,
    onError: onErrorResponse,
  });
  const {
    refetch: getBranches,
    data: branches,
    isLoading: isLoadingBraches,
    isError: isErrorLoadingBranches
  } = useQuery({
    enabled: false,
    queryKey: ["branches"],
    queryFn: fecthBranches,
    cacheTime: Infinity,
    staleTime: Infinity
  });

  // console.log({ branchLoading,isFetching });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        setIsAuthenticated,
        login,
        logout,
        getUser,
        isLoading,
        getBranches,
        isLoadingBraches,
        branches,
        setSelectedBranch,
        selectedBranch,
        isErrorLoadingBranches,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
