import {Link, useParams} from "react-router-dom";
import {getRoutePlanCompetencies, getRoutePlanTitle} from "@/shared/const/router.ts";
import {Popover, Typography} from "antd";
import DisplaySettingsPopover from "@/pages/planPage/ui/DisplaySettingsPopover.tsx";
import ToolsPanel from "@/pages/planPage/ui/ToolsPanel/ToolsPanel.tsx";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";

const PlanHeader = () => {

    const {id} = useParams<{id: string | number}>();

    const {data} = useGetCurriculumQuery({id: Number(id)});

    return (
        <header className={"fixed left-0 top-0 px-5 py-2 bg-white/[0.7] backdrop-blur z-40 shadow-md flex items-center justify-between gap-5 max-w-screen w-full"}>
            <div className={"flex flex-col gap-0.5"}>
                <div className={"max-w-[800px]"}>
                    <Typography.Text ellipsis={true} className={"text-lg"}>{data?.name}</Typography.Text>
                </div>
                <div className={"flex gap-3 text-md"}>
                    <Link to={getRoutePlanTitle(id || "")}>Титул</Link>
                    <Link to={getRoutePlanCompetencies(id || "")}>Компетенции</Link>
                    <Link to={getRoutePlanTitle(id || "")}>Кафедры</Link>
                    <Popover
                        content={DisplaySettingsPopover}
                        title={"Настройки отображения"}
                        trigger={"click"}
                        placement={"bottomLeft"}
                    >
                    <span className={"cursor-pointer"}>
                        Вид
                    </span>
                    </Popover>
                </div>
            </div>
            <ToolsPanel/>
        </header>
    )
}

export default PlanHeader;