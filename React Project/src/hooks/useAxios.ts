import axios from "axios";
import { BASE_URL } from "../configs/urls";
import { User } from "../lib/types";

const useAxios = () => {
    const user = localStorage.getItem("user");
    let parsedUser: User;
    if (user) parsedUser = JSON.parse(user);

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
    });

    axiosInstance.interceptors.request.use((config) => {
        if (parsedUser?.token) config.headers.Authorization = `Bearer ${parsedUser.token}`;
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => Promise.reject(error)
    );

    return axiosInstance;
};

export default useAxios;
