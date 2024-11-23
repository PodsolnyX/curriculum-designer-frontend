import SubjectCard, {SubjectCardProps} from "@/pages/PlanPage/SubjectCard.tsx";

export interface SemesterProps {
    number?: number;
    subjects: SubjectCardProps[]
}

const Semester = (props: SemesterProps) => {

    const {
        number = 0,
        subjects
    } = props;

    return (
        <div className={"flex min-h-[120px] relative"}>
            <div className={`sticky left-0 min-h-full z-10 flex flex-col items-center justify-center p-3 min-w-[50px] shadow-md ${number & 1 ? "bg-stone-100" : "bg-white"}`}>
                <span className={"text-[24px] text-blue-400 font-bold"}>{number}</span>
            </div>
            <div className={`flex flex-1 items-start gap-3 p-5 ${number & 1 ? "bg-stone-200" : "bg-stone-100"}`}>
                <div className={"flex flex-wrap gap-3 max-w-[80vw]"}>
                    {
                        subjects?.map(subject =>
                            <SubjectCard {...subject} key={subject.id} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Semester;