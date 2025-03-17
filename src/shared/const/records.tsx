import {ReactNode} from "react";
import {CloseCircleOutlined, InfoCircleOutlined, WarningOutlined} from "@ant-design/icons";
import {ValidationLevel} from "@/api/axios-client.types.ts";
import {Typography} from "antd";

export const ValidationLevelDisplay: Record<ValidationLevel, ReactNode> = {
    [ValidationLevel.Information]: <Typography.Text className={"text-sm text-blue-500"}>
        <InfoCircleOutlined/> Информация</Typography.Text>,
    [ValidationLevel.Warning]: <Typography.Text  className={"text-sm text-yellow-500"}>
        <WarningOutlined/> Предупреждение</Typography.Text>,
    [ValidationLevel.Error]: <Typography.Text className={"text-sm text-red-600"}>
        <CloseCircleOutlined/> Ошибка</Typography.Text>
}
