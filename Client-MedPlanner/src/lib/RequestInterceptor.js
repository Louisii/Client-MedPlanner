import axios from "axios";

// interceptador de requisições. Utilizado para adicionar token para as requisições

const token = localStorage.getItem("token");

const axiosWithToken = axios.create();
axiosWithToken.interceptors.request.use(
    config => {
        if (token) {
            config.headers.Authorization = "Bearer " + token;
            config.headers['Cache-Control'] = 'no-cache';
        }
        return config;
    },
    error => Promise.reject(error)
);

// axiosWithToken.interceptors.response.use(
//     response => {
//         // console.log(response.data);
//         return response;
//     },
//     error => {
//         if (error.response)
//             console.log("Erro em RequestInterceptor: " + error);
//         else
//             return Promise.reject(error);
//     }
// );

export default axiosWithToken;