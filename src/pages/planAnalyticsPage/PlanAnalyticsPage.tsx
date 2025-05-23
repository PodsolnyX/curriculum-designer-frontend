import PlanPageLayout from "@/widgets/PlanPageLayout/PlanPageLayout.tsx";
import {getPlanMenuItems} from "@/shared/const/planMenuItems.ts";
import {useParams} from "react-router-dom";
import {
    useGetCurriculumQuery,
} from "@/api/axios-client/CurriculumQuery.ts";
import {InputNumber, Table, Typography} from "antd";
import {useGetStatisticsQuery} from "@/api/axios-client/StatisticsQuery.ts";
import {useEffect, useState} from "react";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer} from "recharts";
import {useDebouncedValue} from "@/shared/lib/hooks/useDebouncedValue.ts";
import {StatisticsDto} from "@/api/axios-client.types.ts";

const PlanAnalyticsPage = () => {

    const {id} = useParams<{id: string}>();
    const {data} = useGetCurriculumQuery({id: Number(id)});

    const [students, setStudents] = useState<number>(40);

    const debouncedValue  = useDebouncedValue(students, 300);

    const {data: statisticData, isLoading} = useGetStatisticsQuery({curriculumId: Number(id), students: debouncedValue}, {enabled: !!id});

    const [statistic, setStatistic] = useState<StatisticsDto>({
        academicActivities: [],
        summary: undefined,
        pps: 0
    });

    useEffect(() => {
        if (statisticData) {
            setStatistic(statisticData);
        }
    }, [statisticData])

    const headerExtra = () => {
        return (
            <>
                <div className={"flex flex-col"}>
                    <Typography className={"text-sm text-stone-400"}>{data?.name}</Typography>
                    <Typography className={"text-2xl"}>{"Аналитика"}</Typography>
                </div>
            </>
        )
    }

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4D4D", "#4D00B4", "#8F00FF", "#C70039"];

    const parsedData: PieChartData[] = statistic?.academicActivities?.map((row, index) => ({
        name: row.academicActivity?.name || "Без названия",
        value: (row.rawHours / (statistic?.summary?.rawHours || 1) < 0.01 ? (statistic?.summary?.rawHours * 0.01) : row.rawHours) || 0,
        color: COLORS?.[index]
    })) || [];

    const parsedResultData: PieChartData[] = statistic?.academicActivities?.map((row, index) => ({
        name: row.academicActivity?.name || "Без названия",
        value: (row.resultHours / (statistic?.summary?.resultHours || 1) < 0.01 ? (statistic?.summary?.resultHours * 0.01) : row.resultHours) || 0,
        color: COLORS?.[index]
    })) || [];

    return (
        <PlanPageLayout
            menuItems={getPlanMenuItems(id || "")}
            currentMenuItem={"analytics"}
            headerExtra={headerExtra}
        >
            <div className={"flex flex-col gap-5 p-5"}>
                <div className={"flex gap-10 items-center"}>
                    <div className={"flex flex-col gap-2 flex-1"}>
                        <Typography.Text className={"text-xl"}>
                            Количество студентов
                        </Typography.Text>
                        <InputNumber
                            min={0}
                            max={1000}
                            value={students}
                            onChange={(value) => setStudents(Number(value))}
                            className={"w-full"}
                            onFocus={(e) => e.target.select()}
                        />
                    </div>
                    <div className={"flex flex-col align-center justify-center gap-2 shadow w-max p-3 px-8 rounded-lg"}>
                        <Typography.Text type={"secondary"}>ППС ставки</Typography.Text>
                        <Typography.Text className={"text-3xl"}>{statistic?.pps?.toFixed(3) || 0}</Typography.Text>
                    </div>
                </div>
                <Table
                    loading={isLoading}
                    pagination={false}
                    size={"middle"}
                    columns={[
                        {
                            title: "Активность",
                            dataIndex: "academicActivity",
                            key: "academicActivity",
                        },
                        {
                            title: "Сумма часов по УП",
                            dataIndex: "rawHours",
                            key: "rawHours",
                        },
                        {
                            title: "Нагрузка",
                            dataIndex: "studentHours",
                            key: "studentHours"
                        },
                        {
                            title: "Нагрузка, приведённая к ставкам",
                            dataIndex: "resultHours",
                            key: "resultHours",
                        }
                    ]}
                    rowClassName={(record, index) =>
                        index === (statistic?.academicActivities?.length + (statistic?.summary ? 1 : 0) - 1)
                            ? 'bg-gray-50 font-bold'
                            : ''
                }
                    dataSource={statistic?.academicActivities?.concat(statistic?.summary || []).map(row =>
                        ({
                            ...row,
                            academicActivity: row.academicActivity?.name,
                            resultHours: row.resultHours?.toFixed(3)
                        })) || []}
                />
                <div className={"flex flex-wrap gap-5"}>
                    <PieChartActivity
                        data={parsedData}
                        label={"Сумма часов по УП"}
                    />
                    <PieChartActivity
                        data={parsedResultData}
                        label={"Нагрузка, приведённая к ставкам"}
                    />
                </div>
            </div>
        </PlanPageLayout>
    )
}

interface PieChartData {
    name: string;
    value: number;
    color?: string;
}

interface PieChartProps {
    label?: string;
    data: PieChartData[];
}

const PieChartActivity = ({data, label}: PieChartProps) => {

    return (
        <div className={"w-full h-[300px] max-w-[530px] shadow rounded-md p-5 px-8"}>
            <Typography.Text className={"text-xl"}>{label}</Typography.Text>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="left"
                        wrapperStyle={{
                            right: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            lineHeight: "24px"
                        }}
                    />
                    <Pie
                        data={data}
                        cx="-20%"
                        cy="50%"
                        labelLine={false}
                        label={({percent }) => percent < 0.01 ? null : `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        innerRadius={20}
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PlanAnalyticsPage;