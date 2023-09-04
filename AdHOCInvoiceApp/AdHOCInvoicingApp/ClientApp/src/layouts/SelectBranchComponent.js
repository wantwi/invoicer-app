import React, { useEffect, useRef } from "react";
import useAuth from "hooks/useAuth";
import Admin from "./Admin";

import graLogo from "../assets/img/theme/gra.png";
import graLogo2 from "../assets/img/brand/GRA_logi.webp";

const SelectBranchComponent = (props) => {
  const {
    user,
    getBranches,
    branches,
    isLoadingBraches,
    selectedBranch,
    isErrorLoadingBranches,
    setSelectedBranch,
    getUser,
  } = useAuth();
  let branchRef = useRef();

  console.log({ user });
  useEffect(() => {
    const checkIsALoggedIn = async () => {
      if (!user) {
        //window.location.href = `${process.env.REACT_APP_BASENAME}/login`
      }
    };
    checkIsALoggedIn();
    return () => {};
  }, []);

  if (user && isLoadingBraches) {
    return (
      <div id="loading-screen">
        <div className="loading-branches">
          <img src={graLogo2} />
          <h1>Loading branches</h1>
        </div>
      </div>
    );
  }

  if (isErrorLoadingBranches) {
    return (
      <div id="loading-screen">
        <h1>Error Loading Branches branches</h1>
      </div>
    );
  }

  console.log({
    ll: localStorage.getItem(process.env.REACT_APP_OIDC_USER + "BRAMCH_NAME"),
  });

  return (
    <>
      {user && selectedBranch && branches?.length > 0 ? (
        <Admin {...props} />
      ) : (
        <div id="loading-screen">
          <div className="loading-branches">
            <div
              className="d-flex justify-content-between"
              style={{ alignItems: "center" }}
            >
              <img src={graLogo2} style={{ width: "190px", height: "100px" }} />
              {/* Logo of Company */}
            </div>
            <h1 className="text-left">Select your branch</h1>
            <select
              className="form-control"
              ref={branchRef}
              defaultValue={localStorage.getItem(
                process.env.REACT_APP_OIDC_USER + "BRAMCH_NAME"
              )}
            >
              {branches?.map((branch) => {
                return (
                  <>
                    <option className="form-control" value={branch?.branchId}>
                      {branch?.branchName}
                    </option>
                  </>
                );
              })}
            </select>
            <div className="text-right py-5">
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  localStorage.setItem(
                    process.env.REACT_APP_OIDC_USER + "BRAMCH_NAME",
                    branchRef?.current?.options[
                      branchRef?.current?.selectedIndex
                    ]?.value
                  );
                  setSelectedBranch({
                    branchName:
                      branchRef?.current?.options[
                        branchRef?.current?.selectedIndex
                      ]?.innerText,
                    branchId:
                      branchRef?.current?.options[
                        branchRef?.current?.selectedIndex
                      ]?.value,
                  });
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectBranchComponent;
