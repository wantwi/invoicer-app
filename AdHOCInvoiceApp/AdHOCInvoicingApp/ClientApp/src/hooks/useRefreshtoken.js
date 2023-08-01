import { renewToken } from "services/AuthService";
import useAuth from "./useAuth";


const useRefreshtoken = () => {
    const {setAuth} = useAuth()

    const refresh = async ()=>{
        const  refresh = await renewToken();

        const {access_token} =refresh

        setAuth(refresh);

        return access_token
    }
 return refresh
}

export default useRefreshtoken 