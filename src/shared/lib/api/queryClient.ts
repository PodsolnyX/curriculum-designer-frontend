import {QueryClient} from "@tanstack/react-query";
import axios from "axios";
import {setAxiosFactory} from "@/api/axios-client.ts";
import {instance} from "@/shared/lib/api/api.ts";

setAxiosFactory(() => instance);

export const queryClient = new QueryClient({
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
        }
    }
})