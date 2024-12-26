import {Checkbox, Popover, Tag} from "antd";
import React from "react";
import {AttestationDto} from "@/api/axios-client.types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface AttestationTypeSelectorProps {
    attestation?: AttestationDto[];
}

const AttestationTypeSelector = ({attestation = []}: AttestationTypeSelectorProps) => {

    const {attestationTypes} = usePlan()

    const Selector = () => {
        return (
            <ul>
                {
                    attestationTypes?.map(type =>
                        <li key={type.id} className={"flex gap-1 items-center"}>
                            <Checkbox
                                value={type.id}
                                checked={attestation?.some(attestation => attestation.id === type.id)}
                            >
                                <span className={"text-[12px]"}>
                                    {type.name}
                                </span>
                            </Checkbox>
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
                {
                    attestation?.length ? attestation.map(attestation => attestation.shortName).join(", ") : "-"
                }
            </Tag>
        </Popover>
    )
}

export default AttestationTypeSelector;