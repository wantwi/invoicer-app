import { useEffect } from "react"

import useCustomAxios from "../../hook/useCustomAxios"
import Spinner from '../../@core/components/spinner/Fallback-spinner'
import { useOverLay } from "../../context/OverlayContext"
import { useAuth } from "context/AuthContext"

const ProtectedRoute = (props) => {
    const axios =  useCustomAxios()
    const { isAuthenticated, setUser, setIsAuthenticated, login } = useAuth()
   
   
    const fetchUser = async () => {
      
        try {
            const response = await axios.get(`/bff/user`)
            if (response) {
                const obj = {}
                response.data.forEach(x => {
                    obj[x?.type] = x?.value
                })
                setIsAuthenticated(true)
                setUser(obj)
            } else {
                login()
            }
            
            
        } catch (error) {
            setIsAuthenticated(false)
            login()
        }
       
    }

    useEffect(() => {
        if (!isAuthenticated) {
             fetchUser()
        } else {
            
        }

   
    }, [showOverlay])

    return (
        <>
            {
                !isAuthenticated ? <Spinner/> : <>{props.children}</>
            }
        </>
    )
}
export default ProtectedRoute

// import React, { Fragment } from "react";
// import { Redirect } from "react-router-dom";

// const sessionData = JSON.parse(
//   sessionStorage.getItem(
//     "oidc.user:https://demo.persol-apps.com/lms.auth:lms-operation-admin_client"
//   )
// );

// export const ProtectedRoute = ({ authData, children }) => {
//   return (
//     <div>
//       {sessionData?.access_token ? (
//         <Fragment>{children}</Fragment>
//       ) : (
//         <Redirect to={"/login"} />
//       )}
//     </div>
//   );
// };
//import { userLogin } from "config/config";
//import useAuth from "hooks/useAuth";
//import useLoader from "hooks/useLoader";
//import React, { Fragment, useLayoutEffect } from "react";
//import { Redirect } from "react-router-dom";

//export const ProtectedRoute = ({ children }) => {
//  const { isLoading, setIsLoading } = useLoader();
//  const { auth } = useAuth();


//    useLayoutEffect(() => {
//      if(!auth?.accessToken){
//        // setIsLoading(true)
//       // userLogin();
//      }
     
    
//      return () => {
        
//      }
//    }, [])

//  // console.log({auth})

//  return (
//    <div>
//      {auth?.accessToken ? (
//        <Fragment>{children}</Fragment>
//      ) : (
//        //null
//        <Fragment>{children}</Fragment>
//      )}
//    </div>
//  );
//};
