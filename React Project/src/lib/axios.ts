import axios from "axios";
import { BASE_URL } from "../configs/urls";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

export default axiosInstance;
