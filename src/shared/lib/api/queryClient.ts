import {QueryClient} from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            //Время в мс, после которого данные из запросов будут считаться устаревшими
            staleTime: 10 * 60 * 1000
        }
    }
})