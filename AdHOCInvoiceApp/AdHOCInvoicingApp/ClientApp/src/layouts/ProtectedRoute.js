import { useEffect } from "react"
import useCustomAxios from "hooks/useCustomAxios"
import { useAuth } from "context/AuthContext"
import Loader from "components/Modals/Loader"

const ProtectedRoute = (props) => {
    const axios = useCustomAxios()
    const { isAuthenticated, setUser, setIsAuthenticated, login } = useAuth()


    const fetchUser = async () => {
        try {
            const response = await axios.get(`/bff/user`)

            console.log({ response });

            if (response) {
                const obj = {}
                response.data.forEach(x => {
                    obj[x?.type] = x?.value
                })
                setIsAuthenticated(true)
                setUser(obj)
            } else {
                // login()
            }


        } catch (error) {

            if (error?.response?.status === 401) {
                login()
            }

            console.log({ error }, "call get user")
            setIsAuthenticated(false)

        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            fetchUser()
        } else {

        }
    }, [])

    return (
        <>
            {
                !isAuthenticated ? <Loader /> : <>{props.children}</>
            }
        </>
    )
}
export default ProtectedRoute
