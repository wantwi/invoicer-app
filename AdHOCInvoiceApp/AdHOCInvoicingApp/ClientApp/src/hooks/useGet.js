import { useQuery } from "@tanstack/react-query";
import useCustomAxios from "./useCustomAxios";
// import axios from "axios"

/**
 * Makes a GET request using Axios and React Query.
 * @param {string} url - The URL to fetch data from.
 * @param {Array} key - An array of keys to be used as the query key for React Query.
 * @param {Function} onsuccess - A callback function to be called when the request succeeds. (Optional)
 * @param {Function} onError - A callback function to be called when the request fails. (Optional)
 * @returns {Object} - An object containing the fetched data, loading state, and error state.
 */
export const useGet = (
  url,
  [...key],
  onsuccess = () => {},
  onError = () => {}
) => {
  const axios = useCustomAxios();

  const getFunction = async () => {
    const request = await axios.get(url);
    console.log({ request });
    //  const result = JSON.parse(request.data)

    if (request?.data.includes("Unauthorized")) {
      window.location.href = `${process.env.REACT_APP_BASENAME}/bff/login?returnUrl=${process.env.REACT_APP_BASENAME}${window.location.pathname}`;
    }

    if (request?.data.includes("Internal Server Error")) {
      alert("here");

      const error = new Error("Internal Server Error");
      error.code = 500;
      throw error;
    }

    return request?.data; //JSON.parse(result.data) //JSON.parse(data?.data || data?.ErrorMessage)
  };

  const reactQuery = useQuery({
    queryKey: [...key],
    queryFn: getFunction,
    onSuccess: (data) => onsuccess(data || []),
    onError: (error) => onError(error),
    enabled: !!url,
  });
  return reactQuery;
};

//Example Usage
//  const { data, isLoading, error } = useGet("https://api.example.com/data", ["data"], handleSuccess, handleError)
