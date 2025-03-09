import {CheckCircleOutlined, WarningOutlined} from "@ant-design/icons";
import {Tooltip, Typography} from "antd";
import {commonStore} from "@/pages/planPage/lib/stores/commonStore.ts";
import {observer} from "mobx-react-lite";

const ValidationPanel = observer(() => {

    const hasErrors = commonStore.validationErrors?.length > 0;
    const colorBG = hasErrors ? "bg-red-500/[.1]" : "bg-green-500/[.1]";
    const colorHoverBG = hasErrors ? "hover:bg-red-500/[.2]" : "hover:bg-green-500/[.2]";
    const colorText = hasErrors ? "text-red-500" : "text-green-500";
    const message = hasErrors ? "Обнаружены ошибки" : "Ошибок не обнаружено";
    const Icon = hasErrors ? WarningOutlined : CheckCircleOutlined;

    return (
        <div className="flex gap-5 items-center">
            <Tooltip title={message} placement={"left"}>
                <div className={`flex gap-1 items-center h-max ${colorBG} ${colorHoverBG} transition p-2 px-3 rounded-lg cursor-pointer`}
                     onClick={() => commonStore.sideBarContent !== "validation"
                         ? commonStore.setSideBarContent("validation")
                         : commonStore.setSideBarContent(null)
                     }
                >
                    <Typography.Text className={colorText}>{commonStore.validationErrors?.length}</Typography.Text>
                    <Icon className={colorText} />
                </div>
            </Tooltip>
        </div>
    );
})

export default ValidationPanel;