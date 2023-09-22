import { useState, useRef, useEffect } from "react";
import useAuth from "hooks/useAuth";
import graLogo2 from "../assets/img/brand/GRA_logi.webp";

const BranchCompo = ({ loggingOut = false }) => {
  const { setSelectedBranch, branches } = useAuth();
  const [branch] = useState(
    localStorage.getItem(process.env.REACT_APP_URL + "BRANCH_VALUE") || ""
  );
  let branchRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(
      process.env.REACT_APP_URL + "BRANCH_VALUE",
      branchRef?.current?.options[branchRef?.current?.selectedIndex]?.value
    );
    localStorage.setItem(
      process.env.REACT_APP_URL + "BRANCH_NAME",
      branchRef?.current?.options[branchRef?.current?.selectedIndex]?.innerText
    );
    setSelectedBranch({
      name: branchRef?.current?.options[branchRef?.current?.selectedIndex]
        ?.innerText,
      code: branchRef?.current?.options[branchRef?.current?.selectedIndex]
        ?.value,
    });
  };

  useEffect(() => {
    let clearTimeOut = null;
    const delay = () =>
      setTimeout(() => {
        window.location.href = "https://evat-suite.persolqa.com";
      }, 1000);
    if (loggingOut) clearTimeOut = delay();

    return () => {
      clearTimeOut !== null && clearTimeOut();
    };
  }, []);

  return (
    <div id="loading-screen">
      <div className="loading-branches">
        {!loggingOut ? (
          <>
            <div
              className="d-flex justify-content-between"
              style={{ alignItems: "center" }}
            >
              <img src={graLogo2} style={{ width: "200px", height: "80px" }} />
            </div>
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="branch" className="text-left d-block">
                Select your branch
              </label>
              <select
                id="branch"
                defaultValue={branch}
                className="form-control"
                ref={branchRef}
              >
                {branches?.map((branch) => {
                  return (
                    <option
                      key={branch?.code}
                      className="form-control"
                      value={branch?.code}
                    >
                      {branch?.name}
                    </option>
                  );
                })}
              </select>
              <div className="text-right py-5">
                <button autoFocus type="submit" className="btn btn-primary">
                  Continue
                </button>
              </div>
            </form>
          </>
        ) : (
          <h1>Logging out...</h1>
        )}
      </div>
    </div>
  );
};

export default BranchCompo;
