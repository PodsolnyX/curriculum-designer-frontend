import {
    searchCurriculumsQueryKey,
    useUpdateCurriculumMutation
} from "@/api/axios-client/CurriculumQuery.ts";
import {Button, List, Popover} from "antd";
import {useQueryClient} from "@tanstack/react-query";
import { CurriculumStatusType} from "@/api/axios-client.types.ts";
import {CurriculumStatusTypeName} from "@/shared/const/enumRecords.tsx";
import {App} from "antd";

interface UpdateStatusModalProps {
  status: CurriculumStatusType; 
  recordId: number; 
}

export const UpdateStatusPopover = ({status, recordId}: UpdateStatusModalProps ) => {

  return (
    <div className={"flex gap-2"} style={{cursor : "pointer"}}> 

        <Popover trigger={"hover"} placement={"bottom"} content={() =>  UpdateStatusContextMenu({planId: recordId }) }>
                {CurriculumStatusTypeName[status].name  }
        </Popover>
    </div>
  );
};

interface ContextMenuProps {
    planId: number;
}


const UpdateStatusContextMenu = ({planId}: ContextMenuProps) => {

    const {message} = App.useApp();
    const queryClient = useQueryClient();

    const {mutate: updateCurriculum} = useUpdateCurriculumMutation(planId, {
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: searchCurriculumsQueryKey()});
            message.success("Статус успешно изменен");
        } 
    });
    

    return (
        <List
            size="small"
            dataSource={statusesArray} 
            renderItem={(item) => (
                <div style={{ display: 'block' }}>
                    <Button
                        type="text"
                           onClick={ () => updateCurriculum(
                            {
                                status: item.value
                            })} 
                    >
                        {item.label}
                    </Button>
                </div>
            )}
        />
    )
};

const statusesArray = Object.entries(CurriculumStatusTypeName).map(([key, value]) => ({
    value: key as CurriculumStatusType,
    label: value.name,
}))

