import {useSearchParams} from "react-router-dom";

const sidebarContentParamKey = "content";
const sidebarValueParamKey = "value";
export type SidebarContentParamKeyValue = "validation" | "atom";

export const usePlanParams = () => {
    const [params, setParams] = useSearchParams();
    const setSidebarContent = (content?: SidebarContentParamKeyValue, value?: string) => {
        setParams((prev) => {
            if (!content) {
                prev.delete(sidebarContentParamKey);
                prev.delete(sidebarValueParamKey);
            }
            else {
                prev.set(sidebarContentParamKey, content);
                value && prev.set(sidebarValueParamKey, value);
            }
            return prev;
        })
    }

    return {
        sidebarContent: params.get(sidebarContentParamKey) || "",
        sidebarValue: params.get(sidebarValueParamKey) || "",
        setSidebarContent,
    }
}