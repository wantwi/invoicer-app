import React from "react";
import loader from "../../assets/img/theme/Loading.gif";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LOGO from "../../assets/img/brand/GRA_logi.webp";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        width: "100vw",
        height: "100vh",
        top: 0,
        // left: 0, right: 270, top: 0, bottom: 0,
        placeContent: "center",
        zIndex: 9999999,
        background: "#000",
        opacity: 0.6,
        color: "#fff",
      }}
    >
      <img src={LOGO} width={150} />
      {/* <CircularProgress size={48} /> */}
      {/* <em>Loading...</em> */}
      {/* <Box sx={{ display: 'flex' }}>
      </Box> */}
    </div>
  );
}

export default Loader;
