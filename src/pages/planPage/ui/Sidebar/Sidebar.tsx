import {CloseOutlined} from "@ant-design/icons";
import {
    SidebarContentParamKeyValue,
    usePlanParams
} from "@/pages/planPage/hooks/usePlanParams.ts";
import ValidationContent from "@/pages/planPage/ui/Sidebar/ValidationContent.tsx";
import AtomContent from "@/pages/planPage/ui/Sidebar/AtomContent.tsx";
import {ReactNode} from "react";

const Sidebar = () => {

    const {sidebarContent, setSidebarContent} = usePlanParams()

    const content: Record<SidebarContentParamKeyValue, ReactNode> = {
        "validation": <ValidationContent/>,
        "atom": <AtomContent/>
    }

    return (
        <div style={{height: "calc(100vh - 64px)"}}
             className={`shadow-lg overflow-y-auto fixed ${!!content[sidebarContent] ? "right-0" : "right-[-330px]"} transition-all bg-white/[0.8] max-w-[330px] w-full backdrop-blur p-5 min-h-full border-l border-l-stone-200 border-solid`}>
            <CloseOutlined
                className={"absolute top-3 right-3 text-stone-400 hover:text-black transition hover:bg-stone-100 p-1 rounded-full"}
                onClick={() => setSidebarContent(undefined)}
            />
            { content[sidebarContent] }
        </div>

    )
}

export default Sidebar;