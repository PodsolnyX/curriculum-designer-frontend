import {QueryClient} from "@tanstack/react-query";
import axios from "axios";
import {setAxiosFactory} from "@/api/axios-client.ts";
import {instance} from "@/shared/lib/api/api.ts";
import {ReactNode} from "react";
import {QueryClientProvider as TanstackQueryClientProvider} from "@tanstack/react-query";
import {App} from "antd";

setAxiosFactory(() => instance);

const QueryClientProvider = ({children}: { children: ReactNode }) => {

    const {message} = App.useApp();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                throwOnError: false,
                retry(failureCount, error) {
                    if (failureCount >= 3) return false;
                    if (axios.isAxiosError(error) && error.response?.status === 401) {
                        return false;
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

    return (
        <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
    )
}

export default QueryClientProvider;