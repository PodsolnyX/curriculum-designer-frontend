import {Link, useParams} from "react-router-dom";
import {getRoutePlanCompetencies, getRoutePlanSettings, getRoutePlanTitle} from "@/shared/const/router.ts";
import {Button, List, Popover, Typography} from "antd";
import DisplaySettingsPopover from "@/pages/PlanView/ui/widgets/PlanHeader/ui/DisplaySettingsPopover/DisplaySettingsPopover.tsx";
import ToolsPanel from "@/pages/PlanView/ui/widgets/PlanHeader/ui/ToolsPanel/ToolsPanel.tsx";
import {useGetCurriculumQuery} from "@/api/axios-client/CurriculumQuery.ts";
import {
    useGenerateExcelMutation,
    useGeneratePdfMutation,
    useGenerateTxtMutation
} from "@/api/axios-client/DocumentGenerationQuery.ts";
import PageLoader from "@/shared/ui/PageLoader/PageLoader.tsx";
import ValidationPanel from "@/pages/PlanView/ui/widgets/PlanHeader/ui/ValidationPanel/ValidationPanel.tsx";
import {CaretRightOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined} from "@ant-design/icons";
import {TableType} from "@/api/axios-client.types.ts";
import React from "react";
import {CurriculumStatusTypeName} from "@/shared/const/enumRecords.tsx";

const PlanHeader = () => {

    const {id} = useParams<{id: string | number}>();

    const {data: curriculumData} = useGetCurriculumQuery({id: Number(id)});

    const {mutateAsync: generatePdf, isPending: isPendingPdf} = useGeneratePdfMutation(Number(id), {
        onSuccess: (data) => {
            triggerDownloadFileDialog(data.data, data?.fileName || curriculumData?.name || "Учебный план");
        }
    });

    const {mutateAsync: generateExel, isPending: isPendingExel} = useGenerateExcelMutation(Number(id), TableType.Summary,{
        onSuccess: (data) => {
            triggerDownloadFileDialog(data.data, data?.fileName || curriculumData?.name || "Учебный план");
        }
    });

    const {mutateAsync: generateTxt, isPending: isPendingTxt} = useGenerateTxtMutation(Number(id), TableType.Summary,{
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
    console.log(typeof(curriculumData?.status))
    return (
        <header className={"top-0 px-5 py-2 bg-white/[0.8] backdrop-blur z-40 border-b border-b-stone-200 border-solid flex items-center justify-between gap-5 max-w-screen w-full"}>
            <div className={"flex flex-col gap-0.5"}>
                <PageLoader loading={isPendingExel || isPendingTxt || isPendingPdf} title={"Генерация документа..."}/>
                <div className={"max-w-[800px]"}>
                    <Typography.Text ellipsis={true} className={"text-lg"}>{curriculumData?.name}: { curriculumData?.status != null ? CurriculumStatusTypeName[curriculumData.status].name : null}</Typography.Text>
                    
                </div>
                <div className={"flex gap-3 text-md"}>
                    <Link to={getRoutePlanTitle(id || "")}>Титул</Link>
                    <Link to={getRoutePlanCompetencies(id || "")}>Компетенции</Link>
                    <Link to={getRoutePlanTitle(id || "")}>Кафедры</Link>
                    <Link to={getRoutePlanSettings(id || "")}>Настройки</Link>
                    <Popover
                        trigger={"click"}
                        overlayInnerStyle={{padding: 0}}
                        content={
                            <List
                                size="small"
                                itemLayout={"vertical"}
                                dataSource={[
                                    {
                                        key: 'addSemester',
                                        label: 'Экспорт',
                                        children:
                                            <List
                                                size={"small"}
                                                itemLayout={"vertical"}
                                                dataSource={[
                                                    {key: "pdf", icon: <FilePdfOutlined />, label: ".PDF", onClick: generatePdf},
                                                    {key: "txt", icon: <FileTextOutlined />, label: ".TXT", onClick: generateTxt},
                                                    {key: ".XLS", icon: <FileExcelOutlined />, label: ".XLSX", onClick: generateExel}
                                                ]}
                                                renderItem={(item) =>
                                                    <li className={"w-full"}>
                                                        <Button
                                                            type={"text"}
                                                            icon={item.icon}
                                                            className={"w-full justify-start"}
                                                            onClick={() => item.onClick()}
                                                        >{item.label}</Button>
                                                    </li>
                                                }
                                            />,
                                    }
                                ]}
                                renderItem={(item) =>
                                    <li className={"w-full"}>
                                        {
                                            item.children ?
                                                <Popover content={item.children} placement={"right"} overlayInnerStyle={{padding: 0}}>
                                                    <Button
                                                        type={"text"}
                                                        onClick={item.onClick}
                                                        icon={item?.icon}
                                                        danger={item.danger}
                                                        className={"w-full justify-start"}
                                                    >{item.label}<CaretRightOutlined className={"ml-auto"}/></Button>
                                                </Popover> :
                                                <Button
                                                    type={"text"}
                                                    onClick={item.onClick}
                                                    icon={item.icon}
                                                    danger={item.danger}
                                                    className={"w-full justify-start"}
                                                >{item.label}</Button>
                                        }
                                    </li>}

                            />
                        }
                    >
                        <span className={"cursor-pointer"}>Файл</span>
                    </Popover>

                    <DisplaySettingsPopover>
                        <span className={"cursor-pointer"}>
                            Вид
                        </span>
                    </DisplaySettingsPopover>
                </div>
            </div>
            <div className={"flex gap-3"}>
                <ToolsPanel/>
                <ValidationPanel/>
            </div>
        </header>
    )
}

export default PlanHeader;