import axios from "axios";
import { BASE_URL } from "../configs/urls";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

const useAxios = (shouldDisplayError: boolean = true) => {
    const { user } = useAuth();
    const { toast } = useToast();

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
    });

    axiosInstance.interceptors.request.use((config) => {
        if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.log(error);
            shouldDisplayError && toast(error.response?.data?.message || error?.message, "error");
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default useAxios;
