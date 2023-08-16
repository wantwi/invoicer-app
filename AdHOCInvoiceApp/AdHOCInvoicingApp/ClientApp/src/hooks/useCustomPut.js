
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

import useCustomAxios from "./useCustomAxios";


  export const useCustomPut = (url,key,onsuccess=()=>{}, onError=()=>{}) =>{
    const queryClient = useQueryClient()
  
      const axios = useCustomAxios();

      const postFunction = async (postData) => {
          console.log({ postData })
          console.log({ url })
          const request = await axios.put(url, postData);
          return request.data;
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


 