import {Link, useParams} from "react-router-dom";
import {getRoutePlanCompetencies, getRoutePlanSettings, getRoutePlanTitle} from "@/shared/const/router.ts";
import {Typography} from "antd";
import DisplaySettingsPopover from "@/pages/planPage/ui/DisplaySettingsPopover.tsx";
import ToolsPanel from "@/pages/planPage/ui/ToolsPanel/ToolsPanel.tsx";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {
    useGeneratePdfMutation
} from "@/api/axios-client/DocumentGenerationQuery.ts";
import PageLoader from "@/shared/ui/PageLoader/PageLoader.tsx";

const PlanHeader = () => {

    const {id} = useParams<{id: string | number}>();

    const {data: curriculumData} = useGetCurriculumQuery({id: Number(id)});

    const {mutateAsync: generatePdf, isPending} = useGeneratePdfMutation(Number(id), {
        onSuccess: (data) => {
            triggerDownloadFileDialog(data.data, data?.fileName || curriculumData?.name || "Учебный план");
        }
    });

    function triggerDownloadFileDialog(blob: Blob, fileName: string) {
        const data = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        link.click();
        setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            URL.revokeObjectURL(data);
        }, 100);
    }

    return (
        <header className={"top-0 px-5 py-2 bg-white/[0.8] backdrop-blur z-40 border-b border-b-stone-200 border-solid flex items-center justify-between gap-5 max-w-screen w-full"}>
            <div className={"flex flex-col gap-0.5"}>
                <PageLoader loading={isPending} title={"Генерация документа..."}/>
                <div className={"max-w-[800px]"}>
                    <Typography.Text ellipsis={true} className={"text-lg"}>{curriculumData?.name}</Typography.Text>
                </div>
                <div className={"flex gap-3 text-md"}>
                    <Link to={getRoutePlanTitle(id || "")}>Титул</Link>
                    <Link to={getRoutePlanCompetencies(id || "")}>Компетенции</Link>
                    <Link to={getRoutePlanTitle(id || "")}>Кафедры</Link>
                    <Link to={getRoutePlanSettings(id || "")}>Настройки</Link>
                    <span onClick={() => generatePdf()} className={"cursor-pointer"}>Генерация документа</span>
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