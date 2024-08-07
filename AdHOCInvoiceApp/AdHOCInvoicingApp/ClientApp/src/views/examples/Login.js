import { useAuth } from "context/AuthContext";
import Loader from "components/Modals/Loader";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import axios from "axios";

const Login = () => {
    const [show, setshow] = useState(false);
    const [isConfig, setIsConfig] = useState(false);
  const { login } = useAuth();
  const loginRef = useRef();

    const getConfigStatus = async () => {
        try {
            const request = await axios.get('https://evat-gra-invoicer.local:5059/api/v4/Company/GetCompanyConfigurationStatus')
            if (request.status === 204) {
                setIsConfig(false)
            } else {
                setIsConfig(true)
            }
        } catch (e) {

        }
    }
  useEffect(() => {
      getConfigStatus()
    sessionStorage.removeItem("BRANCH_INFO")
    

  }, []);
    const handleLogin = () => {
        setshow(true);

        isConfig ? login() : window.location.href = 'https://evat-gra-invoicer.local:5059/identity/account/register?returnUrl=https://evat-gra-invoicer.local:3000/index'
    }

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
                      onClick={handleLogin}
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
                          onClick={handleLogin}
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
