
import { useMutation, useQueryClient } from "@tanstack/react-query"
import useCustomAxios from "./useCustomAxios";


  export const useCustomDelete = (url,key,text="",onsuccess=()=>{}, onError=()=>{}) =>{
    const queryClient = useQueryClient()
          const axios = useCustomAxios();
  

      const deleteFunction = async (postData) => {
          const request = await axios.delete(url, postData);

        //   if(JSON.parse(request?.data?.data)?.errorId)
        if(request?.data?.status >=400){
            // console.log({useMutationError: JSON.parse(request?.data?.data)?.message});
            
            const error = new Error(JSON.parse(request?.data?.data)?.message)

            error.code = request?.data?.status 

            console.log({useMutationError: error});
  
            throw error;
        }

       
          return request.data;
      }

   const reactQuery =  useMutation({
        mutationFn: deleteFunction,
        onSuccess:(data)=>{
            queryClient.removeQueries({ queryKey: [key, text] })
            onsuccess(data)
        },
        onError:(error)=>onError(error), 
        
    })


    return {...reactQuery}

}


 