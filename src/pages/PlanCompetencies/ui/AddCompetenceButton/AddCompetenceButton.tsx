import {CompetenceType} from "@/api/axios-client.types.ts";
import React, {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {getCompetencesQueryKey, useCreateCompetenceMutation} from "@/api/axios-client/CompetenceQuery.ts";
import {Button, Input, Skeleton, Typography} from "antd";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";

interface AddCompetenceButtonProps {
    curriculumId: number;
    type: CompetenceType;
}

const AddCompetenceButton = ({curriculumId, type}: AddCompetenceButtonProps) => {

    const [isEdit, setIsEdit] = useState(false);
    const [newCompetence, setNewCompetence] = useState<string>("");
    const queryClient = useQueryClient();

    const {mutate, isPending} = useCreateCompetenceMutation(curriculumId, {
        onSuccess: () => {
            setIsEdit(false);
            setNewCompetence("");
            queryClient.invalidateQueries({queryKey: getCompetencesQueryKey(curriculumId)});
        }
    });

    return (
        <div className={"sticky bottom-0 bg-white/[.5] backdrop-blur"}>
            {
                isPending ? <div className={"p-5 flex gap-2 items-center"}>
                    <Skeleton.Input block size={"large"}/>
                    <Skeleton.Button shape={"circle"} size={"large"}/>
                    <Skeleton.Button shape={"circle"} size={"large"}/>
                </div> : isEdit ?
                    <div className={"p-5 flex gap-2 items-center"}>
                        <Input.TextArea
                            placeholder={"Название компетенции"}
                            autoSize={{minRows: 2, maxRows: 5}}
                            value={newCompetence}
                            onChange={e => setNewCompetence(e.target.value)}
                        />
                        <Button
                            type={"primary"}
                            icon={<PlusOutlined/>}
                            shape={"circle"}
                            size={"large"}
                            disabled={!newCompetence.length}
                            onClick={() => mutate({name: newCompetence, type})}
                        />
                        <Button
                            icon={<CloseOutlined className={"text-stone-400"}/>}
                            shape={"circle"}
                            size={"large"}
                            onClick={() => setIsEdit(false)}
                        />
                    </div> :
                    <div
                        className={"flex justify-center items-center flex-col gap-2 p-5 cursor-pointer hover:bg-stone-50 transition"}
                        onClick={() => setIsEdit(true)}>
                        <Typography className={"text-stone-600"}>Добавить компетенцию</Typography>
                        <PlusOutlined className={"text-stone-400"}/>
                    </div>
            }
        </div>
    )
}

export default AddCompetenceButton;