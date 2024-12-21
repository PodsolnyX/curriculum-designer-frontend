import {AttestationType, AttestationTypeFullName, AttestationTypeName} from "@/pages/PlanPage/types/Subject.ts";
import {Popover, Radio, Tag} from "antd";
import React from "react";

interface AttestationTypeSelectorProps {
    attestation: AttestationType;
}

const AttestationTypeSelector = ({attestation}: AttestationTypeSelectorProps) => {

    const Selector = () => {
        return (
            <ul>
                {
                    Object.values(AttestationType).map(type =>
                        <li key={type} className={"flex gap-1 items-center"}>
                            <Radio
                                value={type}
                                checked={attestation === type}
                            >
                                <span className={"text-[12px]"}>
                                    {AttestationTypeFullName[type]}
                                </span>
                            </Radio>
                        </li>
                    )
                }
            </ul>
        )
    }

    return (
        <Popover content={Selector} trigger={"click"} placement={"bottom"}>
            <Tag
                color={"default"}
                className={"m-0 hover:cursor-text"}
                bordered={false}
                onClick={(event) => event.stopPropagation()}
            >
                {AttestationTypeName[attestation]}
            </Tag>
        </Popover>
    )
}

export default AttestationTypeSelector;