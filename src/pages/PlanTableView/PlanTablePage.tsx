import {Table} from "@/pages/PlanTableView/ui/Table/Table.tsx";
import PlanTableHeader from "@/pages/PlanTableView/ui/PlanTableHeader.tsx";

const PlanTablePage = () => {
    return (
        <div className={"flex flex-col bg-stone-100 relative"}>
            <PlanTableHeader/>
            <Table/>
        </div>
    )
}

export default PlanTablePage;