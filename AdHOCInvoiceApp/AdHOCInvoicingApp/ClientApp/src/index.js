import "./utils/globals";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

// import "assets/plugins/nucleo/css/nucleo.css";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "assets/scss/argon-dashboard-react.scss";
// import "react-datepicker/dist/react-datepicker.css";
import "assets/css/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.js";
import { AuthProvider } from "context/AuthContext";
import swDev from "./swDev";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5VdkRiW31bcXRTQWhe"
);

const queryClient = new QueryClient();

ReactDOM.render(
  <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,

  document.getElementById("root")
);

swDev();
