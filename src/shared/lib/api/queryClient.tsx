import {QueryClient} from "@tanstack/react-query";
import {setAxiosFactory} from "@/api/axios-client.ts";
import {instance} from "@/shared/lib/api/api.ts";
import {ReactNode} from "react";
import {QueryClientProvider as TanstackQueryClientProvider} from "@tanstack/react-query";
import {message} from "antd";
import {Client} from "@/api/axios-client/AuthQuery.ts";
import {
    getAccessToken,
    getRefreshToken, getSessionToken,
    removeAccessToken, removeRefreshToken, removeSessionToken,
    setAccessToken, setRefreshToken, setSessionToken
} from "@/shared/lib/helpers/localStorage.ts";
import {setAuthHeaderToInstance} from "@/app/providers/AuthProvider.tsx";

setAxiosFactory(() => instance);

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            throwOnError: false,
            retry(failureCount, error) {
                if (failureCount >= 3) return false;
                if (error && error?.status === 401) {
                    const accessToken = getAccessToken();
                    const refreshToken = getRefreshToken();
                    const sessionToken = getSessionToken();
                    if (accessToken && (refreshToken || sessionToken)) {
                        Client.refresh({accessToken, refreshToken: (refreshToken || sessionToken) as string})
                            .then((data) => {
                                setAccessToken(data.accessToken);
                                setAuthHeaderToInstance(data.accessToken);
                                if (refreshToken) setRefreshToken(data.refreshToken);
                                else setSessionToken(data.refreshToken);
                            })
                            .catch(() => {
                                removeAccessToken();
                                removeRefreshToken();
                                removeSessionToken();
                            });
                    }
                    else {
                        removeAccessToken();
                    }
                }
                return true;
            },
        },
        mutations: {
            onError: () => {
                message.error("Не удалось выполнить операцию")
            }
        }
    }
})

const QueryClientProvider = ({children}: { children: ReactNode }) => {

    return (
        <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
    )
}

export default QueryClientProvider;