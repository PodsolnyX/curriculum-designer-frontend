import axios from "axios";

export const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
    headers: {'Authorization': `Bearer ${localStorage.getItem("accessToken")}`}
});

