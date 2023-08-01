
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  export const useCustomPut = (url,key,onsuccess=()=>{}, onError=()=>{}) =>{
    const queryClient = useQueryClient()
  
      const postFunction = async (postData) => {
         
        const request = await axios.put(url,postData,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userDetails?.access_token}`,
              },
        })
        return request.data
    }
    // return;

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


 