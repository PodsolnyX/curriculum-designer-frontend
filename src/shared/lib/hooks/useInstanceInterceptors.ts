import {useAuth} from "@/app/providers/AuthProvider.tsx";
import {useMutation} from "@tanstack/react-query";
import {userService} from "@/shared/lib/services/user/userService.ts";
import {getAccessToken, getRefreshToken} from "@/shared/lib/helpers/localStorage.ts";
import {AxiosError, AxiosResponse} from "axios";
import {instance} from "@/shared/lib/api/api.ts";

export const useInstanceInterceptors = () => {

    const { signOut } = useAuth();

    const {mutate: refreshToken } = useMutation({
        mutationFn: () => userService.refreshToken(getRefreshToken()),
        onError: () => {
            signOut();
        }
    })

    const onResponse = (response: AxiosResponse): AxiosResponse => {
        return response;
    }

    const onResponseError = (error: AxiosError): Promise<AxiosError> => {
        onUnauthorizedError(error);
        onInternalServerError(error);
        return Promise.reject(error);
    }

    const onUnauthorizedError = (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (getAccessToken() && getRefreshToken()) refreshToken()
            else signOut();
        }
    }

    const onInternalServerError = (error: AxiosError) => {
        if (error.response?.status === 500 || error.response?.status === 502) {

        }
    }

    instance.interceptors.response.use(onResponse, onResponseError);
}