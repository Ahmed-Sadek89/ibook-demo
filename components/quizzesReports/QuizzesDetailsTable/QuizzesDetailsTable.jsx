import { useMemo } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Legend, Tooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { Icon } from "@iconify/react";
import {
  useTable,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
} from "react-table";

import cls from "./quizzesDetailsTable.module.scss";
import Link from "next/link";

const QuizzesDetailsTable = ({ path, data, fetchQuizAttempts }) => {
  
  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "الإختبار",
        // First group columns
        accessor: "quiz.title",
      },
      {
        // Second group - Details
        Header: "قسم الصفحة",
        // Second group columns
        accessor: "page_section.title",
      },
      {
        // Second group - Details
        Header: "عدد الأسئلة",
        // Second group columns
        accessor: "total_questions",
      },
      {
        // Second group - Details
        Header: "مجموع الدرجات",
        // Second group columns
        accessor: "total_marks",
      },
      {
        // Second group - Details
        Header: "حصل علي",
        // Second group columns
        accessor: "earned_marks",
      },
      {
        // Second group - Details
        Header: "عدد المحاولات",
        // Second group columns
        accessor: "total_attempt",
      },
      {
        // Second group - Details
        Header: "خيارات",
        // Second group columns
        Cell: ({ row }) => (
          <Link
            href={{
              pathname: path,
              query: {
                bookId: data.quizzes_attempts.data[0].book.id,
                category: 'attempts',
                quizId: row.original.quiz.id
              }
            }}
            style={{ textDecoration: "none" }}
          >
            <button onClick={() => {
              fetchQuizAttempts(row.original.quiz.id)
            }}>
              <Icon icon="mdi-light:eye" width="20px" height="20px" />
              المحاولات
            </button>
          </Link >
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: data.quizzes_attempts.data },
    useGlobalFilter,
    useSortBy,
    useRowSelect
  );

  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
  } = tableInstance;


  return (
    <div className={cls.quizzesReports}>
      <div className={cls.tableReports}>
        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, idx) => {
              const { key, ...rest } = headerGroup.getHeaderGroupProps(); // Extract the key
              return (
                <TableRow key={idx} {...rest}>
                  {headerGroup.headers.map((column, idx) => {
                    const { key: columnKey, ...columnRest } = column.getHeaderProps(); // Extract column key
                    return (
                      <TableCell key={idx} {...columnRest}>
                        {column.render("Header")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);

              const { key, ...rest } = row.getRowProps(); // Extract the key

              return (
                <TableRow key={key || i} {...rest}>
                  {row.cells.map((cell, idx) => {
                    const { key: cellKey, ...cellRest } = cell.getCellProps(); // Extract cell key
                    return (
                      <TableCell key={cellKey || idx} {...cellRest}>
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
      <div className={cls.chartsReports}>
        <div className={cls.chartsSection}>
          <h5>الكتاب</h5>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.charts.book_id}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page_section_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="num" fill="#2980b9" />
                {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cls.chartsSection}>
          <h5>قسم الصفحة</h5>
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data.charts.page_section_id}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page_section.title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="num" fill="#8884d8" />
                {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesDetailsTable;
