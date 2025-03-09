import {Button, List, Popover, Typography} from "antd";
import {Link} from "react-router-dom";
import Icon, {
    LogoutOutlined,
} from "@ant-design/icons";
import React from "react";
import {getRouteMain} from "@/shared/const/router.ts";
import ProfileIcon from "@/shared/assets/icons/profile.svg?react";
import {useAuth} from "@/app/providers/AuthProvider.tsx";
import {useGetUserQuery} from "@/api/axios-client/AuthQuery.ts";
import {formatName} from "@/shared/lib/helpers/stringFormatting.ts";

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

    const {signOut} = useAuth();
    const {data} = useGetUserQuery()

    return (
        <div className={"flex h-screen"}>
            <div className={"flex-col flex bg-[#1f2c37]"}>
                <Link to={getRouteMain()} className={"bg-[#74a4a8] h-[90px] p-6 flex flex-col justify-center"}>
                    <Typography className={"text-white font-bold text-2xl"}>TSU.Plan</Typography>
                    <Typography className={"text-white text-sm"}>Конструктор учебных планов</Typography>
                </Link>
                <div className={"flex-1 pt-10"}>
                    {
                        menuItems.map(item =>
                            <Link key={item.name} to={item.path} className={`flex gap-4 border-l-4 border-solid pl-4 py-4 ${currentMenuItem === item.value ? "border-l-[#74a4a8]" : "border-l-transparent brightness-75"} transition hover:brightness-100`}>
                                <Icon component={item.icon} className={"icon-24px icon-fill-white"}/>
                                <Typography className={"text-white"}>{item.name}</Typography>
                            </Link>
                        )
                    }
                </div>
                <Popover trigger={"click"} placement={"top"}
                         overlayInnerStyle={{padding: 0}}
                         content={
                             <List
                                 size="small"
                                 itemLayout={"vertical"}
                                 dataSource={[
                                     {
                                         key: 'logout',
                                         label: 'Выйти из аккаунта',
                                         icon: <LogoutOutlined/>,
                                         onClick: () => signOut()
                                     },
                                 ]}
                                 renderItem={(item) =>
                                     <li className={"w-full"}>
                                         {
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
                    <div
                        className={`flex gap-4 pl-4 py-4 transition cursor-pointer brightness-75 hover:brightness-100 mb-2`}
                    >
                        <Icon component={ProfileIcon} className={"icon-24px icon-fill-white"}/>
                        <Typography.Text className={"text-white"}>{formatName(data?.firstName, data?.lastName)}</Typography.Text>
                    </div>
                </Popover>

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