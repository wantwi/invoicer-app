import CustomAxios from "api/axios2";
import useAuth from "./useAuth";
import useRefreshtoken from "./useRefreshtoken";
import { useEffect } from "react";

const useCustomAxios = () => {
  CustomAxios.interceptors.response.use((response) => {
    console.log({ response });
    // let stringData = JSON.parse(data);
    // data = JSON.parse(stringData.data);
  });

  return CustomAxios;
};
export default useCustomAxios;
