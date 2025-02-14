import {Table} from "@/pages/planTablePage/Table/Table.tsx";
import PlanTableHeader from "@/pages/planTablePage/PlanTableHeader.tsx";

const PlanTablePage = () => {
    return (
        <div className={"flex flex-col bg-stone-100 relative"}>
            <PlanTableHeader/>
            <Table/>
        </div>
    )
}

export default PlanTablePage;