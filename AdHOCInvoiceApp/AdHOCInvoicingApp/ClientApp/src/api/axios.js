import axios from "axios";


const CustomAxios = axios.create({
    baseURL: process.env.REACT_APP_CLIENT_ROOT_V2,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    // withCredentials: false
});

export default CustomAxios;



