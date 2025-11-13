import { Badge, Button, List, Popover } from "antd";
import Icon, {
  CaretRightOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  TagOutlined,
  UpOutlined
} from "@ant-design/icons";
import { AtomType } from "@/api/axios-client.types.ts";
import { componentsStore } from "@/pages/PlanView/lib/stores/componentsStore/componentsStore.ts";
import classNames from "classnames";
import cls from "@/pages/PlanView/ui/widgets/AtomCard/AtomCard.module.scss";
import React from "react";
import OptionIcon from "@/shared/assets/icons/more.svg?react";
import { AtomTypeFullName } from "@/shared/const/enumRecords.tsx";

interface SubjectContextMenuProps {
  id: string;
  type: AtomType;
  neighboringSemesters: {
    prev: number | null;
    next: number | null;
  };

  expendSemester(direction: "prev" | "next"): void;
  deleteSubject(): void;
}

export const AtomContextMenu = (props: SubjectContextMenuProps) => {

  const {
    type,
    id,
    neighboringSemesters,
    expendSemester,
    deleteSubject
  } = props;

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Popover
        trigger={"click"}
        placement={"right"}
        overlayInnerStyle={{padding: 0}}
        content={
          <List
            size="small"
            itemLayout={"vertical"}
            dataSource={[
              {
                key: 'replace',
                label: 'Изменить тип',
                icon: <TagOutlined/>,
                children:
                  <List
                    size={"small"}
                    itemLayout={"vertical"}
                    dataSource={Object.values(AtomType).map(type => {
                      return {
                        key: type,
                        label: <span className={"flex gap-2"}><Badge
                          color={AtomTypeFullName[type].color}/>{AtomTypeFullName[type].name}</span>
                      }
                    })}
                    renderItem={(item) =>
                      <li className={"w-full"}>
                        <Button
                          type={"text"}
                          className={"w-full justify-start"}
                          disabled={item.key === type}
                          onClick={() => componentsStore.updateAtom(id, "type", item.key as AtomType)}
                        >{item.label}</Button>
                      </li>
                    }
                  />,
                onClick: () => {
                }
              },
              {
                key: 'addSemester',
                label: 'Продлить на семестр',
                icon: <PlusOutlined/>,
                children:
                  <List
                    size={"small"}
                    itemLayout={"vertical"}
                    dataSource={[{
                      key: "prev",
                      icon: <UpOutlined/>,
                      label: "Раньше"
                    }, {key: "next", icon: <DownOutlined/>, label: "Позже"}]}
                    renderItem={(item) =>
                      <li className={"w-full"}>
                        <Button
                          type={"text"}
                          icon={item.icon}
                          className={"w-full justify-start"}
                          onClick={() => expendSemester(item.key)}
                          disabled={item.key === "prev" && !neighboringSemesters.prev || item.key === "next" && !neighboringSemesters.next}
                        >{item.label}</Button>
                      </li>
                    }
                  />,
              },
              {
                key: 'delete',
                label: 'Удалить',
                danger: true,
                icon: <DeleteOutlined/>,
                onClick: () => deleteSubject()
              }
            ]}
            renderItem={(item) =>
              <li className={"w-full"}>
                {
                  item.children ?
                    <Popover content={item.children} placement={"right"}
                             overlayInnerStyle={{padding: 0}}>
                      <Button
                        type={"text"}
                        onClick={item.onClick}
                        icon={item.icon}
                        danger={item.danger}
                        className={"w-full justify-start"}
                      >{item.label}<CaretRightOutlined
                        className={"ml-auto"}/></Button>
                    </Popover> :
                    <Button
                      type={"text"}
                      onClick={item.onClick}
                      icon={item.icon}
                      danger={item.danger}
                      className={"w-full justify-start"}
                    >{item.label}</Button>
                }
              </li>}

          />
        }
      >
        <div
          className={classNames(cls.optionsIcon)}
          onClick={(event) => event.stopPropagation()}
        >
          <Icon component={OptionIcon}/>
        </div>
      </Popover>
    </div>
  )
}