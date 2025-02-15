import {
    createColumnHelper,
    flexRender,
    getCoreRowModel, getExpandedRowModel,
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
            columnHelper.display({
                id: "expand",
                cell: ({ row }) => (
                    row.getCanExpand() ? (
                        <button
                            onClick={row.getToggleExpandedHandler()}
                            className="text-stone-400"
                        >
                            {row.getIsExpanded() ? "▼" : "▶"}
                        </button>
                    ) : null
                ),
                size: 30
            }),
            columnHelper.accessor("count", {
                header: () => "Считать в плане",
                cell: (props) => <Checkbox/>,
                size: 70
            }),
            columnHelper.accessor("index", {
                header: () => "Индекс",
                size: 100,
                cell: (props) => <span className={"whitespace-nowrap text-[12px]"}>Без индекса</span>,
            }),
            columnHelper.accessor("name", {
                header: () => "Наименование",
                size: 300,
                cell: (props) => {

                    const borderColor: Record<AtomType, string> = {
                        [AtomType.Subject]: "",
                        [AtomType.Practice]: "after:bg-[#FFCC00]",
                        [AtomType.Attestation]: "after:bg-[#F90C0C]",
                        [AtomType.Elective]: "after:bg-[#8300B7]"
                    };

                    return (
                        <span className={`relative after:absolute after:h-[calc(100%+13px)] after:left-[-3px] after:top-[-7px] after:w-[2px] text-[12px] ${borderColor[props.row.original.type]}`}>
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
                    size: 50
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
                    size: 60
                })
            ]
        }));

        columns.push(columnHelper.group({
            id: `Итого академ. часов`,
            header: () => <span className={"text-center"}>{`Итого академ. часов`}</span>,
            columns: academicActivityData.map(academicActivity =>
                columnHelper.accessor(`activity-${academicActivity.id}`, {
                    header: () => academicActivity.shortName,
                    cell: (props) => props.getValue(),
                    size: 55
                }),
            )
        }));

        semestersData.forEach(semester => {

            const academicActivityColumns = academicActivityData.map(academicActivity =>
                columnHelper.accessor(`${semester.semester.id}-${academicActivity.id}`, {
                    header: () => academicActivity.shortName,
                    cell: (props) => props.getValue(),
                    size: 55
                }),
            );

            columns.push(columnHelper.group({
                id: `${semester.semester.id}`,
                header: () => <span className={"text-center"}>{`Семестр ${semester.semester.number}`}</span>,
                columns: [
                    columnHelper.accessor(`${semester.semester.id}-attestation`, {
                        header: () => "Контроль",
                        cell: (props) => props.getValue()?.map(attestation => attestation.shortName).join(", "),
                        size: 50
                    }),
                    columnHelper.accessor(`${semester.semester.id}-credits`, {
                        header: () => "ЗЕТ",
                        cell: (props) => props.getValue(),
                        size: 50
                    }),
                    ...academicActivityColumns
                ]
            }));
        });

        columns.push(
            columnHelper.accessor("department", {
                header: () => "Кафедра",
                cell: (props) => props.getValue(),
                size: 50
            })
        )

        return columns;
    }, [atomsData, semestersData, academicActivityData, attestationTypesData]);

    const parseData = useMemo(() => {
        if (!atomsData || !academicActivityData || !attestationTypesData || !modulesData) return [];

        const processAtoms = (atoms) => {
            return atoms.map(atom => {
                const total = {};

                attestationTypesData.forEach(attestationType => {
                    total[`${attestationType.id}`] = atom.semesters
                        .filter(semester => semester.attestations.find(attestation => attestation.id === attestationType.id))
                        .map(semester => semester.semester.number);
                });

                academicActivityData.forEach(academicActivity => {
                    total[`activity-${academicActivity.id}`] = atom.semesters.reduce((acc, semester) =>
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
                    id: atom.id,
                    name: atom.name,
                    department: atom.department?.id,
                    isRequired: atom.isRequired,
                    type: atom.type,
                    credits: atom.semesters.reduce((acc, semester) => acc + semester.credit, 0),
                    ...total,
                    ...semesters
                };
            });
        };

        const processModules = (modules) => {
            return modules.flatMap(module => {

                const total = {};

                attestationTypesData.forEach(attestationType => {
                    total[`${attestationType.id}`] = module.semesters
                        .filter(semester => semester.nonElective.attestations?.find(attestation => attestation.id === attestationType.id))
                        .map(semester => semester.semester.number);
                });

                academicActivityData.forEach(academicActivity => {
                    total[`activity-${academicActivity.id}`] = module.semesters.reduce((acc, semester) =>
                        acc + semester.nonElective.academicActivityHours?.find(hours => hours.academicActivity.id === academicActivity.id)?.value || undefined, 0);
                });

                const semesters = {};
                module.semesters.forEach(semester => {
                    semester.nonElective.academicActivityHours?.forEach(hoursDistribution => {
                        semesters[`${semester.semester.id}-${hoursDistribution.academicActivity.id}`] = hoursDistribution.value;
                    });
                    semesters[`${semester.semester.id}-attestation`] = semester.attestations;
                    semesters[`${semester.semester.id}-credits`] = semester.credit;
                });

                const subRows = [];

                if (module.modules?.length) {
                    subRows.push(...processModules(module.modules));
                }

                // module.modules.forEach(submodule => {
                //     subRows.push({
                //         name: submodule.name,
                //     });
                //     subRows.push(...processAtoms(submodule.atoms));
                // });

                subRows.push(...processAtoms(module.atoms));

                const rows: any = [
                    {
                        id: module.id,
                        name: module.name,
                        credits: module.semesters.reduce((acc, semester) => acc + semester.nonElective.credit, 0),
                        ...total,
                        ...semesters,
                        rowColor: "red",
                        subRows: subRows
                    }
                ];

                return rows;
            });
        };

        return [
            ...processAtoms(atomsData),
            ...processModules(modulesData)
        ];
    }, [atomsData, academicActivityData, attestationTypesData, modulesData]);

    console.log(parseData)

    const table = useReactTable({
        data: parseData,
        columns: getColumns(),
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        initialState: {expanded: true},
        getSubRows: (row) => row?.subRows || [],
    })

    return (
        <div className={cls.tableContainer}>
            <PageLoader loading={isLoading}/>
            <table
                className={cls.table}
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                style={{ tableLayout: "fixed" }}
            >
                <thead>
                {
                    table.getHeaderGroups().map(headerGroup =>
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) =>
                                <th
                                    key={header.id}
                                    className={classNames(cls.textCenter)}
                                    colSpan={header.colSpan}
                                    style={{ width: header.getSize() }}
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
                        <tr key={row.id} className={classNames(row.original?.rowColor && cls.moduleRow)} >
                            <RenderRow key={row.id} {...row}/>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </div>
    )
}

const RenderRow = (row) => {
    return (
        <React.Fragment key={row.id}>
            {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={classNames(cls.textCenter, row?.rowColor && cls.moduleRow)} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
            {row.getIsExpanded() && row.subRows?.length > 0 && (
                <td colSpan={row.getVisibleCells().length}>
                    {row.subRows.map((subRow) => RenderRow(subRow))} {/* Рекурсивный рендер для подстрок */}
                </td>
            )}
        </React.Fragment>
    );
};