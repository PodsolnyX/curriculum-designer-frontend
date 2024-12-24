import {AttestationType} from "@/pages/PlanPage/types/Subject.ts";
import {Checkbox, Popover, Tag} from "antd";
import React from "react";
import {IAttestationDto} from "@/api/axios-client.ts";

interface AttestationTypeSelectorProps {
    attestation?: IAttestationDto[];
}

const AttestationTypeSelector = ({attestation = []}: AttestationTypeSelectorProps) => {

    const Selector = () => {
        return (
            <ul>
                {
                    Object.values(AttestationType).map(type =>
                        <li key={type} className={"flex gap-1 items-center"}>
                            <Checkbox
                                value={type}
                                // checked={attestation. === type}
                            >
                                <span className={"text-[12px]"}>
                                    {/*{AttestationTypeFullName[type]}*/}
                                </span>
                            </Checkbox>
                        </li>
                    )
                }
            </ul>
        )
    }

    const _attestation = attestation && attestation[0];

    return (
        <Popover content={Selector} trigger={"click"} placement={"bottom"}>
            <Tag
                color={"default"}
                className={"m-0 hover:cursor-text"}
                bordered={false}
                onClick={(event) => event.stopPropagation()}
            >
                {
                    _attestation ? _attestation.shortName : "-"
                }
            </Tag>
        </Popover>
    )
}

export default AttestationTypeSelector;