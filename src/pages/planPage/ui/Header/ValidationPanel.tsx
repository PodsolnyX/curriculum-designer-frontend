import {CheckCircleOutlined, WarningOutlined} from "@ant-design/icons";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";
import {Tooltip, Typography} from "antd";

const ValidationPanel = () => {
    const { validationErrors } = usePlan();

    const hasErrors = validationErrors.length > 0;
    const color = hasErrors ? "red" : "green";
    const message = hasErrors ? "Обнаружены ошибки" : "Ошибок не обнаружено";
    const Icon = hasErrors ? WarningOutlined : CheckCircleOutlined;

    return (
        <div className="flex gap-5 items-center">
            <Tooltip title={message}>
                <div className={`flex gap-1 items-center h-max bg-${color}-500/[.1] p-2 px-3 rounded-lg`}>
                    <Typography.Text className={`text-${color}-500`}>{validationErrors.length}</Typography.Text>
                    <Icon className={`text-${color}-500`} />
                </div>
            </Tooltip>
        </div>
    );
};

export default ValidationPanel;