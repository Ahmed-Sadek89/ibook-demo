import cls from "./bookReports.module.scss";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {
    useTable,
    useSortBy,
    useRowSelect,
    useGlobalFilter,
} from "react-table";
import { useMemo } from "react";

const BookReportTable = ({ bookData }) => {
    const columns = useMemo(
        () => [
            {
                Header: "الصفحة",
                accessor: "page.title",
            },
            {
                Header: "قسم الصفحة",
                accessor: "page_section.title",
            },
            {
                Header: "النوع",
                accessor: "type",
            },
            {
                Header: "تصنيف الحدث",
                accessor: "event_category",
            },
            {
                Header: "إجراء الحدث",
                accessor: "event_action",
            },
            {
                Header: "وقت البدء",
                accessor: "session_start_time",
            },
            {
                Header: "وقت الإنتهاء",
                accessor: "session_end_time",
            },
            {
                Header: "الوقت الكلي",
                accessor: "total_time",
            },
        ],
        []
    );
    const tableInstance = useTable(
        { columns, data: bookData },
        useGlobalFilter,
        useSortBy,
        useRowSelect
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;
    return (
        <div className={cls.tableReports}>
            <Table {...getTableProps()}>
                <TableHead>
                    {headerGroups.map((headerGroup, idx) => (
                        <TableRow
                            key={idx}
                            {...headerGroup.getHeaderGroupProps()}
                        >
                            {headerGroup.headers.map((column, idx) => (
                                <TableCell key={idx} {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <TableRow key={i} {...row.getRowProps()}>
                                {row.cells.map((cell, idx) => {
                                    return (
                                        <TableCell key={idx} {...cell.getCellProps()}>
                                            {cell.render("Cell")}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default BookReportTable
