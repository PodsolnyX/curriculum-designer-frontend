import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    RowData,
    useReactTable
} from "@tanstack/react-table";
import cls from "./Table.module.sass"
import {AtomType} from "@/api/axios-client.types.ts";
import {useCurriculumData} from "@/pages/planPage/provider/useCurriculumData.ts";
import React, {useCallback, useMemo, useRef} from "react";
import PageLoader from "@/shared/ui/PageLoader/PageLoader.tsx";
import classNames from "classnames";
import {Checkbox} from "antd";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}

export const Table = () => {

    const {
        atomsData,
        modulesData,
        attestationTypesData,
        academicActivityData,
        semestersData,
        isLoading
    } = useCurriculumData({
        atomsHasNoParentModule: true
    })

    const columnHelper = createColumnHelper();

    const highlightedCol = useRef<number | null>(null);

    const handleMouseOver = (event: React.MouseEvent<HTMLTableElement>) => {
        const target = event.target as HTMLTableCellElement;
        const cellIndex = target.cellIndex;

        if (cellIndex !== undefined && highlightedCol.current !== cellIndex) {
            highlightedCol.current = cellIndex;
            document.querySelectorAll("td, th").forEach((cell) => {
                cell.classList.remove(cls.highlighted);
            });
            document.querySelectorAll(`td:nth-child(${cellIndex + 1}), th:nth-child(${cellIndex + 1})`).forEach((cell) => {
                cell.classList.add(cls.highlighted);
            });
        }
    };

    const handleMouseLeave = () => {
        document.querySelectorAll(".highlight").forEach((cell) => {
            cell.classList.remove("highlight");
        });
    };

    const getColumns = useCallback(() => {
        const columns = [
            columnHelper.accessor("count", {
                header: () => "Считать в плане",
                cell: (props) => <Checkbox/>,
            }),
            columnHelper.accessor("index", {
                header: () => "Индекс",
                cell: (props) => <span className={"whitespace-nowrap text-[12px]"}>Без индекса</span>,
            }),
            columnHelper.accessor("name", {
                header: () => "Наименование",
                cell: (props) => {

                    const borderColor: Record<AtomType, string> = {
                        [AtomType.Subject]: "border-l-[#FFFFFF]",
                        [AtomType.Practice]: "border-l-[#FFCC00]",
                        [AtomType.Attestation]: "border-l-[#F90C0C]",
                        [AtomType.Elective]: "border-l-[#8300B7]"
                    };

                    return (
                        <span className={`whitespace-nowrap text-[12px] border-l-4 border-solid ${borderColor[props.row.original.type]} px-1`}>
                        {props.getValue()}
                            <span className={"text-red-600 ml-0.5"}>
                            {props.row.original.isRequired ? "*" : ""}
                        </span>
                    </span>
                    )
                }
            })
        ];

        if (!atomsData || !semestersData || !academicActivityData || !attestationTypesData) return columns;

        columns.push(columnHelper.group({
            id: `attestation`,
            header: () => <span className={"text-center"}>{`Формы пром. атт.`}</span>,
            columns: attestationTypesData.map(attestationType =>
                columnHelper.accessor(`${attestationType.id}`, {
                    header: () => attestationType.shortName,
                    cell: (props) => props.getValue(),
                }),
            )
        }));

        columns.push(columnHelper.group({
            id: `credits`,
            header: () => <span className={"text-center"}>{`ЗЕТ`}</span>,
            columns: [
                columnHelper.accessor(`credits`, {
                    header: () => "Факт",
                    cell: (props) => props.getValue(),
                })
            ]
        }));

        columns.push(columnHelper.group({
            id: `Итого академ. часов`,
            header: () => <span className={"text-center"}>{`Итого академ. часов`}</span>,
            columns: academicActivityData.map(academicActivity =>
                columnHelper.accessor(`${academicActivity.id}`, {
                    header: () => academicActivity.shortName,
                    cell: (props) => props.getValue(),
                }),
            )
        }));

        semestersData.forEach(semester => {

            const academicActivityColumns = academicActivityData.map(academicActivity =>
                columnHelper.accessor(`${semester.semester.id}-${academicActivity.id}`, {
                    header: () => academicActivity.shortName,
                    cell: (props) => props.getValue(),
                }),
            );

            columns.push(columnHelper.group({
                id: `${semester.semester.id}`,
                header: () => <span className={"text-center"}>{`Семестр ${semester.semester.number}`}</span>,
                columns: [
                    columnHelper.accessor(`${semester.semester.id}-attestation`, {
                        header: () => "Контроль",
                        cell: (props) => props.getValue()?.map(attestation => attestation.shortName).join(", "),
                    }),
                    columnHelper.accessor(`${semester.semester.id}-credits`, {
                        header: () => "ЗЕТ",
                        cell: (props) => props.getValue(),
                    }),
                    ...academicActivityColumns
                ]
            }));
        });

        columns.push(
            columnHelper.accessor("department", {
                header: () => "Кафедра",
                cell: (props) => props.getValue(),
            })
        )

        return columns;
    }, [atomsData, semestersData, academicActivityData, attestationTypesData]);

    const parseData = useMemo(() => {
        if (!atomsData || !academicActivityData || !attestationTypesData) return [];

        return (
            atomsData.map(atom => {

                const total = {};

                attestationTypesData.forEach(attestationType => {
                    total[`${attestationType.id}`] = atom.semesters
                        .filter(semester => semester.attestations.find(attestation => attestation.id === attestationType.id))
                        .map(semester => semester.semester.number)
                });

                academicActivityData.forEach(academicActivity => {
                  total[`${academicActivity.id}`] = atom.semesters.reduce((acc, semester) =>
                      acc + semester.academicActivityHours.find(hours => hours.academicActivity.id === academicActivity.id)?.value || undefined, 0);
                });

                const semesters = {};
                atom.semesters.forEach(semester => {
                    semester.academicActivityHours.forEach(hoursDistribution => {
                        semesters[`${semester.semester.id}-${hoursDistribution.academicActivity.id}`] = hoursDistribution.value;
                    });
                    semesters[`${semester.semester.id}-attestation`] = semester.attestations;
                    semesters[`${semester.semester.id}-credits`] = semester.credit;
                });

                return {
                    name: atom.name,
                    department: atom.department?.id,
                    isRequired: atom.isRequired,
                    type: atom.type,
                    credits: atom.semesters.reduce((acc, semester) => acc + semester.credit, 0),
                    ...total,
                    ...semesters
                }
            })
        )
    }, [atomsData, academicActivityData, attestationTypesData]);

    console.log(parseData)

    const table = useReactTable({
        data: parseData,
        columns: getColumns(),
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={cls.tableContainer}>
            <PageLoader loading={isLoading}/>
            <table className={cls.table} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
                <thead>
                {
                    table.getHeaderGroups().map(headerGroup =>
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header, index) =>
                                <th
                                    key={header.id}
                                    className={classNames(cls.textCenter)}
                                    colSpan={header.colSpan}
                                >
                                    <div>
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </div>
                                </th>
                            )}
                        </tr>
                    )
                }
                </thead>
                <tbody>
                {
                    table.getRowModel().rows.map(row =>
                        <tr key={row.id}>
                            {
                                row.getVisibleCells().map((cell, index) =>
                                    <td
                                        key={cell.id}
                                        className={classNames(cls.textCenter)}

                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>)
                            }
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}