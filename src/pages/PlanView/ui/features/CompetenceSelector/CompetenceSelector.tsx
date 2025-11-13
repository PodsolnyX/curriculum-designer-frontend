import {Popover, Tag, Tooltip} from "antd";
import {observer} from "mobx-react-lite";
import {commonStore} from "@/pages/PlanView/lib/stores/commonStore.ts";
import AddCompetencePopover from "@/pages/PlanView/ui/features/CompetenceSelector/AddCompetencePopover.tsx";

interface CompetenceSelectorProps {
    subjectId?: string | number;
    competencies: number[];
    onChange?: (competenceIds: number[]) => void;
    size?: "small" | "large";
}

const CompetenceSelector = observer(({competencies = [], size = "small", subjectId, onChange}: CompetenceSelectorProps) => {

    const {competenceDistributionType} = commonStore.curriculumData.settings;

    const onRemoveCompetence = (id: number) => {
        onChange?.(competencies.filter(competence => competence !== id))
    }

    return (
        <div className={`flex flex-wrap gap-1 max-h-[150px] overflow-y-auto scrollbar group items-center ${!competencies.length ? "justify-between": ""}`} onClick={(event) => event.stopPropagation()}>
            {
                competencies?.length ?
                    competencies?.map(competence =>
                        <CompetenceTag key={competence} competence={competence} size={size} onRemoveCompetence={onRemoveCompetence}/>
                    ) : <span className={`${size === "small" ? "text-[10px]" : "text-[12px]"} text-stone-400`}>Нет компетенций</span>
            }
            <Popover
                content={<AddCompetencePopover subjectId={subjectId} competencies={competencies} competenceDistributionType={competenceDistributionType} onChange={onChange}/>}
                trigger={"click"}
                placement={"bottom"}
            >
                <Tag color={"default"} className={"m-0 group-hover:opacity-100 opacity-0 cursor-pointer px-5 text-center text-stone-400 hover:text-black"} bordered={size !== "small"}>+</Tag>
            </Popover>
        </div>
    )
})

interface CompetenceTagProps {
    competence: number;
    size?: "small" | "large";
    onRemoveCompetence(competence: number): void;
}

const CompetenceTag = observer(({competence, size = "small", onRemoveCompetence}: CompetenceTagProps) => {
    const competenceInfo = commonStore.competences[competence]
    const isSelected = commonStore.isSelectedCompetence(competence);

    return (
        <Tag
            color={isSelected ? "purple" : "default"}
            className={`m-0 group/item flex px-0.5 gap-1 cursor-pointer hover:text-purple-800`}
            bordered={size !== "small"}
            key={competence}
            onClick={() => commonStore.selectCompetence(!isSelected ? competence : null)}
        >
            <Tooltip title={competenceInfo?.description}>
                <span className={`${size === "small" ? "text-[10px]" : "text-[14px]"}`}>
                    {competenceInfo?.index}
                </span>
            </Tooltip>
            <Tooltip title={"Удалить"}>
                <span
                    onClick={(event) => {
                        event.stopPropagation();
                        onRemoveCompetence(competence)
                    }}
                    className={"text-[12px] cursor-pointer text-stone-300 hover:text-stone-500 hidden group-hover/item:flex"}
                >×</span>
            </Tooltip>
        </Tag>
    )
})

export default CompetenceSelector;