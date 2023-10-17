import { useAuth } from "context/AuthContext";
import React from "react";

const LoadingOverlay = (props) => {
  console.log({ props });
  const { showLoader, setShowLoader } = useAuth();
  return (
    <>
      {/* <LoadingOverlay active={showLoader} spinner> */}
        {props.children}
      {/* </LoadingOverlay> */}
    </>
  );
};

export default LoadingOverlay;
