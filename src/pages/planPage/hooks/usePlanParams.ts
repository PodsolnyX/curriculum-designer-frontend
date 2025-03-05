import {useSearchParams} from "react-router-dom";
import {useMemo} from "react";

export const sidebarContentParamKey = "content";
export const sidebarValueParamKey = "value";
export type SidebarContentParamKeyValue = "validation" | "atom";

export const usePlanParams = () => {
    const [params, setParams] = useSearchParams();

    const sidebarContent = useMemo(() => params.get(sidebarContentParamKey) || "", [params]);
    const sidebarValue = useMemo(() => params.get(sidebarValueParamKey) || "", [params]);
    const setSidebarContent = (content?: SidebarContentParamKeyValue, value?: string) => {
        setParams((prev) => {
            if (!content) {
                prev.delete(sidebarContentParamKey);
                prev.delete(sidebarValueParamKey);
            } else {
                prev.set(sidebarContentParamKey, content);
                value && prev.set(sidebarValueParamKey, value);
            }
            return prev;
        });
    }

    return {
        sidebarContent,
        sidebarValue,
        setSidebarContent,
    }
}