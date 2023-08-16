import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCustomAxios from "./useCustomAxios";

let userDetails = JSON.parse(
  sessionStorage.getItem(process.env.REACT_APP_OIDC_USER)
);

export const useCustomPost = (
  url,
  key,
  onsuccess = () => {},
  onError = () => {}
) => {
  const queryClient = useQueryClient();
  const axios = useCustomAxios();

    const postFunction = async (postData) => {
        console.log({ postData })
        console.log({ url })
    const request = await axios.post(url, postData);
    return request.data;
  };

  const reactQuery = useMutation({
    mutationFn: postFunction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [key, ""] });
      onsuccess(data);
    },
    onError: (error) => onError(error),
  });

  return { ...reactQuery };
};
