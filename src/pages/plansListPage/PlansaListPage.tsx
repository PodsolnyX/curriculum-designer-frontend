import {
    searchCurriculumsQueryKey,
    useDeleteCurriculumMutation,
    useSearchCurriculumsQuery
} from "@/api/axios-client/CurriculumQuery.ts";
import {Link} from "react-router-dom";
import {getRouteMain, getRoutePlanTitle} from "@/shared/const/router.ts";
import {Button, List, Popover, Skeleton, Table, TableProps, Typography} from "antd";
import {DeleteOutlined, MoreOutlined} from "@ant-design/icons";
import {AddPlanModal} from "@/pages/plansListPage/AddPlanModal.tsx";
import React, {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {CurriculumShortDto} from "@/api/axios-client.types.ts";
import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import TracksIcon from "@/shared/assets/icons/tracks.svg?react";

const PlansListPage = () => {

    const {data: curriculums, isLoading} = useSearchCurriculumsQuery();
    const [isOpen, setIsOpen] = useState(false);

    const headerExtra = () => {
        return (
            <>
                <Typography className={"text-2xl"}>{"Учебные планы"}</Typography>
                <Button
                    type={"primary"}
                    shape={"round"}
                    size={"large"}
                    className={"font-bold"}
                    onClick={() => setIsOpen(true)}
                >Новый план</Button>
            </>
        )
    }

    return (
        <PlanPageLayout
            menuItems={[
                {
                    value: "main",
                    name: "Учебные планы",
                    icon: TracksIcon,
                    path: getRouteMain()
                }
            ]}
            currentMenuItem={"main"}
            headerExtra={headerExtra}
        >
            <>
                {
                    isLoading ? <Skeleton className={"p-10"}/> :
                        <Table
                            dataSource={curriculums}
                            columns={columns}
                            sticky
                            pagination={{
                                pageSize: 20,
                                position: ["bottomLeft"]
                            }}
                        />
                }
                <AddPlanModal onClose={() => setIsOpen(false)} isOpen={isOpen}/>
            </>
        </PlanPageLayout>
    )
}

const columns: TableProps<CurriculumShortDto>['columns'] = [
    {
        title: 'Имя плана',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record) => <Link to={getRoutePlanTitle(record.id)} target={"_blank"}>{text}</Link>
    },
    {
        key: "",
        width: "100px",
        align: "center",
        render: (_, record) => <div className={"flex gap-2"}>
            <Popover trigger={"click"} placement={"bottom"} content={() => ContextMenu({planId: record.id})}>
                <Button shape={"circle"} icon={<MoreOutlined />}/>
            </Popover>
        </div>
    }
];

interface ContextMenuProps {
    planId: number;
}

const ContextMenu = ({planId}: ContextMenuProps) => {

    const queryClient = useQueryClient();

    const {mutate: deleteCurriculum} = useDeleteCurriculumMutation(planId, {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: searchCurriculumsQueryKey()});
        }
    });

    return (
        <List
            size="small"
            dataSource={[
                {
                    key: 'delete',
                    label: 'Удалить',
                    onClick: () => deleteCurriculum(),
                }
            ]}
            renderItem={(item) => (
                <Button
                    type={"text"}
                    onClick={item.onClick}
                    icon={<DeleteOutlined />}
                    danger
                >
                    {item.label}
                </Button>
            )}
        />
    )
};

export default PlansListPage;