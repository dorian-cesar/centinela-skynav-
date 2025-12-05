import axios from "axios";
import { env } from "@/shared/config/envConfig";

export const httpClient = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: env.apiTimeout,
    headers: {
        "Content-Type": "application/json",
    },
});

httpClient.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("HTTP Error:", err.response?.data || err.message);
        return Promise.reject(err);
    }
);
