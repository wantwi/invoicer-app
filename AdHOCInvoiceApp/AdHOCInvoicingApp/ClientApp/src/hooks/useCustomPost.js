
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  export const useCustomPost = (url,key,onsuccess=()=>{}, onError=()=>{}) =>{
    const queryClient = useQueryClient()
  
    const postFunction = async (postData)=>{
       
        const request = await axios.post(url,postData,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userDetails?.access_token}`,
              },
        })
        return request.data
    }

   const reactQuery =  useMutation({
        mutationFn: postFunction,
        onSuccess:(data)=>{
            queryClient.invalidateQueries({ queryKey: [key, ""] })
            onsuccess(data)
        },
        onError:(error)=>onError(error), 
        
    })


    return {...reactQuery}

}


 