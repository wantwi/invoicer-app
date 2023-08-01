
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

let userDetails = JSON.parse(
    sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
  )

  export const useCustomDelete = (url,key,text="",onsuccess=()=>{}, onError=()=>{}) =>{
    const queryClient = useQueryClient()
  
    const deleteFunction = async ()=>{
       
        const request = await axios.delete(url,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userDetails?.access_token}`,
              },
        })
        return request.data
    }

   const reactQuery =  useMutation({
        mutationFn: deleteFunction,
        onSuccess:(data)=>{
            // queryClient.invalidateQueries({ queryKey: [key, ""] })
            queryClient.removeQueries({ queryKey: [key, text] })
            onsuccess(data)
        },
        onError:(error)=>onError(error), 
        
    })


    return {...reactQuery}

}


 