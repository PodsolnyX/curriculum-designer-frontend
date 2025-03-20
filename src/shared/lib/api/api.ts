import axios from "axios";
import {getAccessToken} from "@/shared/lib/helpers/localStorage.ts";

export const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/`,
    headers: {'Authorization': `Bearer ${getAccessToken()}`}
});

