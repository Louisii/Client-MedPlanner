import axios from "axios";

// interceptador de requisições. Utilizado para adicionar token para as requisições

const axiosWithToken = axios.create();
axiosWithToken.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = "Bearer " + token;
            config.headers['Cache-Control'] = 'no-cache';
        }
        return config;
    },
    error => Promise.reject(error)
);

export default axiosWithToken;