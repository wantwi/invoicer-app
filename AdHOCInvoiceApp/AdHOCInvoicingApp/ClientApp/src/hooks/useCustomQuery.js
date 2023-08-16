
import { useQuery } from "@tanstack/react-query"
// import axios from "axios"
import useCustomAxios from "./useCustomAxios"

let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  export const useCustomQuery = (url,key,text="", onsuccess=()=>{}, onError=()=>{},options ={isEnabled: true,queryTag:"/?filter="}) =>{

  const axios = useCustomAxios()
  
    const {isEnabled, queryTag} = options
    const getFunction = async ()=>{
        const request = await axios.get(url)
        return request.data
    }

   const reactQuery =  useQuery({
        queryKey:[key,text],
        queryFn:getFunction,
        onSuccess:(data)=>onsuccess(data),
        onError:(error)=>onError(error), 
       
        enabled:isEnabled
    })


    return {...reactQuery}

}


