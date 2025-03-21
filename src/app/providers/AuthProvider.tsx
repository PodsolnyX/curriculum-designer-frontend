import React, {createContext, useContext, useEffect, useLayoutEffect, useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {instance} from "@/shared/lib/api/api.ts";
import {useLocalStorage, useSessionStorage} from "@/shared/lib/hooks/useStorage.ts";
import {LS_KEY_ACCESS_TOKEN, LS_KEY_REFRESH_TOKEN, LS_KEY_SESSION_TOKEN} from "@/shared/const/localStorageKeys.ts";

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

    const [accessToken, setAccessToken] = useLocalStorage<string>(LS_KEY_ACCESS_TOKEN, "");
    const [refreshToken, setRefreshToken] = useLocalStorage<string>(LS_KEY_REFRESH_TOKEN, "");
    const [sessionToken, setSessionToken] = useSessionStorage<string>(LS_KEY_SESSION_TOKEN, "");
    const [isAuth, setIsAuth] = useState<boolean>(!!accessToken);
    const queryClient = useQueryClient();

    useLayoutEffect(() => {
        if (accessToken) {
            setIsAuth(true);
        }
    }, [accessToken]);

    useEffect(() => {
        if (!!accessToken) {
            setAuthHeaderToInstance(accessToken);
        }
        else {
            signOut();
        }
    }, [accessToken])

    const signIn = (accessToken: string, refreshToken: string, rememberMe: boolean) => {
        setAccessToken(accessToken);
        if (rememberMe) setRefreshToken(refreshToken);
        else {
            // setRefreshToken("");
            setRefreshToken(refreshToken);
        }
        setAuthHeaderToInstance(accessToken);
        setIsAuth(true);
        queryClient.clear();
    }

    const signOut = () => {

        const removeCache = () => {
            setAccessToken("");
            setSessionToken("");
            setRefreshToken("");
            queryClient.clear();
        }

        setIsAuth(false);
        removeCache();
    }

    // useRefreshToken(isAuth);

    const value: AuthContextValue = {
        isAuth,
        userId: "",
        signIn,
        signOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

interface AuthContextValue {
    isAuth: boolean;
    userId: string;
    signIn(accessToken: string, refreshToken: string, rememberMe: boolean): void;
    signOut(): void;
}

const AuthContext = createContext<AuthContextValue>({
    isAuth: false,
    userId: "",
    signIn(_accessToken: string, _refreshToken: string, _rememberMe: boolean) {},
    signOut() {}
});

export const useAuth = () => {
    return useContext(AuthContext);
}

// const REFRESH_TOKEN_INTERVAL = 4 * 60 * 1000;
//
// export const useRefreshToken = (isAuth: boolean) => {
//
//     const {data, isSuccess} = useQuery({
//         queryKey: queryKeys.refreshToken(),
//         queryFn: () => userService.refreshToken(getRefreshToken() || getSessionToken()),
//         select: ({data}) => data,
//         enabled: false,
//         // enabled: isAuth && (!!getRefreshToken() || !!getSessionToken()),
//         refetchInterval: REFRESH_TOKEN_INTERVAL,
//         refetchIntervalInBackground: true
//     })
//
//     if (isSuccess) {
//         if (data) {
//             setAuthHeaderToInstance(data.auth_token);
//             setAccessToken(data.auth_token);
//
//             if (!!getRefreshToken()) setRefreshToken(data.refresh_token);
//             else setSessionToken(data.refresh_token)
//         }
//     }
//
// }

export function setAuthHeaderToInstance(accessToken: string): void {
    instance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
}