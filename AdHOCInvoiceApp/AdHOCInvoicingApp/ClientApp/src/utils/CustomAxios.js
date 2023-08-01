import axios from "axios";

const session = JSON.parse(
  sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
);

// console.log({session});
// })

export const CustomAxios = axios.create({
  baseURL: process.env.REACT_APP_CLIENT_ROOT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: session?.access_token,
  },
  withCredentials: true,
});

//REACT_APP_CLIENT_ROOT = 'https://api.e-vatgh.com/api/v1'
//`https://api.e-vatgh.com/api/v1/ReportMetadata`
