// import CustomAxios from "api/axios"
// import useAuth from "./useAuth"
// import useRefreshtoken from "./useRefreshtoken"
// import { useEffect } from "react"
// import { toast } from "react-toastify"
// import { logout } from "services/AuthService"

import axios from "axios";

const CustomAxios = axios.create({
  baseURL: process.env.REACT_APP_BASENAME,

  headers: {
    Accept: "application/json",

    "Content-Type": "application/json",

    "X-CSRF": 1,
  },

  //withCredentials: true
});

function useCustomAxios() {
  
    CustomAxios.interceptors.response.use(
        (response) => {
            try {
                let temp = JSON.parse(response?.data);
                response.data = JSON.parse(temp?.data);
                return response;
            } catch (error) {
                return response;
            }
        }, (error) => {
            if (!error.response) {
                alert('NETWORK ERROR')
            } else {
                const code = error.response.status
                const response = error.response.data
                const originalRequest = error.config;

                if (code === 401 && !originalRequest._retry) {
                    originalRequest._retry = true
                    const logoutUrl = user["bff:logout_url"]
                    window.location = `${logoutUrl}&returnUrl=${process.env.REACT_APP_BASENAME}/auth/login`
                }

                return Promise.reject(error)
            }
        }
  );

  return CustomAxios;
}

export default useCustomAxios;

// const useCustomAxios = () => {
//   const { auth } = useAuth()
//   const refresh = useRefreshtoken()

//   useEffect(() => {
//     const requestintercept = CustomAxios.interceptors.request.use(
//       (config) => {
//         if (!config.headers.Authorization) {
//           config.headers.Authorization = `Bearer ${auth?.access_token}`
//         }
//         return config
//       },
//       (error) => Promise.reject(error)
//     )

//     const responseintercept = CustomAxios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const prevRequest = error?.config
//         if (error?.response?.status === 401 && !prevRequest?.sent) {
//           prevRequest.sent = true
//           try {

//             const newAccesstoken = await refresh()
//             prevRequest.headers.Authorization = `Bearer ${newAccesstoken}`
//             return CustomAxios(prevRequest)
//           } catch (error) {
//             toast.info("Could not refresh token. Logging you out.")
//             await logout()
//           }
//         }
//         return Promise.reject(error)
//       }
//     )

//     return () => {
//       CustomAxios.interceptors.request.eject(requestintercept)
//       CustomAxios.interceptors.response.eject(responseintercept)
//     }
//   }, [auth])

//   return CustomAxios
// }

// export default useCustomAxios
