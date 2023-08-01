
import { useQuery } from "@tanstack/react-query"
// import axios from "axios"
import useCustomAxios from "./useCustomAxios"


export const useCustomQueryById = (url, key, id = "", onsuccess = () => { }, onError = () => { }, options = { isEnabled: false }) => {

  const axios = useCustomAxios()

  const { isEnabled } = options
  const getFunction = async () => {
    const request = await axios.get(url)
    return request.data
  }

  const reactQuery = useQuery({
    queryKey: [key, id],
    queryFn: getFunction,
    onSuccess: (data) => onsuccess(data),
    onError: (error) => onError(error),

    enabled: isEnabled
  })


  return { ...reactQuery, isLoading: reactQuery.isLoading && reactQuery.fetchStatus !== "idle" }

}


