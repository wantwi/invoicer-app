import { useQuery } from "@tanstack/react-query";
// import axios from "axios"
import useCustomAxios from "./useCustomAxios";
import { toast } from "react-toastify";

// let userDetails = JSON.parse(
//     sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
//   )

export const useCustomPaginationQuery = (
  url,
  key,
  page = "",
  period = "",
  text = "",
  onsuccess = () => {},
  onError = () => {},
  options = { isEnabled: true, filterUrl: "", shouldTransform: true }
) => {
  const axios = useCustomAxios();

  const { isEnabled, filterUrl, shouldTransform = true } = options;
  const getFunction = async () => {
    let ul = text ? filterUrl : url;
    const request = await axios.get(ul);
    return request?.data;
  };

  const reactQuery = useQuery({
    queryKey: [key, page, period, text],
    queryFn: getFunction,
    onSuccess: (data) => onsuccess(data),
    onError: (error) => onError(error),
    enabled: isEnabled,
    select: (data) => {
      if (text && shouldTransform) {
        let obj = {},
          pageObj = {};
        pageObj.paging = {
          totalItems: data.length,
          pageNumber: 1,
          pageSize: 5,
          totalPages: 1,
        };
        pageObj.items = data;
        obj.invoices = pageObj;
        obj.summaries = data;

        return obj;
      }
      return data;
    },
  });

  return {
    ...reactQuery,
    isLoading: reactQuery.isLoading && reactQuery.fetchStatus !== "idle",
  };
};
