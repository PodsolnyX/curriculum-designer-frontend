import {Checkbox, Popover, Select, Tag} from "antd";
import React from "react";
import {AttestationDto} from "@/api/axios-client.types.ts";
import {usePlan} from "@/pages/planPage/provider/PlanProvider.tsx";

interface AttestationTypeSelectorProps {
    attestation: AttestationDto[];
    onChange?: (attestationIds: number[]) => void;
    type?: "tag" | "selector";
}

const AttestationTypeSelector = ({attestation, type = "tag", onChange}: AttestationTypeSelectorProps) => {

    const {attestationTypes} = usePlan()

    const onChangeCheckbox = (attestationId: number) => {
        onChange && onChange(
            attestation.find(_att => _att.id === attestationId) ?
                attestation.filter(attestation => attestation.id !== attestationId).map(_att => _att.id) :
                [...attestation.map(_att => _att.id), attestationId]
        )
    }

    const onChangeSelect = (attestationIds: number[]) => {
        onChange && onChange(attestationIds)
    }

    const Selector = () => {
        return (
            <ul>
                {
                    attestationTypes?.map(type =>
                        <li key={type.id} className={"flex gap-1 items-center"}>
                            <Checkbox
                                onChange={() => onChangeCheckbox(type.id)}
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
        type === "tag" ?
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
        </Popover> :
        <Select
            options={attestationTypes.map(type => {return{value: type.id, label: type.name}})}
            mode={"multiple"}
            size={"small"}
            value={attestation.map(att => att.id)}
            onChange={(value) => onChangeSelect(value)}
        />
    )
}

export default AttestationTypeSelector;