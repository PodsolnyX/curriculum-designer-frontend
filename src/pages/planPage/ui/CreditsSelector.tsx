import React, {useEffect, useRef, useState} from "react";
import {InputNumber, Tag} from "antd";

interface CreditsSelectorProps {
    credits: number;
    onChange?: (value: number) => void;
    type?: "input" | "tag";
}

const CreditsSelector = ({credits, onChange, type = "tag"}: CreditsSelectorProps) => {

    const [isEdit, setIsEdit] = useState(false);
    const ref = useRef<HTMLInputElement | null>(null);

    const [newValue, setNewValue] = useState(credits || 0);

    useEffect(() => {
        if (credits) setNewValue(credits);
    }, [credits])

    const onSaveValue = () => {
        setIsEdit(false);
        (onChange && newValue !== credits) && onChange(newValue);
        if (ref?.current) ref.current?.blur();
    };

    return (
        type === "tag" ?
        <span className={"relative"} onClick={(event) => event.stopPropagation()}>
            <Tag
                color={"blue"}
                className={"m-0 hover:cursor-text hover:opacity-50"}
                bordered={false}
                onClick={() => setIsEdit(true)}
            >
                {`${credits} ЗЕТ`}
            </Tag>
            {
                isEdit &&
                <InputNumber
                    size={"small"}
                    min={0}
                    max={30}
                    className={`absolute top-0 left-0 bg-white z-10 w-32`}
                    value={newValue}
                    onChange={(value) => setNewValue(Number(value))}
                    onBlur={() => onSaveValue()}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onSaveValue()
                    }}
                    autoFocus={true}
                    addonBefore={"ЗЕТ"}
                />
            }
        </span> :
            <InputNumber
                size={"small"}
                min={0}
                max={30}
                ref={ref}
                className={"w-full"}
                value={newValue}
                onChange={(value) => setNewValue(Number(value))}
                onBlur={() => onSaveValue()}
                onKeyDown={(event) => {
                    if (event.key === "Enter") onSaveValue()
                }}
            />
    )
}

export default CreditsSelector;