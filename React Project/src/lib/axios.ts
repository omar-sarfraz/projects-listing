import axios from "axios";
import { BASE_URL } from "../configs/urls";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    console.log(config);
    return config;
});

export default axiosInstance;
