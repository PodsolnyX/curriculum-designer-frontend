import {Typography} from "antd";
import {Link} from "react-router-dom";
import Icon from "@ant-design/icons";
import React from "react";
import {getRouteMain} from "@/shared/const/router.ts";

interface PlanPageLayoutProps {
    menuItems: PlanPageLayoutMenuItem[];
    currentMenuItem?: string;
    children?: React.ReactNode;
    headerExtra?: React.FC;
}

export interface PlanPageLayoutMenuItem {
    value: string,
    name: string,
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    path: string
}

const PlanPageLayout = ({menuItems, children, headerExtra, currentMenuItem}: PlanPageLayoutProps) => {
    return (
        <div className={"flex h-screen"}>
            <div className={"flex-col flex"}>
                <Link to={getRouteMain()} className={"bg-[#74a4a8] h-[90px] p-6 flex flex-col justify-center"}>
                    <Typography className={"text-white font-bold text-2xl"}>TSU.Plan</Typography>
                    <Typography className={"text-white text-sm"}>Конструктор учебных планов</Typography>
                </Link>
                <div className={"bg-[#1f2c37] flex-1 pt-10"}>
                    {
                        menuItems.map(item =>
                            <Link key={item.name} to={item.path} className={`flex gap-4 border-l-4 border-solid pl-4 py-4 ${currentMenuItem === item.value ? "border-l-[#74a4a8]" : "border-l-transparent brightness-75"} transition hover:brightness-100`}>
                                <Icon component={item.icon} className={"icon-24px icon-fill-white"}/>
                                <Typography className={"text-white"}>{item.name}</Typography>
                            </Link>
                        )
                    }
                </div>
            </div>
            <div className={"flex-1 bg-white overflow-y-auto"}>
                <div className={"w-full p-5 border-b-stone-100 border-b border-solid h-[90px] flex items-center justify-between gap-2"}>
                    {headerExtra && headerExtra({})}
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default PlanPageLayout;