import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {
    getAccessToken,
    getRefreshToken,
    getSessionToken, removeAccessToken, removeRefreshToken, removeSessionToken,
    setAccessToken,
    setRefreshToken, setSessionToken
} from "@/shared/lib/helpers/localStorage.ts";
import {Client} from "@/api/axios-client/AuthQuery.ts";
import {setAuthHeaderToInstance} from "@/app/providers/AuthProvider.tsx";



let refreshingFunc: (() => Promise<void>) | undefined = undefined;
export const setupRefreshInterceptor = (
    instance: AxiosInstance,
) => {
    instance.interceptors.response.use(
        (response: AxiosResponse) => response,
        async (error: AxiosError) => {
            if (error.response?.status !== 401) return Promise.reject(error);

            if (refreshingFunc) {
                return Promise.resolve();
            }

            refreshingFunc = async () => {
                const accessToken = getAccessToken() || "";
                const refreshToken = getRefreshToken();
                const sessionToken = getSessionToken();
                await Client.refresh({accessToken, refreshToken: refreshToken || sessionToken || ""})
                    .then((refreshed) => {
                        setAccessToken(refreshed.accessToken);
                        setAuthHeaderToInstance(refreshed.accessToken);
                        if (refreshToken) setRefreshToken(refreshed.refreshToken);
                        else setSessionToken(refreshed.refreshToken);
                    })
                    .catch(() => {
                        removeAccessToken();
                        removeRefreshToken();
                        removeSessionToken();
                    });
                refreshingFunc = undefined;
            };

            await refreshingFunc();
            return axios(error.config!);
        },
    );
};

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL ?? window.location.origin}/`,
    headers: {'Authorization': `Bearer ${getAccessToken()}`}
});

setupRefreshInterceptor(instance);

export {instance};
