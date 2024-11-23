import {Tag} from "antd";

export interface SubjectCardProps {
    id: string;
    name?: string;
    credits?: number;
    attestation?: AttestationType;
    required?: boolean;
    index?: string;
    department?: number;
    type?: SubjectType;
    notesNumber?: number;
    academicHours?: { key: string, name: string, value: number }[];
    competencies?: { value: string, name: string }[];
}

export type SubjectType = "subject" | "practice" | "stateCertification" | "elective";
export type AttestationType = "test" | "assessmentTest" | "exam";

const SubjectCard = (props: SubjectCardProps) => {

    const {
        id,
        name = "",
        credits = 0,
        attestation = "test",
        required = false,
        index = "",
        department = 0,
        type = "subject",
        notesNumber = 0,
        academicHours = [],
        competencies = []
    } = props;

    return (
        <div className={"flex flex-col gap-1.5 bg-white shadow-md p-3 rounded-xl w-[200px] h-max"}>
            <div>
                <span>{index}</span>
                <div className={"text-black text-[14px] line-clamp-2 min-h-[42px]"}>
                    {name}
                </div>
            </div>
            <div className={"flex gap-1"}>
                <Tag color={"blue"} className={"m-0"}>{`${credits} ЗЕТ`}</Tag>
                <Tag color={"default"} className={"m-0"}>{attestation}</Tag>
                <Tag className={"m-0"}>{department}</Tag>
            </div>
            {/*<div>*/}

            {/*</div>*/}
            {/*<div>*/}

            {/*</div>*/}
        </div>
    )
}

export default SubjectCard;