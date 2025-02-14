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
import React, {useCallback} from "react";
import PageLoader from "@/shared/ui/PageLoader/PageLoader.tsx";

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

    const getColumns = useCallback(() => {
        const columns = [
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
            }),
            columnHelper.accessor("department1", {
                header: () => "Кафедра",
                cell: (props) => props.getValue(),
            })
        ];

        if (!atomsData || !semestersData || !academicActivityData) return columns;

        semestersData.forEach(semester => {

            const academicActivityColumns = academicActivityData.map(academicActivity =>
                columnHelper.accessor(`${academicActivity.id}`, {
                    header: () => academicActivity.shortName,
                    cell: (props) => props.getValue(),
                }),
            );

            columns.push(columnHelper.group({
                id: `${semester.semester.id}`,
                header: () => <span className={"text-center"}>{`Семестр ${semester.semester.number}`}</span>,
                columns: [
                    columnHelper.accessor(`attestation`, {
                        header: () => "Контроль",
                        cell: (props) => props.getValue(),
                    }),
                    columnHelper.accessor(`credits`, {
                        header: () => "ЗЕТ",
                        cell: (props) => props.getValue(),
                    }),
                    ...academicActivityColumns
                ]
            }));
        });

        console.log(columns);

        return columns;
    }, [atomsData, semestersData, academicActivityData]);

    const table = useReactTable({
        data: atomsData || [],
        columns: getColumns(),
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className={cls.tableContainer}>
            <PageLoader loading={isLoading}/>
            <table className={cls.table}>
                <thead>
                {
                    table.getHeaderGroups().map(headerGroup =>
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header =>
                                <th key={header.id} className={cls.textLeft} colSpan={header.colSpan}>
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
                                row.getVisibleCells().map(cell =>
                                    <td key={cell.id} className={cls.textLeft}>
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