import { useState, useEffect, useCallback } from "react";
import useCustomApi from "./useCustomAxios";


const useMultiFetchAllSettled = (initialUrl, callback) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [urls, setUrls] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false)
  const api = useCustomApi()
  const executeFetch = useCallback(async () => {
    setIsLoading(true)

 

    
    try {
        let requests = []
        urls.forEach(link => {

            requests.push(api.get(link))
        });

      const response = await Promise.allSettled(requests)
      if (!response) {
        throw "Data was not fetched";
      }
     setData(response)
      callback(response);
      setError(null);
      setIsLoading(false)
      setUrls([])
    } catch (error) {
      
      setError(error);
      setIsLoading(false)
      setUrls([])
    }
  });

 

  useEffect(() => {
    if(urls.length > 0){
      executeFetch();
    }
  }, [urls]);

  console.log({data});

 

  return { data, error, isLoading, setUrls };
};

 

export default useMultiFetchAllSettled;