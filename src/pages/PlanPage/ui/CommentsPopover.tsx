import {Button, Input, Popover} from "antd";
import React, {ReactNode, useState} from "react";
import {SubjectComment} from "@/pages/PlanPage/types/Subject.ts";

interface CommentsPopoverProps {
    children: ReactNode;
    comments: SubjectComment[];
}

const CommentsPopover = ({children, comments}: CommentsPopoverProps) => {

    const [text, setText] = useState("");

    const Comments = () => {
        return (
            <div className={"flex flex-col gap-1 w-[200px]"} onClick={(event) => event.stopPropagation()}>
                {
                    comments.length ?
                        <div className={"flex flex-col gap-2 max-h-[200px] overflow-y-auto mb-1"}>
                            {
                                comments.map(comment =>
                                    <div className={"flex flex-col"} key={comment.id}>
                                        <div className={"flex gap-1 justify-between"}>
                                            <span className={"text-[10px] text-stone-400"}>{comment.author}</span>
                                            <span className={"text-[10px] text-stone-400"}>{comment.date}</span>
                                        </div>
                                        <p className={"text-black text-[12px]"}>{comment.text}</p>
                                    </div>
                                )
                            }
                        </div> : null
                }
                <Input.TextArea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    size={"small"}
                    placeholder={"Введите комментарий"}
                    autoSize={{minRows: 2, maxRows: 5}}
                />
                <Button size={"small"} type={"primary"} disabled={!text.length}>Сохранить</Button>
            </div>

        )
    }

    return (
        <Popover content={Comments} trigger={"click"} placement={"bottom"}>
            {children}
        </Popover>
    )
}

export default CommentsPopover;