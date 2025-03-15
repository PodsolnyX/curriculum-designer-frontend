import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import {useParams} from "react-router-dom";
import {
    useGetCurriculumQuery,
} from "@/api/axios-client/CurriculumQuery.ts";
import {Input, Table, Typography} from "antd";
import {useGetDepartmentsQuery} from "@/api/axios-client/DepartmentQuery.ts";
import {useMemo, useState} from "react";

const PlanDepartmentPage = () => {

    const {id} = useParams<{id: string}>();
    const {data} = useGetCurriculumQuery({id: Number(id)});
    const {data: departmentsData} = useGetDepartmentsQuery({curriculumId: Number(id)}, {enabled: !!id});

    const [searchText, setSearchText] = useState("");

    const filteredData = useMemo(() => {
        if (!departmentsData) return [];
        return departmentsData.filter(department =>
            department.id.toString().includes(searchText) ||
            department.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [departmentsData, searchText]);

    const headerExtra = () => {
        return (
            <>
                <div className={"flex flex-col"}>
                    <Typography className={"text-sm text-stone-400"}>{data?.name}</Typography>
                    <Typography className={"text-2xl"}>{"Кафедры"}</Typography>
                </div>
            </>
        )
    }

    return (
        <PlanPageLayout
            menuItems={getPlanMenuItems(id || "")}
            currentMenuItem={"departments"}
            headerExtra={headerExtra}
        >
            <div className={`w-full p-5 sticky top-0 bg-white/[.5] backdrop-blur z-10`}>
                <Input.Search
                    placeholder="Поиск по номеру или названию"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full"
                />
            </div>
            <Table
                columns={[
                    {
                        title: 'Номер',
                        dataIndex: 'id',
                        key: 'id',
                    },
                    {
                        title: 'Название',
                        dataIndex: 'name',
                        key: 'name',
                    }
                ]}
                size={"small"}
                dataSource={filteredData}
                pagination={{
                    position: ["topLeft", "bottomLeft"],
                    showSizeChanger: false,
                    pageSize: 50,
                }}
            />
        </PlanPageLayout>
    )
}

export default PlanDepartmentPage;