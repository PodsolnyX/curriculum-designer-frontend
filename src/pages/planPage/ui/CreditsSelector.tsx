import React, {useState} from "react";
import {InputNumber, Tag} from "antd";

interface CreditsSelectorProps {
    credits: number;
    onChange?: (value: number) => void;
}

const CreditsSelector = ({credits, onChange}: CreditsSelectorProps) => {

    const [isEdit, setIsEdit] = useState(false);

    const onChangeCredits = (value: number) => {
        (onChange && credits !== value) && onChange(value);
        setIsEdit(false)
    }

    return (
        <span onClick={(event) => event.stopPropagation()}>
            {
                isEdit
                    ? <InputNumber
                        size={"small"}
                        min={0}
                        max={30}
                        className={"w-[50px]"}
                        value={credits}
                        onBlur={(event) => onChangeCredits(Number(event.target.value))}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") onChangeCredits(Number(event.currentTarget.value))
                        }}
                        autoFocus={true}
                    />
                    : <Tag
                        color={"blue"}
                        className={"m-0 hover:cursor-text hover:opacity-50"}
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