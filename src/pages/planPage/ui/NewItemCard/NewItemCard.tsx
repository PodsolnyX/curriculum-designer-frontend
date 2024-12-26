import {PlusOutlined} from "@ant-design/icons";

const NewItemCard = () => {
    return (
        <div className={"bg-white/[0.6] w-[200px] min-h-[80px] flex justify-center items-center rounded-xl cursor-pointer"}>
            <PlusOutlined style={{ fontSize: "64px" }}/>
        </div>
    )
}

export default NewItemCard;