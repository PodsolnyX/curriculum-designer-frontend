import React, {useState} from "react";
import {InputNumber, Tag} from "antd";

interface CreditsSelectorProps {
    credits: number;
}

const CreditsSelector = ({credits}: CreditsSelectorProps) => {

    const [isEdit, setIsEdit] = useState(false);

    return (
        <span onClick={(event) => event.stopPropagation()}>
            {
                isEdit
                    ? <InputNumber
                        size={"small"}
                        min={0}
                        max={30}
                        value={credits}
                        suffix={"ЗЕТ"}
                        onBlur={(value) => setIsEdit(false)}
                        autoFocus={true}
                    />
                    : <Tag
                        color={"blue"}
                        className={"m-0 hover:cursor-text"}
                        bordered={false}
                        onClick={() => setIsEdit(true)}
                    >
                        {`${credits} ЗЕТ`}
                    </Tag>
            }
        </span>
    )
}

export default CreditsSelector;