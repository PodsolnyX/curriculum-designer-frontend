import {CompetenceDistributionType, CompetenceDto, CompetenceType} from "@/api/axios-client.types.ts";
import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {CompetenceTypeName} from "@/shared/const/enumRecords.tsx";
import {commonStore} from "@/pages/PlanView/lib/stores/commonStore.ts";
import {Input, Segmented} from "antd";
import CompetenceItem from "@/pages/PlanView/ui/features/CompetenceSelector/CompetenceItem.tsx";

interface AddCompetencePopoverProps {
    subjectId?: string | number;
    competencies: number[];
    competenceDistributionType: CompetenceDistributionType;
    onChange?(competenceIds: number[]): void;
}

const AddCompetencePopover = observer(({subjectId, competencies, competenceDistributionType, onChange}: AddCompetencePopoverProps) => {

    const [selectedType, setSelectedType] = useState<string>(CompetenceTypeName[CompetenceType.Basic].shortName);
    const [search, setSearch] = useState<string>("");
    const [selectedCompetence, setSelectedCompetence] = useState<CompetenceDto[]>([]);

    useEffect(() => {
        setSelectedCompetence(commonStore.competencesTree
            .filter(competence => CompetenceTypeName[competence.type].shortName === selectedType)
            .filter(competence => competence.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        )
    }, [selectedType, search]);

    return (
        <div className={"flex flex-col gap-1"}>
            <Segmented
                options={Object.values(CompetenceType).map(type => CompetenceTypeName[type].shortName)}
                value={selectedType}
                onChange={setSelectedType}
                block
                size={"small"}
            />
            <Input.Search
                size={"small"}
                placeholder={"Введите часть названия"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className={"flex flex-col max-h-[300px] overflow-y-auto scrollbar"}>
                {
                    selectedCompetence.length ? selectedCompetence.map(competence =>
                        <CompetenceItem
                            competenceDistributionType={competenceDistributionType}
                            key={competence.id}
                            {...competence}
                            subjectId={subjectId}
                            competencies={competencies}
                            onChange={onChange}
                        />
                    ) : <span className={"text-stone-400 text-sm pt-2"}>Компетенций не найдено</span>
                }
            </div>
        </div>
    )
})

export default AddCompetencePopover;