import { useAuth } from "context/AuthContext";
import Loader from "components/Modals/Loader";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
const Login = () => {
  const [show, setshow] = useState(false);
  const { login } = useAuth();
  const loginRef = useRef();
  useEffect(() => {
    //loginRef?.current.click()
  }, []);

  return (
    <>
      <div style={styles.container}>
        <h1 style={{ color: "#f1f1f1", marginBottom: 20 }}>
          Welcome to GRA's Invoicing App
        </h1>
        {!show ? (
          <button
            autoFocus
            className="login-button"
            style={styles.buttonWrap}
            ref={loginRef}
            disabled={show}
            onClick={() => {
              setshow(true);
              login();
            }}
          >
            Click&nbsp;to&nbsp;Login{" "}
          </button>
        ) : (
          <button
            autoFocus
            className="login-button"
            style={styles.buttonWrap}
            ref={loginRef}
            disabled={show}
            onClick={() => {
              setshow(true);
              login();
            }}
          >
            Loading...
          </button>
        )}
      </div>
    </>
  );
};

export default Login;

const styles = {
  main: {
    display: "flex",
    flexDirection: "row",
  },
  container: {
    height: "100vh",
    background: "rgb(37, 39, 60)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  buttonWrap: {
    width: "10%",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    background: "linear-gradient(hsl(192, 100%, 67%),hsl(280, 87%, 65%))",
    border: "none",
    color: "white",
  },
};
