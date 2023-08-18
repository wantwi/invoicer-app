import React, { useState, useContext } from "react"
import useCustomAxios from "../hooks/useCustomAxios"
import { useQuery } from "@tanstack/react-query"
export const AuthContext = React.createContext()
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({
    children
}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [user, setUser] = useState()
   const axios =  useCustomAxios()

    const fetchUser = async () => {
        const response = await axios.get(`/bff/user`)
        console.log({ response })
        return response?.data
    }
    const login = () => {
        //window.location.href = `${process.env.REACT_APP_BASENAME}/bff/login?returnUrl=${process.env.REACT_APP_BASENAME}/admin/index`
        console.log("green", process.env.REACT_APP_BASENAME)
        window.location.href = `${process.env.REACT_APP_BASENAME}/bff/login?returnUrl=${process.env.REACT_APP_BASENAME}/admin/index`
        console.log("Location", process.env.REACT_APP_BASENAME, window.location.href)
    }

    const logout = () => {
        const logoutUrl = user["bff:logout_url"]
        window.location = `${logoutUrl}&returnUrl=${process.env.REACT_APP_BASENAME}/auth/login`
       
    }

    const onSuccessResponse = (data) => {
        const obj = {}
        data.forEach(x => {
            obj[x?.type] = x?.value
        })
        setIsAuthenticated(true)
        setUser(obj)
    }
    const onErrorResponse = (err) => {
        console.log({err})
        setIsAuthenticated(false)
        window.location = `${process.env.REACT_APP_BASENAME}/login`
    }

    const { refetch: getUser, isLoading } = useQuery({ queryKey: ['user'], queryFn:  fetchUser, enabled: false, onSuccess: onSuccessResponse, onError: onErrorResponse })


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                setUser,
                setIsAuthenticated,
                login,
                logout,
                getUser,
                isLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}