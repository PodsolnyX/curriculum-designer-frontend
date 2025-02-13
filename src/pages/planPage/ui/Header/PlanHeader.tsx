import {Link, useParams} from "react-router-dom";
import {getRoutePlanCompetencies, getRoutePlanSettings, getRoutePlanTitle} from "@/shared/const/router.ts";
import {Typography} from "antd";
import DisplaySettingsPopover from "@/pages/planPage/ui/DisplaySettingsPopover.tsx";
import ToolsPanel from "@/pages/planPage/ui/ToolsPanel/ToolsPanel.tsx";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";

const PlanHeader = () => {

    const {id} = useParams<{id: string | number}>();

    const {data} = useGetCurriculumQuery({id: Number(id)});

    return (
        <header className={"top-0 px-5 py-2 bg-white/[0.8] backdrop-blur z-40 border-b border-b-stone-200 border-solid flex items-center justify-between gap-5 max-w-screen w-full"}>
            <div className={"flex flex-col gap-0.5"}>
                <div className={"max-w-[800px]"}>
                    <Typography.Text ellipsis={true} className={"text-lg"}>{data?.name}</Typography.Text>
                </div>
                <div className={"flex gap-3 text-md"}>
                    <Link to={getRoutePlanTitle(id || "")}>Титул</Link>
                    <Link to={getRoutePlanCompetencies(id || "")}>Компетенции</Link>
                    <Link to={getRoutePlanTitle(id || "")}>Кафедры</Link>
                    <Link to={getRoutePlanSettings(id || "")}>Настройки</Link>
                    <DisplaySettingsPopover>
                        <span className={"cursor-pointer"}>
                            Вид
                        </span>
                    </DisplaySettingsPopover>
                </div>
            </div>
            <div className={"flex gap-5"}>
                <ToolsPanel/>
            </div>
        </header>
    )
}

export default PlanHeader;